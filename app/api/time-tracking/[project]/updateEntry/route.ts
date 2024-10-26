import { DatabaseAdapter } from '@/app/api/databaseAdapter';
import { SupabaseAdapter } from '@/app/api/supabaseAdapter';
import { TimeTrackingTimeEntry } from '@/app/api/supabaseTypes';

// Post endpoint
export async function POST(req: Request) {
  const db: DatabaseAdapter = new SupabaseAdapter();

  const entry: TimeTrackingTimeEntry = await req.json();

  const resp = await db.updateTimeTrackingEntry(entry);
  if (resp.error) {
    return new Response(null, {
      status: 400,
    });
  }
  return new Response(null, {
    status: 200,
  });
}
