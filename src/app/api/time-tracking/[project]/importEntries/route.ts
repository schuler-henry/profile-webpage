import { DatabaseAdapter } from '@/src/app/api/databaseAdapter';
import { SupabaseAdapter } from '@/src/app/api/supabaseAdapter';
import { TimeTrackingTimeEntry } from '@/src/app/api/supabaseTypes';

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
