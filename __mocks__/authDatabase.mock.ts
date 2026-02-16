import { AuthDatabase } from '@/src/backend/data-access/database/authDatabase.interface';
import { vi } from 'vitest';

export const mockAuthDatabase: AuthDatabase = {
  getLoggedInUser: vi.fn().mockResolvedValue(null),
};
