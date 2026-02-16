import { SupabaseAdapter } from '@/src/backend/data-access/database/supabaseAdapter';
import { AuthDatabase } from '@/src/backend/data-access/database/authDatabase.interface';
import { TimeTrackingDatabase } from '@/src/backend/data-access/database/timeTrackingDatabase.interface';
import { IUserService } from '@/src/backend/services/user/userService.interface';
import { ITimeTrackingService } from '@/src/backend/services/time-tracking/timeTrackingService.interface';
import UserService from '@/src/backend/services/user/userService';
import TimeTrackingService from '@/src/backend/services/time-tracking/timeTrackingService';
import { UnauthorizedError } from '@/src/backend/error/unauthorizedError';

export async function POST(req: Request) {
  const { id }: { id: string } = await req.json();

  const databaseConnection: AuthDatabase & TimeTrackingDatabase =
    new SupabaseAdapter();
  const userService: IUserService = new UserService(databaseConnection);
  const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
    databaseConnection,
    userService,
  );

  try {
    await timeTrackingService.deleteTimeEntry(id);
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
