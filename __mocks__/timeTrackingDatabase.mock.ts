import { TimeTrackingDatabase } from '@/src/backend/data-access/database/timeTrackingDatabase.interface';
import { vi } from 'vitest';

export const mockTimeTrackingDatabase: TimeTrackingDatabase = {
  getProject: vi.fn().mockResolvedValue(null),

  getProjects: vi.fn().mockResolvedValue([]),

  getAllTimeEntries: vi.fn().mockResolvedValue([]),

  createTimeEntries: vi.fn().mockResolvedValue(undefined),

  createTimeEntry: vi.fn().mockResolvedValue(undefined),

  updateTimeEntry: vi.fn().mockResolvedValue(undefined),

  deleteTimeEntry: vi.fn().mockResolvedValue(undefined),
};
