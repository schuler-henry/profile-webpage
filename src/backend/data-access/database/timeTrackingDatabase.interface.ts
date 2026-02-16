import { Project } from '@/src/backend/data-access/database/entities/time-tracking/project';
import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';
import { Moment } from 'moment';

/**
 * Interface for all database operations related to the time-tracking schema.
 */
export interface TimeTrackingDatabase {
  /**
   * Retrieves a project by its ID.
   * @param id The ID of the project to be retrieved.
   * @return A promise that resolves to a Project object or null if not found.
   * @throws {@link DatabaseError} if there is an error retrieving the project.
   */
  getProject(id: string): Promise<Project | null>;

  /**
   * Retrieves all projects for a given owner.
   * @param ownerId The ID of the owner whose projects are to be retrieved.
   * @return A promise that resolves to an array of Project objects.
   * @thrwos {@link DatabaseError} if there is an error retrieving the projects.
   */
  getProjects(ownerId: string): Promise<Project[]>;

  /**
   * Retrieves a time entry by its ID.
   * @param id The ID of the project to be retrieved.
   * @return A promise that resolves to a TimeEntry object or null if not found.
   * @throws {@link DatabaseError} if there is an error retrieving the time entry.
   */
  getTimeEntry(id: string): Promise<TimeEntry | null>;

  /**
   * Retrieves all time entries for a given project.
   * @param projectId The ID of the project whose time entries are to be retrieved.
   * @return A promise that resolves to an array of TimeEntry objects.
   * @throws {@link DatabaseError} if there is an error retrieving the time entries.
   */
  getAllTimeEntries(projectId: string): Promise<TimeEntry[]>;

  /**
   * Creates multiple time entries and returns the created entries.
   * @param timeEntries An array of TimeEntry objects or objects containing the minimal required infos project (id), date, and startTime.
   * @return A promise that resolves to the created entries once the time entries have been created.
   * @throws {@link DatabaseError} if there is an error creating the time entries.
   */
  createTimeEntries(
    timeEntries: (
      | TimeEntry
      | { project: string; date: Moment; startTime: Moment }
    )[],
  ): Promise<TimeEntry[]>;

  /**
   * Creates a single time entry and returns the created entry.
   * @param timeEntry A TimeEntry object or an object containing the minimal required infos project (id), date, and startTime.
   * @return A promise that resolves to the created entry once the time entry has been created.
   * @throws {@link DatabaseError} if there is an error creating the time entry.
   */
  createTimeEntry(
    timeEntry: TimeEntry | { project: string; date: Moment; startTime: Moment },
  ): Promise<TimeEntry>;

  /**
   * Updates the existing time entry with the provided id in {@link timeEntry}.
   * @param timeEntry A TimeEntry object containing the updated information.
   * @return A promise that resolves when the time entry has been updated.
   * @throws {@link DatabaseError} if there is an error updating the time entry.
   */
  updateTimeEntry(timeEntry: TimeEntry): Promise<void>;

  /**
   * Deletes a time entry by its ID.
   * @param timeEntryId The ID of the time entry to be deleted.
   * @return A promise that resolves when the time entry has been deleted.
   * @throws {@link DatabaseError} if there is an error deleting the time entry.
   */
  deleteTimeEntry(timeEntryId: string): Promise<void>;
}
