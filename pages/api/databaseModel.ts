// @ts-check
import { createClient, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js'
import { AccessLevel } from '../../enums/accessLevel';
import { User } from '../../interfaces'

/**
 * DataBase Model to Connect BackendController with Supabase DB
 * @category API
 */
export class DatabaseModel {
  //#region Variables
  private static CLIENT: SupabaseClient;
  //#endregion

  //#region Constructor
  constructor() {
    const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    DatabaseModel.CLIENT = createClient(supabaseUrl, supabaseAnonKey);
  }

  //#endregion

  //#region Universal Methods

  /**
   * Checks if DB-Response is successful
   */
  evaluateSuccess(dbResponse: PostgrestResponse<any>): boolean {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return false;
    }
    return true;
  }

  //#endregion

  //#region User Methods

  /**
   * This method extracts user object from db response
   */
  getUserFromResponse(dbResponse: PostgrestResponse<User>): User[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allUsers = [];

    for (const user of dbResponse.data) {
      allUsers.push({ id: user.id, name: user.name, password: user.password, accessLevel: user.accessLevel })
    }
    return allUsers;
  }

  /**
   * This is a universal select function for the user database
   */
  async selectUserTable(userID?: number, username?: string, password?: string, accessLevel?: AccessLevel): Promise<PostgrestResponse<User>> {
    let idColumnName = "";
    let usernameColumnName = "";
    let passwordColumnName = "";
    let accessLevelColumnName = "";

    if (!(userID === undefined) && !isNaN(userID)) idColumnName = "id";
    if (!(username === undefined)) usernameColumnName = "name";
    if (!(password === undefined)) passwordColumnName = "password";
    if (!(accessLevel === undefined) && !isNaN(accessLevel)) accessLevelColumnName = "accessLevel";

    const userResponse = await DatabaseModel.CLIENT
      .from('User')
      .select()
      .eq(idColumnName, userID)
      .eq(usernameColumnName, username)
      .eq(passwordColumnName, password)
      .eq(accessLevelColumnName, accessLevel)

    return userResponse;
  }

  /**
   * This method adds a user to the db
   */
  async addUser(username: string, hashedPassword: string): Promise<PostgrestResponse<User>> {
    const addedUser = await DatabaseModel.CLIENT
      .from('User')
      .insert([
        { name: username, password: hashedPassword, accessLevel: AccessLevel.USER },
      ]);

    return addedUser;
  }

  /** 
   * This method is used to change the password of a user
   */
  async changeUserPassword(newHashedPassword: string, userID: number): Promise<PostgrestResponse<User>> {
    const updatedUser = await DatabaseModel.CLIENT
      .from('User')
      .update({ password: newHashedPassword })
      .eq('id', userID);

    return updatedUser;
  }

  /**
   * This method removes a target user from the database
   */
  async deleteUser(targetUserID: number): Promise<PostgrestResponse<User>> {
    const deletedUser = await DatabaseModel.CLIENT
      .from('User')
      .delete()
      .match({ 'id': targetUserID });

    return deletedUser;
  }

  //#endregion
}