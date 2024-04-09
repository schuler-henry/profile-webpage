import { SummaryMatter } from '@/app/studies/summaries/[summaryName]/page';
import { DatabaseAdapter } from '../../../databaseAdapter';
import { SupabaseAdapter } from '../../../supabaseAdapter';

export const revalidate = 60;

export async function GET(req: Request) {
  const db: DatabaseAdapter = new SupabaseAdapter();
  const matters: SummaryMatter[] = await db.getSummaryMatters();

  return new Response(JSON.stringify(matters), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
