import { SupabaseAdapter } from '@/src/backend/data-access/database/supabaseAdapter';
import { TimeEntryDTO } from '@/src/app/api/data-transfer-object/timeTrackingDTO.interface';
import { AuthDatabase } from '@/src/backend/data-access/database/authDatabase.interface';
import { TimeTrackingDatabase } from '@/src/backend/data-access/database/timeTrackingDatabase.interface';
import { IUserService } from '@/src/backend/services/user/userService.interface';
import UserService from '@/src/backend/services/user/userService';
import { ITimeTrackingService } from '@/src/backend/services/time-tracking/timeTrackingService.interface';
import TimeTrackingService from '@/src/backend/services/time-tracking/timeTrackingService';
import { TimeTrackingDTOMapper } from '@/src/app/api/data-transfer-object/timeTrackingDTOMapper';
import { UnauthorizedError } from '@/src/backend/error/unauthorizedError';

// Post endpoint
export async function POST(req: Request) {
  const entry: TimeEntryDTO = await req.json();

  const databaseConnection: AuthDatabase & TimeTrackingDatabase =
    new SupabaseAdapter();
  const userService: IUserService = new UserService(databaseConnection);
  const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
    databaseConnection,
    userService,
  );

  try {
    await timeTrackingService.updateTimeEntry(
      TimeTrackingDTOMapper.toTimeEntry(entry),
    );
    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
