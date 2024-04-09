import { SummaryMatter } from '../studies/summaries/[summaryName]/page';
import { DatabaseAdapter } from './databaseAdapter';
import {
  PostgrestResponse,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js';

export class SupabaseAdapter implements DatabaseAdapter {
  private static CLIENT: SupabaseClient;
  private static STUDIES_CLIENT: SupabaseClient<any, 'studies', any>;

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
}
