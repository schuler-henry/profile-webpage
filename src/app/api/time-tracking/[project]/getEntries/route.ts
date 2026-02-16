import { SupabaseAdapter } from '@/src/backend/data-access/database/supabaseAdapter';
import { ITimeTrackingService } from '@/src/backend/services/time-tracking/timeTrackingService.interface';
import TimeTrackingService from '@/src/backend/services/time-tracking/timeTrackingService';
import { TimeTrackingDatabase } from '@/src/backend/data-access/database/timeTrackingDatabase.interface';
import { IUserService } from '@/src/backend/services/user/userService.interface';
import UserService from '@/src/backend/services/user/userService';
import { AuthDatabase } from '@/src/backend/data-access/database/authDatabase.interface';
import { UnauthorizedError } from '@/src/backend/error/unauthorizedError';
import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';
import { TimeTrackingDTOMapper } from '@/src/app/api/data-transfer-object/timeTrackingDTOMapper';

export const revalidate = 60;

export async function GET(req: Request) {
  const urlJunks = req.url.split('/');
  const projectId = urlJunks[urlJunks.length - 2];

  const databaseConnection: AuthDatabase & TimeTrackingDatabase =
    new SupabaseAdapter();
  const userService: IUserService = new UserService(databaseConnection);
  const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
    databaseConnection,
    userService,
  );

  try {
    const timeEntries: TimeEntry[] =
      await timeTrackingService.getAllTimeEntries(projectId);

    return new Response(
      JSON.stringify(
        timeEntries.map((entry) => TimeTrackingDTOMapper.toDTO(entry)),
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error(error);
    if (error instanceof UnauthorizedError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
