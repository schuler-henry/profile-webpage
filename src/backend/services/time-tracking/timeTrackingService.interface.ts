import { Project } from '@/src/backend/data-access/database/entities/time-tracking/project';
import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';
import moment from 'moment';

export interface ITimeTrackingService {
  /**
   * Retrieves projects for a given user.
   *
   * @param userId - The ID of the user for whom to retrieve projects.
   * @returns A promise that resolves to an array of projects.
   * @throws UnauthorizedError if the user is not logged in or the userId does not match the logged-in user.
   * @throws DatabaseError if there is an error retrieving the project.
   */
  getProjects(userId: string): Promise<Project[]>;

  /**
   * Retrieves all time entries for a given project.
   *
   * @param projectId - The ID of the project for which to retrieve time entries.
   * @returns A promise that resolves to an array of time entries.
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   * @throws DatabaseError if there is an error retrieving the project or time entries.
   */
  getAllTimeEntries(projectId: string): Promise<TimeEntry[]>;

  /**
   * Creates a time entry.
   *
   * @param timeEntry - A TimeEntry object or object containing the minimal required infos project (id), date, and startTime.
   * @returns A promise that resolves when the time entry has been created.
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   * @throws DatabaseError if there is an error retrieving the project or creating the time entry.
   */
  createTimeEntry(
    timeEntry:
      | TimeEntry
      | { project: string; date: moment.Moment; startTime: moment.Moment },
  ): Promise<void>;

  /**
   * Updates an existing time entry.
   * If the time entry does not exist, no action is taken.
   *
   * @param timeEntry - A TimeEntry object containing the updated information.
   * @returns A promise that resolves when the time entry has been updated.
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   * @throws DatabaseError if there is an error retrieving the project or updating the time entry.
   */
  updateTimeEntry(timeEntry: TimeEntry): Promise<void>;

  /**
   * Deletes a time entry by its ID.
   *
   * @param timeEntryId - The ID of the time entry to be deleted.
   * @returns A promise that resolves when the time entry has been deleted.
   * @throws UnauthorizedError if the user is not logged in or the user is not authorized to access the project.
   * @throws DatabaseError if there is an error retrieving the time entry, retrieving the project or deleting the time entry.
   */
  deleteTimeEntry(timeEntryId: string): Promise<void>;
}
