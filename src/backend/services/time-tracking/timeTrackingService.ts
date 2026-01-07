import { Project } from '@/src/backend/data-access/database/entities/time-tracking/project';
import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';
import { TimeTrackingDatabase } from '@/src/backend/data-access/database/timeTrackingDatabase.interface';
import { User } from '@supabase/supabase-js';
import { IUserService } from '@/src/backend/services/user/userService.interface';
import { ITimeTrackingService } from '@/src/backend/services/time-tracking/timeTrackingService.interface';
import { UnauthorizedError } from '@/src/backend/error/unauthorizedError';

export default class TimeTrackingService implements ITimeTrackingService {
  constructor(
    private readonly timeTrackingDatabase: TimeTrackingDatabase,
    private readonly userService: IUserService,
  ) {}

  public async getProjects(userId: string): Promise<Project[]> {
    const loggedInUser: User | null = await this.userService.getLoggedInUser();
    if (!loggedInUser || loggedInUser.id !== userId) {
      // TODO: Update tests and other methods to be compatible with this method throwing errors.
      throw new UnauthorizedError(
        'The user is not logged in or does not own the requested project.',
      );
    }

    return this.timeTrackingDatabase.getProjects(userId);
  }

  public async getAllTimeEntries(projectId: string): Promise<TimeEntry[]> {
    const loggedInUser: User | null = await this.userService.getLoggedInUser();
    if (loggedInUser == null) return [];

    const project: Project | null =
      await this.timeTrackingDatabase.getProject(projectId);
    if (project == null || project.owner != loggedInUser.id) return [];

    return this.timeTrackingDatabase.getAllTimeEntries(projectId);
  }

  public async createTimeEntry(
    timeEntry: TimeEntry | { project: string; date: Date; startTime: Date },
  ): Promise<void> {
    //   TODO: Continue implementation and writing tests for TimeTrackingService.
  }

  public async updateTimeEntry(timeEntry: TimeEntry) {}

  public async deleteTimeEntry(timeEntryId: string) {}
}
