import TimeTrackingService from '@/src/backend/services/time-tracking/timeTrackingService';
import { mockTimeTrackingDatabase } from '@/__mocks__/timeTrackingDatabase.mock';
import { userServiceMock } from '@/__mocks__/userService.mock';
import { Project } from '@/src/backend/data-access/database/entities/time-tracking/project';
import {
  mockUser,
  otherMockUser,
} from '@/__mocks__/backend/data-access/entities/user.mock';
import {
  mockProject,
  otherMockProject,
} from '@/__mocks__/backend/data-access/entities/project.mock';
import {
  mockTimeEntry,
  otherMockTimeEntry,
} from '@/__mocks__/backend/data-access/entities/timeEntry.mock';
import { ITimeTrackingService } from '@/src/backend/services/time-tracking/timeTrackingService.interface';
import { UnauthorizedError } from '@/src/backend/error/unauthorizedError';
import moment from 'moment';
import { DatabaseError } from '@/src/backend/data-access/database/databaseError';
import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';
import { InvalidOperationError } from '@/src/backend/error/invalidOperationError';

describe('TimeTrackingService', () => {
  describe('getProjects', () => {
    it("should not call the timeTrackingDatabase's getProjects method and throw UnauthorizedError if the user is not logged in", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(null);

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act
      await expect(
        timeTrackingService.getProjects(mockUser.id),
      ).rejects.toThrowError(
        expect.objectContaining<UnauthorizedError>({
          name: 'UnauthorizedError',
          message: expect.stringMatching(
            /^(?=.*\buser\b)(?=.*\bnot\b)(?=.*\blogged\b)(?=.*\bin\b).*$/i,
          ),
        }),
      );

      // Assert
      expect(mockTimeTrackingDatabase.getProjects).not.toHaveBeenCalled();
    });

    it("should not call the timeTrackingDatabase's getProjects method and throw UnauthorizedError if the user is logged in but the userId does not match", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi
        .fn()
        .mockResolvedValue(otherMockUser);

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act
      await expect(
        timeTrackingService.getProjects(mockUser.id),
      ).rejects.toThrowError(
        expect.objectContaining<UnauthorizedError>({
          name: 'UnauthorizedError',
          message: expect.stringMatching(
            /^(?=.*\buser\b)(?=.*\bnot\b)(?=.*\blogged\b)(?=.*\bin\b).*$/i,
          ),
        }),
      );

      // Assert
      expect(mockTimeTrackingDatabase.getProjects).not.toHaveBeenCalled();
    });

    it("should propagate DatabaseError thrown by the timeTrackingDatabase's getProjects method", async () => {
      // Arrange
      const databaseError = new DatabaseError('Database error');
      mockTimeTrackingDatabase.getProjects = vi
        .fn()
        .mockRejectedValue(databaseError);
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.getProjects(mockUser.id),
      ).rejects.toThrowError(databaseError);
    });

    it("should call the timeTrackingDatabase's getProjects method with the correct userId and return the projects", async () => {
      // Arrange
      mockTimeTrackingDatabase.getProjects = vi
        .fn()
        .mockResolvedValue([mockProject]);
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);

      const timeTrackingService: TimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );
      const userId = mockUser.id;

      // Act
      const result: Project[] = await timeTrackingService.getProjects(userId);

      // Assert
      expect(mockTimeTrackingDatabase.getProjects).toHaveBeenCalledWith(userId);
      expect(result).toEqual([mockProject]);
    });
  });

  describe('getAllTimeEntries', () => {
    it('should not call the timeTrackingDatabase and throw UnauthorizedError if the user is not logged in', async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(null);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act
      await expect(
        timeTrackingService.getAllTimeEntries(mockProject.id),
      ).rejects.toThrowError(
        expect.objectContaining<UnauthorizedError>({
          name: 'UnauthorizedError',
          message: expect.stringMatching(
            /^(?=.*\buser\b)(?=.*\bnot\b)(?=.*\blogged\b)(?=.*\bin\b).*$/i,
          ),
        }),
      );

      // Assert
      expect(mockTimeTrackingDatabase.getAllTimeEntries).not.toHaveBeenCalled();
    });

    it('should not call the timeTrackingDatabase and return an empty array if the project does not exist', async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getProject = vi.fn().mockResolvedValue(null);

      const timeTrackingService: TimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act
      const result = await timeTrackingService.getAllTimeEntries(
        '00491449-5745-4ea2-b6d6-fc44b6a671a8',
      );

      // Assert
      expect(mockTimeTrackingDatabase.getAllTimeEntries).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should not call the timeTrackingDatabase and throw UnauthorizedError if the logged in user does not own the project', async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(otherMockProject);
      const timeTrackingService: TimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act
      await expect(
        timeTrackingService.getAllTimeEntries(otherMockProject.id),
      ).rejects.toThrowError(
        expect.objectContaining<UnauthorizedError>({
          name: 'UnauthorizedError',
          message: expect.stringMatching(
            /^(?=.*\buser\b)(?=.*\bnot\b)(?=.*\bown\b)(?=.*\bproject\b).*$/i,
          ),
        }),
      );

      // Assert
      expect(mockTimeTrackingDatabase.getAllTimeEntries).not.toHaveBeenCalled();
    });

    it("should propagate DatabaseErrors thrown by the timeTrackingDatabase's getProject method", async () => {
      // Arrange
      const databaseError = new DatabaseError('Database error');
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockRejectedValue(databaseError);
      mockTimeTrackingDatabase.getAllTimeEntries = vi
        .fn()
        .mockResolvedValue([mockTimeEntry]);
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);

      const timeTrackingService: TimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.getAllTimeEntries(mockProject.id),
      ).rejects.toThrowError(databaseError);
    });

    it("should propagate DatabaseErrors thrown by the timeTrackingDatabase's getAllTimeEntries method", async () => {
      // Arrange
      const databaseError = new DatabaseError('Database error');
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);
      mockTimeTrackingDatabase.getAllTimeEntries = vi
        .fn()
        .mockRejectedValue(databaseError);
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);

      const timeTrackingService: TimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.getAllTimeEntries(mockProject.id),
      ).rejects.toThrowError(databaseError);
    });

    it('should call the timeTrackingDatabase to retrieve all time entries and return them', async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);
      mockTimeTrackingDatabase.getAllTimeEntries = vi
        .fn()
        .mockResolvedValue([mockTimeEntry]);
      const timeTrackingService: TimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act
      const result = await timeTrackingService.getAllTimeEntries(
        mockProject.id,
      );

      // Assert
      expect(
        mockTimeTrackingDatabase.getAllTimeEntries,
      ).toHaveBeenCalledExactlyOnceWith(mockProject.id);
      expect(result).toEqual([mockTimeEntry]);
    });
  });

  describe('createTimeEntry', () => {
    const newMinimalTimeEntry: {
      project: string;
      date: moment.Moment;
      startTime: moment.Moment;
    } = {
      project: mockProject.id,
      date: moment('2025-06-15', 'YYYY-MM-DD'),
      startTime: moment('09:00:00', 'HH:mm:ss'),
    };

    it.each([mockTimeEntry, newMinimalTimeEntry])(
      "should not call the timeTrackingDatabase's createTimeEntry method and throw UnauthorizedError if the user is not logged in",
      async (newTimeEntry) => {
        // Arrange
        userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(null);
        mockTimeTrackingDatabase.getProject = vi
          .fn()
          .mockResolvedValue(mockProject);
        mockTimeTrackingDatabase.getAllTimeEntries = vi
          .fn()
          .mockResolvedValue([]);
        mockTimeTrackingDatabase.createTimeEntry = vi.fn();

        const timeTrackingService: ITimeTrackingService =
          new TimeTrackingService(mockTimeTrackingDatabase, userServiceMock);

        // Act
        await expect(
          timeTrackingService.createTimeEntry(newTimeEntry),
        ).rejects.toThrowError(
          expect.objectContaining<UnauthorizedError>({
            name: 'UnauthorizedError',
            message: expect.stringMatching(
              /^(?=.*\buser\b)(?=.*\bnot\b)(?=.*\blogged\b)(?=.*\bin\b).*$/i,
            ),
          }),
        );

        // Assert
        expect(mockTimeTrackingDatabase.createTimeEntry).not.toHaveBeenCalled();
      },
    );

    it.each([mockTimeEntry, newMinimalTimeEntry])(
      "should not call the timeTrackingDatabase's createTimeEntry method and throw UnauthorizedError if the logged in user does not own the project",
      async (newTimeEntry) => {
        // Arrange
        userServiceMock.getLoggedInUser = vi
          .fn()
          .mockResolvedValue(otherMockUser);
        mockTimeTrackingDatabase.getProject = vi
          .fn()
          .mockResolvedValue(mockProject);
        mockTimeTrackingDatabase.getAllTimeEntries = vi
          .fn()
          .mockResolvedValue([]);
        mockTimeTrackingDatabase.createTimeEntry = vi.fn();

        const timeTrackingService: ITimeTrackingService =
          new TimeTrackingService(mockTimeTrackingDatabase, userServiceMock);

        // Act
        await expect(
          timeTrackingService.createTimeEntry(newTimeEntry),
        ).rejects.toThrowError(
          expect.objectContaining<UnauthorizedError>({
            name: 'UnauthorizedError',
            message: expect.stringMatching(
              /^(?=.*\buser\b)(?=.*\bnot\b)(?=.*\bown\b)(?=.*\bproject\b).*$/i,
            ),
          }),
        );

        // Assert
        expect(mockTimeTrackingDatabase.createTimeEntry).not.toHaveBeenCalled();
      },
    );

    it.each([mockTimeEntry, newMinimalTimeEntry])(
      "should not call the timeTrackingDatabase's createTimeEntry method and throw InvalidOperationError if the project does not exist",
      async (newTimeEntry) => {
        // Arrange
        userServiceMock.getLoggedInUser = vi
          .fn()
          .mockResolvedValue(otherMockUser);
        mockTimeTrackingDatabase.getProject = vi.fn().mockResolvedValue(null);
        mockTimeTrackingDatabase.getAllTimeEntries = vi
          .fn()
          .mockResolvedValue([]);
        mockTimeTrackingDatabase.createTimeEntry = vi.fn();

        const timeTrackingService: ITimeTrackingService =
          new TimeTrackingService(mockTimeTrackingDatabase, userServiceMock);

        // Act
        await expect(
          timeTrackingService.createTimeEntry(newTimeEntry),
        ).rejects.toThrowError(
          expect.objectContaining<InvalidOperationError>({
            name: 'InvalidOperationError',
            message: expect.stringMatching(
              /^(?=.*\bproject\b)(?=.*\bnot\b)(?=.*\bexist\b).*$/i,
            ),
          }),
        );

        // Assert
        expect(mockTimeTrackingDatabase.createTimeEntry).not.toHaveBeenCalled();
      },
    );

    it.each([mockTimeEntry, newMinimalTimeEntry])(
      "should not call the timeTrackingDatabase's createTimeEntry method and throw InvalidOperationError if there currently is a running time entry for the project",
      async (newTimeEntry) => {
        // Arrange
        userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
        mockTimeTrackingDatabase.getProject = vi
          .fn()
          .mockResolvedValue(mockProject);
        mockTimeTrackingDatabase.createTimeEntry = vi.fn();

        const runningTimeEntry: TimeEntry = {
          ...otherMockTimeEntry,
          endTime: null,
        };
        mockTimeTrackingDatabase.getAllTimeEntries = vi
          .fn()
          .mockResolvedValue([mockTimeEntry, runningTimeEntry]);

        const timeTrackingService: ITimeTrackingService =
          new TimeTrackingService(mockTimeTrackingDatabase, userServiceMock);

        // Act
        await expect(
          timeTrackingService.createTimeEntry(newTimeEntry),
        ).rejects.toThrowError(
          expect.objectContaining<InvalidOperationError>({
            name: 'InvalidOperationError',
            message: expect.stringMatching(
              /^(?=.*\balready\b)(?=.*\brunning\b)(?=.*\bentry\b)(?=.*\bproject\b).*$/i,
            ),
          }),
        );

        // Assert
        expect(mockTimeTrackingDatabase.createTimeEntry).not.toHaveBeenCalled();
      },
    );

    it.each([mockTimeEntry, newMinimalTimeEntry])(
      "should propagate DatabaseErrors thrown by the timeTrackingDatabase's getProject method",
      async (newTimeEntry) => {
        // Arrange
        const databaseError = new DatabaseError('Database error');
        userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
        mockTimeTrackingDatabase.getProject = vi
          .fn()
          .mockRejectedValue(databaseError);
        mockTimeTrackingDatabase.getAllTimeEntries = vi
          .fn()
          .mockResolvedValue([]);
        mockTimeTrackingDatabase.createTimeEntry = vi.fn();

        const timeTrackingService: ITimeTrackingService =
          new TimeTrackingService(mockTimeTrackingDatabase, userServiceMock);

        // Act & Assert
        await expect(
          timeTrackingService.createTimeEntry(newTimeEntry),
        ).rejects.toThrowError(databaseError);
      },
    );

    it.each([mockTimeEntry, newMinimalTimeEntry])(
      "should propagate DatabaseErrors thrown by the timeTrackingDatabase's getAllTimeEntries method",
      async (newTimeEntry) => {
        // Arrange
        const databaseError = new DatabaseError('Database error');
        userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
        mockTimeTrackingDatabase.getProject = vi
          .fn()
          .mockResolvedValue(mockProject);
        mockTimeTrackingDatabase.getAllTimeEntries = vi
          .fn()
          .mockRejectedValue(databaseError);
        mockTimeTrackingDatabase.createTimeEntry = vi.fn();

        const timeTrackingService: ITimeTrackingService =
          new TimeTrackingService(mockTimeTrackingDatabase, userServiceMock);

        // Act & Assert
        await expect(
          timeTrackingService.createTimeEntry(newTimeEntry),
        ).rejects.toThrowError(databaseError);
      },
    );

    it.each([mockTimeEntry, newMinimalTimeEntry])(
      "should propagate DatabaseErrors thrown by the timeTrackingDatabase's createTimeEntry method",
      async (newTimeEntry) => {
        // Arrange
        const databaseError = new DatabaseError('Database error');
        userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
        mockTimeTrackingDatabase.getProject = vi
          .fn()
          .mockResolvedValue(mockProject);
        mockTimeTrackingDatabase.getAllTimeEntries = vi
          .fn()
          .mockResolvedValue([]);
        mockTimeTrackingDatabase.createTimeEntry = vi
          .fn()
          .mockRejectedValue(databaseError);

        const timeTrackingService: ITimeTrackingService =
          new TimeTrackingService(mockTimeTrackingDatabase, userServiceMock);

        // Act & Assert
        await expect(
          timeTrackingService.createTimeEntry(newTimeEntry),
        ).rejects.toThrowError(databaseError);
      },
    );

    it.each([mockTimeEntry, newMinimalTimeEntry])(
      "should call the timeTrackingDatabase's createTimeEntry method with the correct time entry and return the created time entry",
      async (newTimeEntry) => {
        // Arrange
        userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
        mockTimeTrackingDatabase.getProject = vi
          .fn()
          .mockResolvedValue(mockProject);
        mockTimeTrackingDatabase.getAllTimeEntries = vi
          .fn()
          .mockResolvedValue([]);
        mockTimeTrackingDatabase.createTimeEntry = vi
          .fn()
          .mockResolvedValue(mockTimeEntry);

        const timeTrackingService: ITimeTrackingService =
          new TimeTrackingService(mockTimeTrackingDatabase, userServiceMock);

        // Act
        const createdTimeEntry =
          await timeTrackingService.createTimeEntry(newTimeEntry);

        // Assert
        expect(
          mockTimeTrackingDatabase.createTimeEntry,
        ).toHaveBeenCalledExactlyOnceWith(newTimeEntry);
        expect(createdTimeEntry).toEqual(mockTimeEntry);
      },
    );
  });

  describe('updateTimeEntry', () => {
    it("should not call the timeTrackingDatabase's updateTimeEntry method and throw UnauthorizedError if the user is not logged in", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(null);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);
      mockTimeTrackingDatabase.updateTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.updateTimeEntry(mockTimeEntry),
      ).rejects.toThrowError(
        expect.objectContaining<UnauthorizedError>({
          name: 'UnauthorizedError',
          message: expect.stringMatching(
            /^(?=.*\buser\b)(?=.*\bnot\b)(?=.*\blogged\b)(?=.*\bin\b).*$/i,
          ),
        }),
      );

      // Assert
      expect(mockTimeTrackingDatabase.updateTimeEntry).not.toHaveBeenCalled();
    });

    it("should not call the timeTrackingDatabase's updateTimeEntry method and throw UnauthorizedError if the user does not own the time entry's project", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(otherMockProject);
      mockTimeTrackingDatabase.updateTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.updateTimeEntry(mockTimeEntry),
      ).rejects.toThrowError(
        expect.objectContaining<UnauthorizedError>({
          name: 'UnauthorizedError',
          message: expect.stringMatching(
            /^(?=.*\buser\b)(?=.*\bnot\b)(?=.*\bown\b)(?=.*\bproject\b).*$/i,
          ),
        }),
      );

      // Assert
      expect(mockTimeTrackingDatabase.updateTimeEntry).not.toHaveBeenCalled();
    });

    it("should not call the timeTrackingDatabase's updateTimeEntry method and return if the time entry's project does not exist", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getProject = vi.fn().mockResolvedValue(null);
      mockTimeTrackingDatabase.updateTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      const result = await timeTrackingService.updateTimeEntry(mockTimeEntry);

      // Assert
      expect(mockTimeTrackingDatabase.updateTimeEntry).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("should propagate DatabaseErrors thrown by the timeTrackingDatabase's getProject method", async () => {
      // Arrange
      const databaseError = new DatabaseError('Database error');
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockRejectedValue(databaseError);
      mockTimeTrackingDatabase.updateTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.updateTimeEntry(mockTimeEntry),
      ).rejects.toThrowError(databaseError);

      // Assert
      expect(mockTimeTrackingDatabase.updateTimeEntry).not.toHaveBeenCalled();
    });

    it("should propagate DatabaseErrors thrown by the timeTrackingDatabase's updateTimeEntry method", async () => {
      // Arrange
      const databaseError = new DatabaseError('Database error');
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);
      mockTimeTrackingDatabase.updateTimeEntry = vi
        .fn()
        .mockRejectedValue(databaseError);

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.updateTimeEntry(mockTimeEntry),
      ).rejects.toThrowError(databaseError);
    });

    it("should call the timeTrackingDatabase's updateTimeEntry method with the correct time entry", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);
      mockTimeTrackingDatabase.updateTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act
      await timeTrackingService.updateTimeEntry(mockTimeEntry);

      // Assert
      expect(
        mockTimeTrackingDatabase.updateTimeEntry,
      ).toHaveBeenCalledExactlyOnceWith(mockTimeEntry);
    });
  });

  describe('deleteTimeEntry', () => {
    it("should not call the timeTrackingDatabase's deleteTimeEntry method and throw UnauthorizedError if the user is not logged in", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(null);
      mockTimeTrackingDatabase.getTimeEntry = vi
        .fn()
        .mockResolvedValue(mockTimeEntry);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);
      mockTimeTrackingDatabase.deleteTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.deleteTimeEntry(mockTimeEntry.id),
      ).rejects.toThrowError(
        expect.objectContaining<UnauthorizedError>({
          name: 'UnauthorizedError',
          message: expect.stringMatching(
            /^(?=.*\buser\b)(?=.*\bnot\b)(?=.*\blogged\b)(?=.*\bin\b).*$/i,
          ),
        }),
      );

      // Assert
      expect(mockTimeTrackingDatabase.deleteTimeEntry).not.toHaveBeenCalled();
    });

    it("should not call the timeTrackingDatabase's deleteTimeEntry method and throw UnauthorizedError if the user does not own the time entry's project", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getTimeEntry = vi
        .fn()
        .mockResolvedValue(mockTimeEntry);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(otherMockProject);
      mockTimeTrackingDatabase.deleteTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.deleteTimeEntry(mockTimeEntry.id),
      ).rejects.toThrowError(
        expect.objectContaining<UnauthorizedError>({
          name: 'UnauthorizedError',
          message: expect.stringMatching(
            /^(?=.*\buser\b)(?=.*\bnot\b)(?=.*\bown\b)(?=.*\bproject\b).*$/i,
          ),
        }),
      );

      // Assert
      expect(mockTimeTrackingDatabase.deleteTimeEntry).not.toHaveBeenCalled();
    });

    it("should not call the timeTrackingDatabase's deleteTimeEntry method and return if the time entry's project does not exist", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getTimeEntry = vi
        .fn()
        .mockResolvedValue(mockTimeEntry);
      mockTimeTrackingDatabase.getProject = vi.fn().mockResolvedValue(null);
      mockTimeTrackingDatabase.deleteTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      const result = await timeTrackingService.deleteTimeEntry(
        mockTimeEntry.id,
      );

      // Assert
      expect(mockTimeTrackingDatabase.deleteTimeEntry).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("should not call the timeTrackingDatabase's deleteTimeEntry method and return if the time entry does not exist", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getTimeEntry = vi.fn().mockResolvedValue(null);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);
      mockTimeTrackingDatabase.deleteTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      const result = await timeTrackingService.deleteTimeEntry(
        mockTimeEntry.id,
      );

      // Assert
      expect(mockTimeTrackingDatabase.deleteTimeEntry).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("should propagate DatabaseErrors thrown by the timeTrackingDatabase's getTimeEntry method", async () => {
      // Arrange
      const databaseError = new DatabaseError('Database error');
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getTimeEntry = vi
        .fn()
        .mockRejectedValue(databaseError);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);
      mockTimeTrackingDatabase.deleteTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.deleteTimeEntry(mockTimeEntry.id),
      ).rejects.toThrowError(databaseError);

      // Assert
      expect(mockTimeTrackingDatabase.deleteTimeEntry).not.toHaveBeenCalled();
    });

    it("should propagate DatabaseErrors thrown by the timeTrackingDatabase's getProject method", async () => {
      // Arrange
      const databaseError = new DatabaseError('Database error');
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getTimeEntry = vi
        .fn()
        .mockResolvedValue(mockTimeEntry);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockRejectedValue(databaseError);
      mockTimeTrackingDatabase.deleteTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.deleteTimeEntry(mockTimeEntry.id),
      ).rejects.toThrowError(databaseError);

      // Assert
      expect(mockTimeTrackingDatabase.deleteTimeEntry).not.toHaveBeenCalled();
    });

    it("should propagate DatabaseErrors thrown by the timeTrackingDatabase's deleteTimeEntry method", async () => {
      // Arrange
      const databaseError = new DatabaseError('Database error');
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getTimeEntry = vi
        .fn()
        .mockResolvedValue(mockTimeEntry);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);
      mockTimeTrackingDatabase.deleteTimeEntry = vi
        .fn()
        .mockRejectedValue(databaseError);

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act & Assert
      await expect(
        timeTrackingService.deleteTimeEntry(mockTimeEntry.id),
      ).rejects.toThrowError(databaseError);
    });

    it("should call the timeTrackingDatabase's deleteTimeEntry method with the correct time entry id", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      mockTimeTrackingDatabase.getTimeEntry = vi
        .fn()
        .mockResolvedValue(mockTimeEntry);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);
      mockTimeTrackingDatabase.deleteTimeEntry = vi.fn();

      const timeTrackingService: ITimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act
      await timeTrackingService.deleteTimeEntry(mockTimeEntry.id);

      // Assert
      expect(
        mockTimeTrackingDatabase.deleteTimeEntry,
      ).toHaveBeenCalledExactlyOnceWith(mockTimeEntry.id);
    });
  });
});
