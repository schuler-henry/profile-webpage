import { SummaryMatter } from '../studies/summaries/[summaryName]/page';
import { DatabaseAdapter } from './databaseAdapter';
import {
  PostgrestResponse,
  PostgrestSingleResponse,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js';
import { StudiesSummary, TimeTrackingTimeEntry } from './supabaseTypes';

export class SupabaseAdapter implements DatabaseAdapter {
  private static CLIENT: SupabaseClient;
  private static STUDIES_CLIENT: SupabaseClient<any, 'studies', any>;
  private static TIME_TRACKING_CLIENT: SupabaseClient<
    any,
    'time-tracking',
    any
  >;

  constructor() {
    const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey: string =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    SupabaseAdapter.CLIENT = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
    SupabaseAdapter.STUDIES_CLIENT = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: { persistSession: false },
        db: { schema: 'studies' },
      },
    );
    SupabaseAdapter.TIME_TRACKING_CLIENT = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: { persistSession: false },
        db: { schema: 'time-tracking' },
      },
    );
  }

  async getSummaryNames(): Promise<string[]> {
    const result = await SupabaseAdapter.CLIENT.storage
      .from('studies.summaries')
      .list('summaries');

    const names = result.data?.map((item) => {
      return item.name;
    });

    console.log(names);

    return names || [];
  }

  async getSummary(summaryName: string): Promise<Blob | null> {
    const exists = await SupabaseAdapter.CLIENT.rpc(
      'check_bucket_item_exists',
      { bucketId: 'studies.summaries', filePath: `summaries/${summaryName}` },
    );

    if (
      exists.data === null ||
      exists.error !== null ||
      exists.data.length === 0 ||
      !exists.data[0].success
    ) {
      return null;
    }

    const result = await SupabaseAdapter.CLIENT.storage
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
    const exists = await SupabaseAdapter.CLIENT.rpc(
      'check_bucket_item_exists',
      { bucketId: 'studies.summaries', filePath: `${filePath}.${fileType}` },
    );

    if (
      exists.data === null ||
      exists.error !== null ||
      exists.data.length === 0 ||
      !exists.data[0].success
    ) {
      return '';
    }

    const result = await SupabaseAdapter.CLIENT.storage
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
    const result = await SupabaseAdapter.STUDIES_CLIENT.from('Summary').select(`
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
    const result = await SupabaseAdapter.TIME_TRACKING_CLIENT.from('TimeEntry')
      .select('*')
      .eq('project', projectId);

    return result.data || [];
  }

  async updateTimeTrackingEntry(
    timeEntry: TimeTrackingTimeEntry,
  ): Promise<PostgrestSingleResponse<null>> {
    return await SupabaseAdapter.TIME_TRACKING_CLIENT.from('TimeEntry')
      .update([timeEntry])
      .eq('id', timeEntry.id);
  }

  async insertTimeTrackingEntry(
    timeEntry: TimeTrackingTimeEntry | { project: string; startTime?: string, date?: string },
  ): Promise<PostgrestSingleResponse<TimeTrackingTimeEntry[]>> {
    return await SupabaseAdapter.TIME_TRACKING_CLIENT.from('TimeEntry')
      .insert([timeEntry])
      .select();
  }

  async insertTimeTrackingEntries(
    timeEntries: TimeTrackingTimeEntry[],
  ): Promise<PostgrestSingleResponse<null>> {
    return await SupabaseAdapter.TIME_TRACKING_CLIENT.from('TimeEntry').insert(
      timeEntries,
    );
  }

  async deleteTimeTrackingEntry(
    id: string,
  ): Promise<PostgrestSingleResponse<null>> {
    return await SupabaseAdapter.TIME_TRACKING_CLIENT.from('TimeEntry')
      .delete()
      .eq('id', id);
  }
}
