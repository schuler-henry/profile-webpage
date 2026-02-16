import { SummaryMatter } from '@/src/app/studies/summaries/[summaryName]/page';
import { DatabaseAdapter } from '@/src/backend/data-access/database/databaseAdapter';
import { SupabaseAdapter } from '@/src/backend/data-access/database/supabaseAdapter';

export const revalidate = 60;

export async function GET() {
  const db: DatabaseAdapter = new SupabaseAdapter();
  const matters: SummaryMatter[] = await db.getSummaryMatters();

  return new Response(JSON.stringify(matters), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
