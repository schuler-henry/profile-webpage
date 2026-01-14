import { Project } from '@/src/backend/data-access/database/entities/time-tracking/project';
import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';
import { TimeTrackingDatabase } from '@/src/backend/data-access/database/timeTrackingDatabase.interface';
import { User } from '@supabase/supabase-js';
import { IUserService } from '@/src/backend/services/user/userService.interface';
import { ITimeTrackingService } from '@/src/backend/services/time-tracking/timeTrackingService.interface';
import { UnauthorizedError } from '@/src/backend/error/unauthorizedError';
import moment from 'moment';

export default class TimeTrackingService implements ITimeTrackingService {
  constructor(
    private readonly timeTrackingDatabase: TimeTrackingDatabase,
    private readonly userService: IUserService,
  ) {}

  /**
   * @inheritDoc ITimeTrackingService.getProjects
   * @throws UnauthorizedError if the user is not logged in or the userId does not match the logged-in user.
   * @throws DatabaseError if there is an error retrieving the project.
   */
  public async getProjects(userId: string): Promise<Project[]> {
    const loggedInUser: User | null = await this.userService.getLoggedInUser();
    if (!loggedInUser || loggedInUser.id !== userId) {
      throw new UnauthorizedError(
        'The user is not logged in or does not own the requested project.',
      );
    }

    return this.timeTrackingDatabase.getProjects(userId);
  }

  /**
   * @inheritDoc ITimeTrackingService.getAllTimeEntries
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   * @throws DatabaseError if there is an error retrieving the project or time entries.
   */
  public async getAllTimeEntries(projectId: string): Promise<TimeEntry[]> {
    const loggedInUser: User | null = await this.userService.getLoggedInUser();
    if (loggedInUser === null) {
      throw new UnauthorizedError('The user is not logged in.');
    }

    const project: Project | null =
      await this.timeTrackingDatabase.getProject(projectId);
    if (project == null) return [];
    if (project.owner != loggedInUser.id) {
      throw new UnauthorizedError(
        'The user does not own the requested project.',
      );
    }

    return this.timeTrackingDatabase.getAllTimeEntries(projectId);
  }

  /**
   * @inheritDoc ITimeTrackingService.createTimeEntry
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   * @throws DatabaseError if there is an error retrieving the project or creating the time entry.
   */
  public async createTimeEntry(
    timeEntry:
      | TimeEntry
      | { project: string; date: moment.Moment; startTime: moment.Moment },
  ): Promise<void> {
    const loggedInUser: User | null = await this.userService.getLoggedInUser();
    if (loggedInUser === null) {
      throw new UnauthorizedError('The user is not logged in.');
    }

    const project: Project | null = await this.timeTrackingDatabase.getProject(
      timeEntry.project,
    );
    if (project === null) {
      return;
    }
    if (project.owner != loggedInUser.id) {
      throw new UnauthorizedError(
        'The user does not own the requested project.',
      );
    }

    return this.timeTrackingDatabase.createTimeEntry(timeEntry);
  }

  /**
   * @inheritDoc ITimeTrackingService.updateTimeEntry
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   * @throws DatabaseError if there is an error retrieving the project or updating the time entry.
   */
  public async updateTimeEntry(timeEntry: TimeEntry) {
    const loggedInUser: User | null = await this.userService.getLoggedInUser();
    if (loggedInUser === null) {
      throw new UnauthorizedError('The user is not logged in.');
    }

    const project: Project | null = await this.timeTrackingDatabase.getProject(
      timeEntry.project,
    );
    if (project === null) {
      return;
    }
    if (project.owner !== loggedInUser.id) {
      throw new UnauthorizedError(
        'The user does not own the requested project.',
      );
    }

    return this.timeTrackingDatabase.updateTimeEntry(timeEntry);
  }

  /**
   * @inheritDoc ITimeTrackingService.deleteTimeEntry
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   * @throws DatabaseError if there is an error retrieving the time entry, retrieving the project or deleting the time entry.
   */
  public async deleteTimeEntry(timeEntryId: string) {
    const loggedInUser: User | null = await this.userService.getLoggedInUser();
    if (loggedInUser === null) {
      throw new UnauthorizedError('The user is not logged in.');
    }

    const timeEntry: TimeEntry | null =
      await this.timeTrackingDatabase.getTimeEntry(timeEntryId);
    if (timeEntry === null) {
      return;
    }

    const project: Project | null = await this.timeTrackingDatabase.getProject(
      timeEntry.project,
    );
    if (project === null) {
      return;
    }
    if (project.owner !== loggedInUser.id) {
      throw new UnauthorizedError(
        'The user does not own the requested project.',
      );
    }

    return this.timeTrackingDatabase.deleteTimeEntry(timeEntryId);
  }
}
