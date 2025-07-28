import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SummaryMatter } from '../studies/summaries/[summaryName]/page';
import { TimeTrackingTimeEntry } from './supabaseTypes';

export abstract class DatabaseAdapter {
  abstract getSummaryNames(): Promise<string[]>;
  abstract getSummary(summaryName: string): Promise<Blob | null>;
  abstract getSummaryPDFUrl(filePath: string): Promise<string>;
  abstract getSummaryElementUrl(
    filePath: string,
    fileType: string,
  ): Promise<string>;
  abstract getSummaryMatters(): Promise<SummaryMatter[]>;

  abstract getTimeTrackingEntries(
    projectId: string,
  ): Promise<TimeTrackingTimeEntry[]>;
  abstract updateTimeTrackingEntry(
    timeEntry: TimeTrackingTimeEntry,
  ): Promise<PostgrestSingleResponse<null>>;
  abstract insertTimeTrackingEntry(
    timeEntry: TimeTrackingTimeEntry | { project: string; startTime?: string, date?: string },
  ): Promise<PostgrestSingleResponse<TimeTrackingTimeEntry[]>>;
  abstract insertTimeTrackingEntries(
    timeEntries: TimeTrackingTimeEntry[],
  ): Promise<PostgrestSingleResponse<null>>;
  abstract deleteTimeTrackingEntry(
    id: string,
  ): Promise<PostgrestSingleResponse<null>>;
}
