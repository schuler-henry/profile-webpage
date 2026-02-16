import { IUserService } from '@/src/backend/services/user/userService.interface';

export const userServiceMock: IUserService = {
  getLoggedInUser: vi.fn().mockResolvedValue(null),
};
