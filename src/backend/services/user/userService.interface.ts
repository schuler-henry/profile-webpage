import { User } from '@supabase/supabase-js';

export interface IUserService {
  /**
   * Retrieves the currently logged-in user.
   * @return A promise that resolves to the User object if a user is logged in, or null if no user is logged in.
   */
  getLoggedInUser(): Promise<User | null>;
}
