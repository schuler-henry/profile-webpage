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
import { mockTimeEntry } from '@/__mocks__/backend/data-access/entities/timeEntry.mock';

describe('TimeTrackingService', () => {
  describe('getProjects', () => {
    it("should not call the timeTrackingDatabase's getProjects method and return an empty array if the user is not logged in", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(null);

      const timeTrackingService: TimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act
      const result = await timeTrackingService.getProjects(mockUser.id);

      // Assert
      expect(mockTimeTrackingDatabase.getProjects).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should not call the timeTrackingDatabase's getProjects method and return an empty array if the user is logged in but the userId does not match", async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi
        .fn()
        .mockResolvedValue(otherMockUser);

      const timeTrackingService: TimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act
      const result = await timeTrackingService.getProjects(mockUser.id);

      // Assert
      expect(mockTimeTrackingDatabase.getProjects).not.toHaveBeenCalled();
      expect(result).toEqual([]);
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
    it('should not call the timeTrackingDatabase and return an empty array if the user is not logged in', async () => {
      // Arrange
      userServiceMock.getLoggedInUser = vi.fn().mockResolvedValue(null);
      mockTimeTrackingDatabase.getProject = vi
        .fn()
        .mockResolvedValue(mockProject);

      const timeTrackingService: TimeTrackingService = new TimeTrackingService(
        mockTimeTrackingDatabase,
        userServiceMock,
      );

      // Act
      const result = await timeTrackingService.getAllTimeEntries(
        mockProject.id,
      );

      // Assert
      expect(mockTimeTrackingDatabase.getAllTimeEntries).not.toHaveBeenCalled();
      expect(result).toEqual([]);
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

    it('should not call the timeTrackingDatabase and return an empty array if the logged in user does not own the project', async () => {
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
      const result = await timeTrackingService.getAllTimeEntries(
        otherMockProject.id,
      );

      // Assert
      expect(mockTimeTrackingDatabase.getAllTimeEntries).not.toHaveBeenCalled();
      expect(result).toEqual([]);
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

  describe('createTimeEntry', () => {});
});
