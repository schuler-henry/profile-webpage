import { mockAuthDatabase } from '@/__mocks__/authDatabase.mock';
import UserService from '@/src/backend/services/user/userService';
import { mockUser } from '@/__mocks__/backend/data-access/entities/user.mock';
import { User } from '@supabase/supabase-js';

describe('UserService', () => {
  describe('getLoggedInUser', () => {
    it('should delegate the call to the authDatabase', async () => {
      // Arrange
      const authDatabaseMock = mockAuthDatabase;
      mockAuthDatabase.getLoggedInUser = vi.fn().mockResolvedValue(mockUser);
      const userService: UserService = new UserService(authDatabaseMock);

      // Act
      const user: User | null = await userService.getLoggedInUser();

      // Assert
      expect(authDatabaseMock.getLoggedInUser).toHaveBeenCalledOnce();
      expect(user).toEqual(mockUser);
    });
  });
});
