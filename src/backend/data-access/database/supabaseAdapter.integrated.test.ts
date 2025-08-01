import { SummaryMatter } from '@/src/app/studies/summaries/[summaryName]/page';
import { SupabaseAdapter } from './supabaseAdapter';
import { StudiesSummary } from './supabaseTypes';
import { TimeTrackingDatabase } from '@/src/backend/data-access/database/timeTrackingDatabase.interface';
import moment, { isMoment } from 'moment';
import { Project } from '@/src/backend/data-access/database/entities/time-tracking/project';
import { User } from '@supabase/supabase-js';
import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';
import { Moment } from 'moment/moment';
import { DatabaseError } from '@/src/backend/data-access/database/databaseError';

describe('supabaseAdapter', () => {
  const dbUser: User = {
    id: 'c2f0449a-a510-47be-885d-58c18662cdea',
    aud: 'authenticated',
    app_metadata: { provider: 'github', providers: ['github'] },
    user_metadata: {},
    created_at: '2024-10-22 19:59:14.834447+00',
  };
  const otherDbUser: User = {
    id: '5ebd4db3-abc0-4f32-8459-325eecdead3e',
    aud: 'authenticated',
    app_metadata: { provider: 'github', providers: ['github'] },
    user_metadata: {},
    created_at: '2025-02-01 03:29:16.533571+00',
  };

  it('should be created', () => {
    // Arrange
    const supabaseAdapter = new SupabaseAdapter();
    // Act
    // Assert

    expect(supabaseAdapter).toBeTruthy();
  });

  describe.skip('studies schema', () => {
    it('should get summary matter', async () => {
      // Arrange
      const supabaseAdapter = new SupabaseAdapter();
      // Act
      const names = await supabaseAdapter.selectStudiesSummary();
      // Assert
      expect(names).toEqual({
        error: null,
        status: 200,
        statusText: 'OK',
        count: null,
        data: expect.arrayContaining<StudiesSummary>([
          {
            title: 'Softwarequalitaetssicherung',
            description: 'Zusammenfassung für die mündliche Prüfung',
            file: 'softwarequalitaetssicherung.mdx',
            lastModified: '2024-03-04',
            degree: {
              degree: 'M. Sc.',
              id: 1,
              subject: 'Software Engineering',
            },
            id: 3,
            language: { code: 'DE' },
            professors: [
              { id: 2, firstName: 'M.', lastName: 'Tichy' },
              { id: 3, firstName: 'A.', lastName: 'Raschke' },
            ],
            semester: 1,
            semesterPeriod: { name: 'WiSe 2023/24' },
            university: { name: 'Uni Ulm' },
          },
        ]),
      });
    });

    it('should cast summary infos', async () => {
      // Arrange
      const supabaseAdapter = new SupabaseAdapter();
      // Act
      const names = supabaseAdapter.getStudiesSummaryMatterFromResponse(
        await supabaseAdapter.selectStudiesSummary(),
      );
      // Assert
      expect(names).toEqual(
        expect.arrayContaining<SummaryMatter>([
          {
            title: 'Softwarequalitaetssicherung',
            description: 'Zusammenfassung für die mündliche Prüfung',
            fileName: 'softwarequalitaetssicherung.mdx',
            lastModified: new Date('2024-03-04'),
            degree: 'M. Sc.',
            degreeSubject: 'Software Engineering',
            id: 3,
            language: 'DE',
            professors: [
              { id: 2, firstName: 'M.', lastName: 'Tichy' },
              { id: 3, firstName: 'A.', lastName: 'Raschke' },
            ],
            semester: 1,
            semesterPeriod: 'WiSe 2023/24',
            university: 'Uni Ulm',
          },
        ]),
      );
    });
  });

  describe('time-tracking schema', () => {
    const dbProject: Project = {
      id: 'fb491449-5745-4ea2-b6d6-fc44b6a671a8',
      name: 'Project 1',
      description: 'Description for Project 1',
      owner: dbUser.id,
      createdAt: moment(
        '2024-10-26 23:10:19.227+00',
        'YYYY-MM-DD HH:mm:ss.SSSZ',
      ),
    };

    const dbTimeEntry: TimeEntry = {
      id: '07aa03f0-d7fe-4eb7-a45b-320de25a1cf9',
      date: moment('2025-03-19', 'YYYY-MM-DD'),
      startTime: moment('11:53:43', 'HH:mm:ss'),
      endTime: moment('14:20:13', 'HH:mm:ss'),
      description: 'Admin-Tool: Completed integration of E2E tests in CI.',
      project: dbProject.id,
    };

    const otherDbProject: Project = {
      id: 'bd231d80-a7a5-4d80-97df-fd41cf647ab3',
      name: 'Project 2',
      description: 'Description for Project 2',
      owner: otherDbUser.id,
      createdAt: moment(
        '2025-04-22 12:05:03.212+00',
        'YYYY-MM-DD HH:mm:ss.SSSZ',
      ),
    };

    const otherDbTimeEntry: TimeEntry = {
      id: '3f217266-aebd-42ac-a851-1131d655d540',
      date: moment('2025-05-01', 'YYYY-MM-DD'),
      startTime: moment('08:16:22', 'HH:mm:ss'),
      endTime: moment('11:30:00', 'HH:mm:ss'),
      description: 'Time Entry for project 2',
      project: otherDbProject.id,
    };

    describe('getProjects', () => {
      it('should return projects', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const projects = await supabaseAdapter.getProjects(dbUser.id);

        // Assert
        expect(projects.length).toBeGreaterThan(0);
      });

      it('should return dbProject for dbUser', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const projects = await supabaseAdapter.getProjects(dbUser.id);

        // Assert
        expect(projects).toEqual(
          expect.arrayContaining<Project>([
            expect.objectContaining({
              id: dbProject.id,
              name: dbProject.name,
              description: dbProject.description,
              owner: dbProject.owner,
              createdAt: expect.anything(),
            }),
          ]),
        );
      });

      it('should not return otherDbProject for dbUser', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const projects = await supabaseAdapter.getProjects(dbUser.id);

        // Assert
        expect(projects).toEqual(
          expect.not.arrayContaining<Project>([
            expect.objectContaining({
              id: otherDbProject.id,
              name: otherDbProject.name,
              description: otherDbProject.description,
              owner: otherDbProject.owner,
              createdAt: expect.anything(),
            }),
          ]),
        );
      });

      it('should correctly return project data type', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const projects = await supabaseAdapter.getProjects(dbUser.id);

        // Assert
        // createdAt shall be a moment value
        expect(projects[0]).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            owner: expect.any(String),
            createdAt: expect.anything(),
          }),
        );

        expect(isMoment(projects[0].createdAt)).toBeTruthy();
      });

      it('should parse the createdAt moment value correctly', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const projects = await supabaseAdapter.getProjects(dbUser.id);

        // Assert
        const project: Project | undefined = projects.find(
          (p) => p.id === dbProject.id,
        );
        expect(project).toBeDefined();

        // 2024-10-26 23:10:19.227+00
        expect(project?.createdAt.isSame(dbProject.createdAt)).toBeTruthy();
      });
    });

    describe('getAllTimeEntries', () => {
      it('should return time entries for a provided project', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          dbProject.id,
        );

        // Assert
        expect(timeEntries.length).toBeGreaterThan(0);
      });

      it('should return dbTimeEntry for dbProject', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          dbProject.id,
        );

        // Assert
        expect(timeEntries).toEqual(
          expect.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: dbTimeEntry.id,
              date: dbTimeEntry.date,
              startTime: dbTimeEntry.startTime,
              endTime: dbTimeEntry.endTime,
              description: dbTimeEntry.description,
              project: dbProject.id,
            }),
          ]),
        );
      });

      it('should not return otherDbTimeEntry for dbProject', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          dbProject.id,
        );

        // Assert
        expect(timeEntries).toEqual(
          expect.not.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: otherDbTimeEntry.id,
              date: otherDbTimeEntry.date,
              startTime: otherDbTimeEntry.startTime,
              endTime: otherDbTimeEntry.endTime,
              description: otherDbTimeEntry.description,
              project: otherDbProject.id,
            }),
          ]),
        );
      });

      it('should correctly return time entry data type', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          dbProject.id,
        );

        // Assert
        expect(timeEntries[0]).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            date: expect.anything(),
            startTime: expect.anything(),
            endTime: expect.anything(),
            description: expect.any(String),
            project: expect.any(String),
          }),
        );

        expect(isMoment(timeEntries[0].date)).toBeTruthy();
        expect(isMoment(timeEntries[0].startTime)).toBeTruthy();
        expect(isMoment(timeEntries[0].endTime)).toBeTruthy();
      });

      it('should parse the time values correctly', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          dbProject.id,
        );

        // Assert
        const timeEntry: TimeEntry | undefined = timeEntries.find(
          (te) => te.id === dbTimeEntry.id,
        );
        expect(timeEntry).toBeDefined();

        expect(timeEntry?.date.isSame(dbTimeEntry.date)).toBeTruthy();
        expect(timeEntry?.startTime.isSame(dbTimeEntry.startTime)).toBeTruthy();
        expect(timeEntry?.endTime?.isSame(dbTimeEntry.endTime)).toBeTruthy();
      });
    });

    describe('createTimeEntries', () => {
      const firstNewTimeEntry: TimeEntry = {
        id: '020a43ef-b88d-4292-9da4-5c63ce03c217',
        date: moment('2025-04-12', 'YYYY-MM-DD'),
        startTime: moment('00:00:00', 'HH:mm:ss'),
        endTime: moment('10:05:59', 'HH:mm:ss'),
        description: 'Test Description 2.',
        project: dbProject.id,
      };

      const secondNewTimeEntry: TimeEntry = {
        id: '2fc6c034-1670-42d8-b428-f8ea65b27497',
        date: moment('2025-01-31', 'YYYY-MM-DD'),
        startTime: moment('22:22:22', 'HH:mm:ss'),
        endTime: moment('23:59:59', 'HH:mm:ss'),
        description: 'Test Description 3.',
        project: dbProject.id,
      };

      const thirdNewTimeEntry: {
        project: string;
        date: Moment;
        startTime: Moment;
      } = {
        project: dbProject.id,
        date: moment('2025-02-27', 'YYYY-MM-DD'),
        startTime: moment('08:00:00', 'HH:mm:ss'),
      };

      afterEach(async () => {
        // Clean up: Delete possibly created time entries
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();
        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(dbProject.id);

        // Delete firstNewTimeEntry
        const firstEntry = timeEntries.find(
          (te) => te.id === firstNewTimeEntry.id,
        );
        if (firstEntry) {
          await supabaseAdapter.deleteTimeEntry(firstEntry.id);
        }

        // Delete secondNewTimeEntry
        const secondEntry = timeEntries.find(
          (te) => te.id === secondNewTimeEntry.id,
        );
        if (secondEntry) {
          await supabaseAdapter.deleteTimeEntry(secondEntry.id);
        }

        // Delete thirdNewTimeEntry
        const thirdEntry = timeEntries.find(
          (te) =>
            te.project === thirdNewTimeEntry.project &&
            te.date.isSame(thirdNewTimeEntry.date) &&
            te.startTime.isSame(thirdNewTimeEntry.startTime),
        );
        if (thirdEntry) {
          await supabaseAdapter.deleteTimeEntry(thirdEntry.id);
        }
      });

      it('should not create anything if no time entry is provided', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        await supabaseAdapter.createTimeEntries([]);

        // Assert
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          dbProject.id,
        );

        expect(timeEntries.length).toBeGreaterThan(0);
        expect(timeEntries).toEqual(
          expect.not.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: firstNewTimeEntry.id,
              date: firstNewTimeEntry.date,
              startTime: firstNewTimeEntry.startTime,
              endTime: firstNewTimeEntry.endTime,
              description: firstNewTimeEntry.description,
              project: firstNewTimeEntry.project,
            }),
          ]),
        );
        expect(timeEntries).toEqual(
          expect.not.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: secondNewTimeEntry.id,
              date: secondNewTimeEntry.date,
              startTime: secondNewTimeEntry.startTime,
              endTime: secondNewTimeEntry.endTime,
              description: secondNewTimeEntry.description,
              project: secondNewTimeEntry.project,
            }),
          ]),
        );
        expect(timeEntries).toEqual(
          expect.not.arrayContaining<TimeEntry>([
            expect.objectContaining({
              project: thirdNewTimeEntry.project,
              date: thirdNewTimeEntry.date,
              startTime: thirdNewTimeEntry.startTime,
            }),
          ]),
        );
      });

      it('should create one new time entry', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        await supabaseAdapter.createTimeEntries([firstNewTimeEntry]);

        // Assert
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          dbProject.id,
        );

        expect(timeEntries.length).toBeGreaterThan(0);
        expect(timeEntries).toEqual(
          expect.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: firstNewTimeEntry.id,
              date: firstNewTimeEntry.date,
              startTime: firstNewTimeEntry.startTime,
              endTime: firstNewTimeEntry.endTime,
              description: firstNewTimeEntry.description,
              project: firstNewTimeEntry.project,
            }),
          ]),
        );
      });

      it('should create all 3 new entries', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        await supabaseAdapter.createTimeEntries([
          firstNewTimeEntry,
          secondNewTimeEntry,
          thirdNewTimeEntry,
        ]);

        // Assert
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          dbProject.id,
        );

        expect(timeEntries.length).toBeGreaterThan(0);
        expect(timeEntries).toEqual(
          expect.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: firstNewTimeEntry.id,
              date: firstNewTimeEntry.date,
              startTime: firstNewTimeEntry.startTime,
              endTime: firstNewTimeEntry.endTime,
              description: firstNewTimeEntry.description,
              project: firstNewTimeEntry.project,
            }),
            expect.objectContaining({
              id: secondNewTimeEntry.id,
              date: secondNewTimeEntry.date,
              startTime: secondNewTimeEntry.startTime,
              endTime: secondNewTimeEntry.endTime,
              description: secondNewTimeEntry.description,
              project: secondNewTimeEntry.project,
            }),
            expect.objectContaining({
              project: thirdNewTimeEntry.project,
              date: thirdNewTimeEntry.date,
              startTime: thirdNewTimeEntry.startTime,
            }),
          ]),
        );
      });

      it('should throw an error if the time entry already exists', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act & Assert
        await expect(
          supabaseAdapter.createTimeEntries([dbTimeEntry]),
        ).rejects.toThrowError(
          expect.objectContaining<DatabaseError>({
            name: 'DatabaseError',
            message: expect.stringMatching(
              /^(?=.*\btime\b)(?=.*\bentry\b)(?=.*\balready\b)(?=.*\bexists\b).*$/i,
            ),
          }),
        );
      });

      it('should throw an error if one of the time entries already exists', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act & Assert
        await expect(
          supabaseAdapter.createTimeEntries([dbTimeEntry, firstNewTimeEntry]),
        ).rejects.toThrowError(
          expect.objectContaining<DatabaseError>({
            name: 'DatabaseError',
            message: expect.stringMatching(
              /^(?=.*\btime\b)(?=.*\bentry\b)(?=.*\balready\b)(?=.*\bexists\b).*$/i,
            ),
          }),
        );
      });
    });

    describe('createTimeEntry', () => {
      const firstNewTimeEntry: TimeEntry = {
        id: '020a43ef-b88d-4292-9da4-5c63ce03c217',
        date: moment('2025-04-12', 'YYYY-MM-DD'),
        startTime: moment('00:00:00', 'HH:mm:ss'),
        endTime: moment('10:05:59', 'HH:mm:ss'),
        description: 'Test Description 2.',
        project: dbProject.id,
      };

      afterEach(async () => {
        // Clean up: Delete possibly created time entries
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();
        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(dbProject.id);

        // Delete firstNewTimeEntry
        const firstEntry = timeEntries.find(
          (te) => te.id === firstNewTimeEntry.id,
        );
        if (firstEntry) {
          await supabaseAdapter.deleteTimeEntry(firstEntry.id);
        }
      });

      it('should create a new time entry', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        await supabaseAdapter.createTimeEntry(firstNewTimeEntry);

        // Assert
        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(dbProject.id);

        expect(timeEntries.length).toBeGreaterThan(0);
        expect(timeEntries).toEqual(
          expect.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: firstNewTimeEntry.id,
              date: firstNewTimeEntry.date,
              startTime: firstNewTimeEntry.startTime,
              endTime: firstNewTimeEntry.endTime,
              description: firstNewTimeEntry.description,
              project: firstNewTimeEntry.project,
            }),
          ]),
        );
      });

      it('should throw an error if the time entry already exists', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act & Assert
        await expect(
          supabaseAdapter.createTimeEntry(dbTimeEntry),
        ).rejects.toThrowError(
          expect.objectContaining<DatabaseError>({
            name: 'DatabaseError',
            message: expect.stringMatching(
              /^(?=.*\btime\b)(?=.*\bentry\b)(?=.*\balready\b)(?=.*\bexists\b).*$/i,
            ),
          }),
        );
      });
    });

    describe('updateTimeEntry', () => {
      const updatedTimeEntry: TimeEntry = {
        id: dbTimeEntry.id,
        date: moment('2025-05-02', 'YYYY-MM-DD'),
        startTime: moment('15:30:22', 'HH:mm:ss'),
        endTime: moment('17:59:59', 'HH:mm:ss'), // Updated end time
        description: 'Updated description for the time entry.',
        project: dbProject.id,
      };

      afterEach(async () => {
        // Restore the possibly updated dbTimeEntry
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        await supabaseAdapter.deleteTimeEntry(dbTimeEntry.id);
        await supabaseAdapter.createTimeEntry(dbTimeEntry);
      });

      it('should update the existing time entry with the new values', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        await supabaseAdapter.updateTimeEntry(updatedTimeEntry);

        // Assert
        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(dbProject.id);

        expect(timeEntries).toEqual(
          expect.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: updatedTimeEntry.id,
              date: updatedTimeEntry.date,
              startTime: updatedTimeEntry.startTime,
              endTime: updatedTimeEntry.endTime,
              description: updatedTimeEntry.description,
              project: updatedTimeEntry.project,
            }),
          ]),
        );
      });

      it('should not perform the update if the entry to update does not exist', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();
        const nonExistingEntry: TimeEntry = {
          id: '00000000-0000-0000-0000-000000000001',
          date: moment('2025-05-02', 'YYYY-MM-DD'),
          startTime: moment('15:30:22', 'HH:mm:ss'),
          endTime: moment('17:59:59', 'HH:mm:ss'),
          description: 'This entry does not exist.',
          project: dbProject.id,
        };

        // Act & Assert
        await expect(
          supabaseAdapter.updateTimeEntry(nonExistingEntry),
        ).resolves.toBeUndefined();

        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(dbProject.id);

        expect(timeEntries).toEqual(
          expect.not.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: nonExistingEntry.id,
              date: nonExistingEntry.date,
              startTime: nonExistingEntry.startTime,
              endTime: nonExistingEntry.endTime,
              description: nonExistingEntry.description,
              project: nonExistingEntry.project,
            }),
          ]),
        );
      });
    });

    describe('deleteTimeEntry', () => {
      afterEach(async () => {
        // Readd the possibly deleted dbTimeEntry
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();
        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(dbProject.id);

        const entry = timeEntries.find((te) => te.id === dbTimeEntry.id);
        if (!entry) {
          await supabaseAdapter.createTimeEntry(dbTimeEntry);
        }

        const timeEntriesAfter = await supabaseAdapter.getAllTimeEntries(
          dbProject.id,
        );
        expect(timeEntriesAfter).toEqual(
          expect.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: dbTimeEntry.id,
              date: dbTimeEntry.date,
              startTime: dbTimeEntry.startTime,
              endTime: dbTimeEntry.endTime,
              description: dbTimeEntry.description,
              project: dbProject.id,
            }),
          ]),
        );
      });

      it('should delete a time entry by id', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        await supabaseAdapter.deleteTimeEntry(dbTimeEntry.id);

        // Assert
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          dbProject.id,
        );
        expect(timeEntries).toEqual(
          expect.not.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: dbTimeEntry.id,
            }),
          ]),
        );
      });

      it('should resolve if the time entry did not exist before', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();
        const nonExistingId = '00000000-0000-0000-0000-000000000001';

        // Act & Assert
        await expect(
          supabaseAdapter.deleteTimeEntry(nonExistingId),
        ).resolves.toBeUndefined();
      });
    });
  });
});
