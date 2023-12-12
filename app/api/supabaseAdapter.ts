import { DatabaseAdapter } from './databaseAdapter';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

export class SupabaseAdapter implements DatabaseAdapter {
  private static CLIENT: SupabaseClient;

  constructor() {
    const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey: string =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    SupabaseAdapter.CLIENT = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
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
    const exists = await SupabaseAdapter.CLIENT.rpc(
      'check_bucket_item_exists',
      { bucketId: 'studies.summaries', filePath: `${filePath}.pdf` },
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
      .getPublicUrl(`${filePath}.pdf`);

    return result.data?.publicUrl || '';
  }
}
