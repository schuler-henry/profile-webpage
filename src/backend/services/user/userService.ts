import { IUserService } from '@/src/backend/services/user/userService.interface';
import { User } from '@supabase/supabase-js';
import { AuthDatabase } from '@/src/backend/data-access/database/authDatabase.interface';

export default class UserService implements IUserService {
  constructor(private readonly authDatabase: AuthDatabase) {}

  public async getLoggedInUser(): Promise<User | null> {
    return this.authDatabase.getLoggedInUser();
  }
}
