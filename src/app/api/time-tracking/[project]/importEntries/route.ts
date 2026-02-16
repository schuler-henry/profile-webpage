import { SupabaseAdapter } from '@/src/backend/data-access/database/supabaseAdapter';
import { TimeEntryDTO } from '@/src/app/api/data-transfer-object/timeTrackingDTO.interface';
import { TimeTrackingDatabase } from '@/src/backend/data-access/database/timeTrackingDatabase.interface';
import { AuthDatabase } from '@/src/backend/data-access/database/authDatabase.interface';
import { IUserService } from '@/src/backend/services/user/userService.interface';
import UserService from '@/src/backend/services/user/userService';
import TimeTrackingService from '@/src/backend/services/time-tracking/timeTrackingService';
import { ITimeTrackingService } from '@/src/backend/services/time-tracking/timeTrackingService.interface';
import { TimeTrackingDTOMapper } from '@/src/app/api/data-transfer-object/timeTrackingDTOMapper';
import { UnauthorizedError } from '@/src/backend/error/unauthorizedError';
import { InvalidOperationError } from '@/src/backend/error/invalidOperationError';

export async function POST(req: Request) {
  const urlJunks = req.url.split('/');
  const projectId = urlJunks[urlJunks.length - 2];

  const importedEntries: TimeEntryDTO[] = await req.json();

  const databaseConnection: AuthDatabase & TimeTrackingDatabase =
    new SupabaseAdapter();
  const userService: IUserService = new UserService(databaseConnection);
  const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
    databaseConnection,
    userService,
  );

  try {
    for (const entry of importedEntries) {
      await timeTrackingService.createTimeEntry(
        TimeTrackingDTOMapper.toTimeEntry(entry),
      );
    }
    const allEntries = await timeTrackingService.getAllTimeEntries(projectId);
    return new Response(
      JSON.stringify(
        allEntries.map((entry) => TimeTrackingDTOMapper.toDTO(entry)),
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else if (error instanceof InvalidOperationError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
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
