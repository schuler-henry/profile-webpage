import { DatabaseAdapter } from '@/app/api/databaseAdapter';
import { SupabaseAdapter } from '@/app/api/supabaseAdapter';
import moment from 'moment';

export async function GET(req: Request) {
  const db: DatabaseAdapter = new SupabaseAdapter();
  // Get project id form path
  const project = req.url.split('/')[5];

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
    startTime: moment().format('HH:mm:ss'),
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
