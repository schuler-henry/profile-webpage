import { DatabaseAdapter } from '@/src/backend/data-access/database/databaseAdapter';
import { SupabaseAdapter } from '@/src/backend/data-access/database/supabaseAdapter';
import { TimeTrackingTimeEntry } from '@/src/backend/data-access/database/supabaseTypes';

export const revalidate = 60;

export async function GET(req: Request) {
  const db: DatabaseAdapter = new SupabaseAdapter();
  // Get project id form path
  const project = req.url.split('/')[5];
  const timeEntries: TimeTrackingTimeEntry[] =
    await db.getTimeTrackingEntries(project);

  return new Response(JSON.stringify(timeEntries), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
