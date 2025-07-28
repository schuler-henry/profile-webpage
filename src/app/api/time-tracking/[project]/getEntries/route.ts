import { DatabaseAdapter } from '../../../databaseAdapter';
import { SupabaseAdapter } from '../../../supabaseAdapter';
import { TimeTrackingTimeEntry } from '@/src/app/api/supabaseTypes';

export const revalidate = 60;

export async function GET(req: Request) {
  const db: DatabaseAdapter = new SupabaseAdapter();
  // Get project id form path
  const project = req.url.split('/')[5];
  const timeEntries: TimeTrackingTimeEntry[] = await db.getTimeTrackingEntries(
    project,
  );

  return new Response(JSON.stringify(timeEntries), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
