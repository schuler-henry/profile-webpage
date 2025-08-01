import { SummaryMatter } from '@/src/app/studies/summaries/[summaryName]/page';
import { DatabaseAdapter } from './databaseAdapter';
import {
  PostgrestResponse,
  PostgrestSingleResponse,
  User,
  UserResponse,
} from '@supabase/supabase-js';
import { StudiesSummary, TimeTrackingTimeEntry } from './supabaseTypes';
import { TimeTrackingDatabase } from '@/src/backend/data-access/database/timeTrackingDatabase.interface';
import { Project } from '@/src/backend/data-access/database/entities/time-tracking/project';
import { DatabaseError } from '@/src/backend/data-access/database/databaseError';
import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';
import moment, { isMoment, Moment } from 'moment';
import { deepClone } from '@vitest/utils';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/src/utils/supabase/server';
import { AuthDatabase } from '@/src/backend/data-access/database/authDatabase.interface';

export class SupabaseAdapter
  implements DatabaseAdapter, AuthDatabase, TimeTrackingDatabase
{
  constructor() {}

  async getLoggedInUser(): Promise<User | null> {
    const client = await createClient();
    const response: UserResponse = await client.auth.getUser();

    if (response.error || !response.data.user) {
      return null;
    }

    return response.data.user;
  }

  async getSummaryNames(): Promise<string[]> {
    const client = await createClient();
    const result = await client.storage
      .from('studies.summaries')
      .list('summaries');

    const names = result.data?.map((item) => {
      return item.name;
    });

    console.log(names);

    return names || [];
  }

  async getSummary(summaryName: string): Promise<Blob | null> {
    const client = await createClient();
    const exists = await client.rpc('check_bucket_item_exists', {
      bucketId: 'studies.summaries',
      filePath: `summaries/${summaryName}`,
    });

    if (
      exists.data === null ||
      exists.error !== null ||
      exists.data.length === 0 ||
      !exists.data[0].success
    ) {
      return null;
    }

    const result = await client.storage
      .from('studies.summaries')
      .download(`summaries/${summaryName}`);

    return result.data;
  }

  async getSummaryPDFUrl(filePath: string): Promise<string> {
    return this.getSummaryElementUrl(filePath, 'pdf');
  }

  async getSummaryElementUrl(
    filePath: string,
    fileType: string,
  ): Promise<string> {
    const client = await createClient();
    const exists = await client.rpc('check_bucket_item_exists', {
      bucketId: 'studies.summaries',
      filePath: `${filePath}.${fileType}`,
    });

    if (
      exists.data === null ||
      exists.error !== null ||
      exists.data.length === 0 ||
      !exists.data[0].success
    ) {
      return '';
    }

    const result = client.storage
      .from('studies.summaries')
      .getPublicUrl(`${filePath}.${fileType}`);

    return result.data?.publicUrl || '';
  }

  // REWORK
  getStudiesSummaryMatterFromResponse(
    dbResponse: PostgrestResponse<StudiesSummary>,
  ): SummaryMatter[] {
    if (
      dbResponse.data === null ||
      dbResponse.error !== null ||
      dbResponse.data.length === 0
    ) {
      return [];
    }

    const allSummaryMatters: SummaryMatter[] = [];

    for (const matter of dbResponse.data) {
      const summaryMatter: SummaryMatter = {
        id: matter.id,
        title: matter.title,
        description: matter.description,
        lastModified: new Date(matter.lastModified || ''),
        fileName: matter.file,
        semester: matter.semester,
        degree:
          typeof matter.degree === 'object' ? matter.degree.degree : undefined,
        degreeSubject:
          typeof matter.degree === 'object'
            ? matter.degree?.subject
            : undefined,
        language:
          typeof matter.language === 'object'
            ? matter.language?.code
            : matter.language,
        university:
          typeof matter.university === 'object'
            ? matter.university?.name
            : matter.university,
        semesterPeriod:
          typeof matter.semesterPeriod === 'object'
            ? matter.semesterPeriod.name
            : matter.semesterPeriod,
        professors: matter.professors,
      };

      allSummaryMatters.push(summaryMatter);
    }

    return allSummaryMatters;
  }

  async selectStudiesSummary(): Promise<PostgrestResponse<StudiesSummary>> {
    const client = await createClient({ db: { schema: 'studies' } });
    const result = await client.from('Summary').select(`
        id,
        title,
        description,
        lastModified,
        file,
        semester,
        degree:Degree(*),
        language:Language(*),
        university:University(*),
        semesterPeriod:Semester(*),
        professors:Professor(*)
      `);

    return result as PostgrestResponse<StudiesSummary>;
  }

  async getSummaryMatters(): Promise<SummaryMatter[]> {
    return this.getStudiesSummaryMatterFromResponse(
      await this.selectStudiesSummary(),
    );
  }

  async getTimeTrackingEntries(
    projectId: string,
  ): Promise<TimeTrackingTimeEntry[]> {
    const client = await createClient({ db: { schema: 'time-tracking' } });
    const result = await client
      .from('TimeEntry')
      .select('*')
      .eq('project', projectId);

    return result.data || [];
  }

  async updateTimeTrackingEntry(
    timeEntry: TimeTrackingTimeEntry,
  ): Promise<PostgrestSingleResponse<null>> {
    const client = await createClient({ db: { schema: 'time-tracking' } });
    return client.from('TimeEntry').update([timeEntry]).eq('id', timeEntry.id);
  }

  async insertTimeTrackingEntry(
    timeEntry:
      | TimeTrackingTimeEntry
      | { project: string; startTime?: string; date?: string },
  ): Promise<PostgrestSingleResponse<TimeTrackingTimeEntry[]>> {
    const client = await createClient({ db: { schema: 'time-tracking' } });
    return client.from('TimeEntry').insert([timeEntry]).select();
  }

  async insertTimeTrackingEntries(
    timeEntries: TimeTrackingTimeEntry[],
  ): Promise<PostgrestSingleResponse<null>> {
    const client = await createClient({ db: { schema: 'time-tracking' } });
    return client.from('TimeEntry').insert(timeEntries);
  }

  async deleteTimeTrackingEntry(
    id: string,
  ): Promise<PostgrestSingleResponse<null>> {
    const client = await createClient({ db: { schema: 'time-tracking' } });
    return client.from('TimeEntry').delete().eq('id', id);
  }

  public async getProjects(ownerId: string): Promise<Project[]> {
    const client = await createClient({ db: { schema: 'time-tracking' } });
    const response: PostgrestSingleResponse<Project[]> = await client
      .from('Project')
      .select('*')
      .eq('owner', ownerId);

    if (response.error) {
      throw new DatabaseError(response.error.message);
    }

    if (!response.data) {
      return [];
    }

    return response.data.map((project) => {
      return {
        id: project.id,
        name: project.name,
        owner: project.owner,
        description: project.description || '',
        createdAt: project.createdAt
          ? moment(project.createdAt, 'YYYY-MM-DD HH:mm:ss.SSSZ')
          : moment(),
      };
    });
  }

  private formatAndNormalizeTimeEntries(
    timeEntries: (
      | TimeEntry
      | { project: string; date: Moment; startTime: Moment }
    )[],
  ): {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
    project: string;
  }[] {
    return timeEntries.map((entry) => {
      const formattedEntry: any = deepClone(entry);

      // Step 1: Format moment to string
      if (formattedEntry.date && isMoment(formattedEntry.date)) {
        formattedEntry.date = formattedEntry.date.format('YYYY-MM-DD');
      }
      if (formattedEntry.startTime && isMoment(formattedEntry.startTime)) {
        formattedEntry.startTime = formattedEntry.startTime.format('HH:mm:ss');
      }
      if (formattedEntry.endTime && isMoment(formattedEntry.endTime)) {
        formattedEntry.endTime = formattedEntry.endTime.format('HH:mm:ss');
      }

      // Step 2: Assure that all entries have a valid uuid
      if (!formattedEntry.id) {
        formattedEntry.id = uuidv4();
      }

      // Step 3: Ensure that the description is a string
      if (typeof formattedEntry.description !== 'string') {
        formattedEntry.description = '';
      }

      return formattedEntry as {
        id: string;
        date: string;
        startTime: string;
        endTime: string;
        description: string;
        project: string;
      };
    });
  }

  public async getAllTimeEntries(projectId: string): Promise<TimeEntry[]> {
    const client = await createClient({ db: { schema: 'time-tracking' } });
    const result: PostgrestSingleResponse<TimeEntry[]> = await client
      .from('TimeEntry')
      .select('*')
      .eq('project', projectId);

    if (result.error) {
      throw new DatabaseError(result.error.message);
    }

    if (!result.data) {
      return [];
    }

    return result.data.map((entry) => {
      return {
        id: entry.id,
        project: entry.project,
        date: entry.date ? moment(entry.date, 'YYYY-MM-DD') : moment(),
        startTime: entry.startTime
          ? moment(entry.startTime, 'HH:mm:ss')
          : moment(),
        endTime: entry.endTime ? moment(entry.endTime, 'HH:mm:ss') : null,
        description: entry.description || '',
      } as TimeEntry;
    });
  }

  public async createTimeEntries(
    timeEntries: (
      | TimeEntry
      | { project: string; date: Moment; startTime: Moment }
    )[],
  ): Promise<void> {
    // Assure that all moment elements are correctly formatted as strings in TimeEntry
    const formattedTimeEntries =
      this.formatAndNormalizeTimeEntries(timeEntries);

    const client = await createClient({ db: { schema: 'time-tracking' } });
    const result: PostgrestSingleResponse<null> = await client
      .from('TimeEntry')
      .insert(formattedTimeEntries);

    if (result.error) {
      let errorMessage: string = 'Could not create time entries.';

      if (result.error.message.includes('duplicate key value')) {
        errorMessage = 'The time entry already exists and can only be updated.';
      }

      throw new DatabaseError(errorMessage, result.error);
    }
  }

  public async createTimeEntry(
    timeEntry: TimeEntry | { project: string; date: Moment; startTime: Moment },
  ): Promise<void> {
    return this.createTimeEntries([timeEntry]);
  }

  public async updateTimeEntry(timeEntry: TimeEntry): Promise<void> {
    const formattedEntry = this.formatAndNormalizeTimeEntries([timeEntry])[0];
    console.log(formattedEntry);

    const client = await createClient({ db: { schema: 'time-tracking' } });
    const result: PostgrestSingleResponse<null> = await client
      .from('TimeEntry')
      .update(formattedEntry)
      .eq('id', formattedEntry.id);

    console.log(result);
    if (result.error) {
      throw new DatabaseError(
        `Could not update time entry with ID ${timeEntry.id}.`,
        result.error,
      );
    }
  }

  public async deleteTimeEntry(timeEntryId: string): Promise<void> {
    const client = await createClient({ db: { schema: 'time-tracking' } });
    const result: PostgrestSingleResponse<null> = await client
      .from('TimeEntry')
      .delete()
      .eq('id', timeEntryId);

    if (result.error) {
      throw new DatabaseError(result.error.message);
    }
  }
}
