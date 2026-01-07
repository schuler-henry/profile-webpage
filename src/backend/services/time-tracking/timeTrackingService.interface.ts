import { Project } from '@/src/backend/data-access/database/entities/time-tracking/project';
import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';

export interface ITimeTrackingService {
  /**
   * Retrieves projects for a given user.
   *
   * @param userId - The ID of the user for whom to retrieve projects.
   * @returns A promise that resolves to an array of projects.
   * @throws UnauthorizedError if the user is not logged in or the userId does not match the logged-in user.
   */
  getProjects(userId: string): Promise<Project[]>;

  /**
   * Retrieves all time entries for a given project.
   *
   * @param projectId - The ID of the project for which to retrieve time entries.
   * @returns A promise that resolves to an array of time entries.
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   */
  getAllTimeEntries(projectId: string): Promise<TimeEntry[]>;

  /**
   * Creates a time entry.
   *
   * @param timeEntry - A TimeEntry object or object containing the minimal required infos project (id), date, and startTime.
   * @returns A promise that resolves when the time entry has been created.
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   */
  createTimeEntry(
    timeEntry: TimeEntry | { project: string; date: Date; startTime: Date },
  ): Promise<void>;

  /**
   * Updates an existing time entry.
   *
   * @param timeEntry - A TimeEntry object containing the updated information.
   * @returns A promise that resolves when the time entry has been updated.
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   */
  updateTimeEntry(timeEntry: TimeEntry): Promise<void>;

  /**
   * Deletes a time entry by its ID.
   *
   * @param timeEntryId - The ID of the time entry to be deleted.
   * @returns A promise that resolves when the time entry has been deleted.
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   */
  deleteTimeEntry(timeEntryId: string): Promise<void>;
}
