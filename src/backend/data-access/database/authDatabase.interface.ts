import { User } from '@supabase/supabase-js';

/**
 * Interface for all database operations related to the authentication.
 */
export interface AuthDatabase {
  /**
   * Fetches the currently logged-in user from the database.
   * @return A promise that resolves to the User object if a user is logged in, or null if no user is logged in.
   */
  getLoggedInUser(): Promise<User | null>;
}
