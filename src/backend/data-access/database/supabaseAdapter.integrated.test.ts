import { SummaryMatter } from '@/src/app/studies/summaries/[summaryName]/page';
import { SupabaseAdapter } from './supabaseAdapter';
import { StudiesSummary } from './supabaseTypes';
import { TimeTrackingDatabase } from '@/src/backend/data-access/database/timeTrackingDatabase.interface';
import moment, { isMoment } from 'moment';
import { Project } from '@/src/backend/data-access/database/entities/time-tracking/project';
import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';
import { DatabaseError } from '@/src/backend/data-access/database/databaseError';
import { mockUser } from '@/__mocks__/backend/data-access/entities/user.mock';
import {
  mockProject,
  otherMockProject,
} from '@/__mocks__/backend/data-access/entities/project.mock';
import {
  firstNewTimeEntry,
  mockTimeEntry,
  otherMockTimeEntry,
  secondNewTimeEntry,
  thirdNewTimeEntry,
} from '@/__mocks__/backend/data-access/entities/timeEntry.mock';

describe('supabaseAdapter', () => {
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
    describe('getProject', () => {
      it('should return a project by id', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const project = await supabaseAdapter.getProject(mockProject.id);

        // Assert
        expect(project).toEqual(
          expect.objectContaining<Project>({
            id: mockProject.id,
            name: mockProject.name,
            description: mockProject.description,
            owner: mockProject.owner,
            createdAt: expect.anything(),
          }),
        );
      });

      it('should return null for a non-existing project id', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();
        const nonExistingProjectId = '00000000-0000-0000-0000-000000000001';

        // Act
        const project = await supabaseAdapter.getProject(nonExistingProjectId);

        // Assert
        expect(project).toBeNull();
      });

      it('should parse the createdAt moment value correctly', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const project = await supabaseAdapter.getProject(mockProject.id);

        // Assert
        expect(project).toBeDefined();
        expect(isMoment(project?.createdAt)).toBeTruthy();
        expect(project?.createdAt.isSame(mockProject.createdAt)).toBeTruthy();
      });
    });

    describe('getProjects', () => {
      it('should return projects', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const projects = await supabaseAdapter.getProjects(mockUser.id);

        // Assert
        expect(projects.length).toBeGreaterThan(0);
      });

      it('should return mockProject for mockUser', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const projects = await supabaseAdapter.getProjects(mockUser.id);

        // Assert
        expect(projects).toEqual(
          expect.arrayContaining<Project>([
            expect.objectContaining({
              id: mockProject.id,
              name: mockProject.name,
              description: mockProject.description,
              owner: mockProject.owner,
              createdAt: expect.anything(),
            }),
          ]),
        );
      });

      it('should not return otherMockProject for mockUser', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const projects = await supabaseAdapter.getProjects(mockUser.id);

        // Assert
        expect(projects).toEqual(
          expect.not.arrayContaining<Project>([
            expect.objectContaining({
              id: otherMockProject.id,
              name: otherMockProject.name,
              description: otherMockProject.description,
              owner: otherMockProject.owner,
              createdAt: expect.anything(),
            }),
          ]),
        );
      });

      it('should correctly return project data type', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const projects = await supabaseAdapter.getProjects(mockUser.id);

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
        const projects = await supabaseAdapter.getProjects(mockUser.id);

        // Assert
        const project: Project | undefined = projects.find(
          (p) => p.id === mockProject.id,
        );
        expect(project).toBeDefined();

        // 2024-10-26 23:10:19.227+00
        expect(project?.createdAt.isSame(mockProject.createdAt)).toBeTruthy();
      });
    });

    describe('getTimeEntry', () => {
      it('should return a time entry by id', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const timeEntry = await supabaseAdapter.getTimeEntry(mockTimeEntry.id);

        // Assert
        expect(timeEntry).toEqual(
          expect.objectContaining<TimeEntry>({
            id: mockTimeEntry.id,
            date: expect.anything(),
            startTime: expect.anything(),
            endTime: expect.anything(),
            description: mockTimeEntry.description,
            project: mockTimeEntry.project,
          }),
        );
      });

      it('should return null for a non-existing time entry id', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();
        const nonExistingTimeEntryId = '00000000-0000-0000-0000-000000000001';

        // Act
        const timeEntry = await supabaseAdapter.getTimeEntry(
          nonExistingTimeEntryId,
        );

        // Assert
        expect(timeEntry).toBeNull();
      });

      it('should parse the time values correctly', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const timeEntry = await supabaseAdapter.getTimeEntry(mockTimeEntry.id);

        // Assert
        expect(timeEntry).toBeDefined();
        expect(isMoment(timeEntry?.date)).toBeTruthy();
        expect(timeEntry?.date.isSame(mockTimeEntry.date)).toBeTruthy();
        expect(isMoment(timeEntry?.startTime)).toBeTruthy();
        expect(
          timeEntry?.startTime.isSame(mockTimeEntry.startTime),
        ).toBeTruthy();
        expect(isMoment(timeEntry?.endTime)).toBeTruthy();
        expect(timeEntry?.endTime?.isSame(mockTimeEntry.endTime)).toBeTruthy();
      });
    });

    describe('getAllTimeEntries', () => {
      it('should return time entries for a provided project', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          mockProject.id,
        );

        // Assert
        expect(timeEntries.length).toBeGreaterThan(0);
      });

      it('should return mockTimeEntry for mockProject', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          mockProject.id,
        );

        // Assert
        expect(timeEntries).toEqual(
          expect.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: mockTimeEntry.id,
              date: mockTimeEntry.date,
              startTime: mockTimeEntry.startTime,
              endTime: mockTimeEntry.endTime,
              description: mockTimeEntry.description,
              project: mockProject.id,
            }),
          ]),
        );
      });

      it('should not return otherMockTimeEntry for mockProject', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          mockProject.id,
        );

        // Assert
        expect(timeEntries).toEqual(
          expect.not.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: otherMockTimeEntry.id,
              date: otherMockTimeEntry.date,
              startTime: otherMockTimeEntry.startTime,
              endTime: otherMockTimeEntry.endTime,
              description: otherMockTimeEntry.description,
              project: otherMockProject.id,
            }),
          ]),
        );
      });

      it('should correctly return time entry data type', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          mockProject.id,
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
          mockProject.id,
        );

        // Assert
        const timeEntry: TimeEntry | undefined = timeEntries.find(
          (te) => te.id === mockTimeEntry.id,
        );
        expect(timeEntry).toBeDefined();

        expect(timeEntry?.date.isSame(mockTimeEntry.date)).toBeTruthy();
        expect(
          timeEntry?.startTime.isSame(mockTimeEntry.startTime),
        ).toBeTruthy();
        expect(timeEntry?.endTime?.isSame(mockTimeEntry.endTime)).toBeTruthy();
      });
    });

    describe('createTimeEntries', () => {
      afterEach(async () => {
        // Clean up: Delete possibly created time entries
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();
        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(mockProject.id);

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

      it('should not create and return anything if no time entry is provided', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const createdTimeEntries: TimeEntry[] =
          await supabaseAdapter.createTimeEntries([]);

        // Assert
        expect(createdTimeEntries).toEqual([]);

        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          mockProject.id,
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

      it('should create and return one new time entry', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const createdTimeEntries: TimeEntry[] =
          await supabaseAdapter.createTimeEntries([firstNewTimeEntry]);

        // Assert
        expect(createdTimeEntries).toEqual(
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

        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          mockProject.id,
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
        const createdTimeEntries: TimeEntry[] =
          await supabaseAdapter.createTimeEntries([
            firstNewTimeEntry,
            secondNewTimeEntry,
            thirdNewTimeEntry,
          ]);

        // Assert
        expect(createdTimeEntries).toEqual(
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

        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          mockProject.id,
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
          supabaseAdapter.createTimeEntries([mockTimeEntry]),
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
          supabaseAdapter.createTimeEntries([mockTimeEntry, firstNewTimeEntry]),
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
      afterEach(async () => {
        // Clean up: Delete possibly created time entries
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();
        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(mockProject.id);

        // Delete firstNewTimeEntry
        const firstEntry = timeEntries.find(
          (te) => te.id === firstNewTimeEntry.id,
        );
        if (firstEntry) {
          await supabaseAdapter.deleteTimeEntry(firstEntry.id);
        }
      });

      it('should create and return a new time entry', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        const createdTimeEntry =
          await supabaseAdapter.createTimeEntry(firstNewTimeEntry);

        // Assert
        expect(createdTimeEntry).toEqual(
          expect.objectContaining({
            id: firstNewTimeEntry.id,
            date: firstNewTimeEntry.date,
            startTime: firstNewTimeEntry.startTime,
            endTime: firstNewTimeEntry.endTime,
            description: firstNewTimeEntry.description,
            project: firstNewTimeEntry.project,
          }),
        );

        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(mockProject.id);

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
          supabaseAdapter.createTimeEntry(mockTimeEntry),
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
        id: mockTimeEntry.id,
        date: moment('2025-05-02', 'YYYY-MM-DD'),
        startTime: moment('15:30:22', 'HH:mm:ss'),
        endTime: moment('17:59:59', 'HH:mm:ss'), // Updated end time
        description: 'Updated description for the time entry.',
        project: mockProject.id,
      };

      afterEach(async () => {
        // Restore the possibly updated mockTimeEntry
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        await supabaseAdapter.deleteTimeEntry(mockTimeEntry.id);
        await supabaseAdapter.createTimeEntry(mockTimeEntry);
      });

      it('should update the existing time entry with the new values', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        await supabaseAdapter.updateTimeEntry(updatedTimeEntry);

        // Assert
        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(mockProject.id);

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
          project: mockProject.id,
        };

        // Act & Assert
        await expect(
          supabaseAdapter.updateTimeEntry(nonExistingEntry),
        ).resolves.toBeUndefined();

        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(mockProject.id);

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
        // Readd the possibly deleted mockTimeEntry
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();
        const timeEntries: TimeEntry[] =
          await supabaseAdapter.getAllTimeEntries(mockProject.id);

        const entry = timeEntries.find((te) => te.id === mockTimeEntry.id);
        if (!entry) {
          await supabaseAdapter.createTimeEntry(mockTimeEntry);
        }

        const timeEntriesAfter = await supabaseAdapter.getAllTimeEntries(
          mockProject.id,
        );
        expect(timeEntriesAfter).toEqual(
          expect.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: mockTimeEntry.id,
              date: mockTimeEntry.date,
              startTime: mockTimeEntry.startTime,
              endTime: mockTimeEntry.endTime,
              description: mockTimeEntry.description,
              project: mockProject.id,
            }),
          ]),
        );
      });

      it('should delete a time entry by id', async () => {
        // Arrange
        const supabaseAdapter: TimeTrackingDatabase = new SupabaseAdapter();

        // Act
        await supabaseAdapter.deleteTimeEntry(mockTimeEntry.id);

        // Assert
        const timeEntries = await supabaseAdapter.getAllTimeEntries(
          mockProject.id,
        );
        expect(timeEntries).toEqual(
          expect.not.arrayContaining<TimeEntry>([
            expect.objectContaining({
              id: mockTimeEntry.id,
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
