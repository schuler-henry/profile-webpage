import { DatabaseAdapter } from '@/src/backend/data-access/database/databaseAdapter';
import { SupabaseAdapter } from '@/src/backend/data-access/database/supabaseAdapter';

export async function POST(req: Request) {
  const db: DatabaseAdapter = new SupabaseAdapter();
  // Get project id form path
  const project = req.url.split('/')[5];

  const { startTime, date }: { startTime: string; date: string } =
    await req.json();

  const currentTimeEntries = await db.getTimeTrackingEntries(project);
  if (currentTimeEntries.find((entry) => !entry.endTime)) {
    return new Response(
      JSON.stringify({
        error: 'There is already a running time entry for this project.',
      }),
      {
        status: 400,
      },
    );
  }

  const { data: timeEntries, error } = await db.insertTimeTrackingEntry({
    project: project,
    startTime: startTime,
    date: date,
  });

  if (error || timeEntries.length === 0) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create time entry.',
      }),
      {
        status: 500,
      },
    );
  }

  return new Response(JSON.stringify(timeEntries[0]), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
