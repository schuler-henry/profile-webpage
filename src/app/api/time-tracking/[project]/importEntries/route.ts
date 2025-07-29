import { DatabaseAdapter } from '@/src/backend/data-access/database/databaseAdapter';
import { SupabaseAdapter } from '@/src/backend/data-access/database/supabaseAdapter';
import { TimeTrackingTimeEntry } from '@/src/backend/data-access/database/supabaseTypes';

export async function POST(req: Request) {
  const db: DatabaseAdapter = new SupabaseAdapter();

  const projectId = req.url.split('/')[5];

  const importedEntries: TimeTrackingTimeEntry[] = await req.json();
  console.log(importedEntries);

  const resp = await db.insertTimeTrackingEntries(importedEntries);

  if (resp.error) {
    console.log(resp.error);
    return new Response(null, {
      status: 400,
    });
  }

  const allEntries = await db.getTimeTrackingEntries(projectId);

  return new Response(JSON.stringify(allEntries), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
