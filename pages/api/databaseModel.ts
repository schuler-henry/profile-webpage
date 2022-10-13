// @ts-check
import { createClient, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js'
import { AccessLevel } from '../../enums/accessLevel';
import { ITimer, IUser } from '../../interfaces/database'

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
  getUserFromResponse(dbResponse: PostgrestResponse<IUser>): IUser[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allUsers = [];

    for (const user of dbResponse.data) {
      allUsers.push({ id: user.id, username: user.username, password: user.password, accessLevel: user.accessLevel, firstName: user.firstName, lastName: user.lastName, email: user.email, unconfirmedEmail: user.unconfirmedEmail, activationCode: user.activationCode, active: user.active })
    }
    return allUsers;
  }

  /**
   * This is a universal select function for the user database
   */
  async selectUserTable(user: {userID?: number, username?: string, password?: string, accessLevel?: AccessLevel, firstName?: string, lastName?: string, email?: string, unconfirmedEmail?: string, activationCode?: string, active?: boolean}): Promise<PostgrestResponse<IUser>> {
    let idColumnName = "";
    let usernameColumnName = "";
    let passwordColumnName = "";
    let accessLevelColumnName = "";
    let firstNameColumnName = "";
    let lastNameColumnName = "";
    let emailColumnName = "";
    let unconfirmedEmailColumnName = "";
    let activationCodeColumnName = "";
    let activeColumnName = "";

    if (!(user.userID === undefined) && !isNaN(user.userID)) idColumnName = "id";
    if (!(user.username === undefined)) usernameColumnName = "username";
    if (!(user.password === undefined)) passwordColumnName = "password";
    if (!(user.accessLevel === undefined) && !isNaN(user.accessLevel)) accessLevelColumnName = "accessLevel";
    if (!(user.firstName === undefined)) firstNameColumnName = "firstName";
    if (!(user.lastName === undefined)) lastNameColumnName = "lastName";
    if (!(user.email === undefined)) emailColumnName = "email";
    if (!(user.unconfirmedEmail === undefined)) unconfirmedEmailColumnName = "unconfirmedEmail";
    if (!(user.activationCode === undefined)) activationCodeColumnName = "activationCode";
    if (!(user.active === undefined)) activeColumnName = "active";

    const userResponse = await DatabaseModel.CLIENT
      .from('User')
      .select()
      .eq(idColumnName, user.userID)
      .eq(usernameColumnName, user.username)
      .eq(passwordColumnName, user.password)
      .eq(accessLevelColumnName, user.accessLevel)
      .eq(firstNameColumnName, user.firstName)
      .eq(lastNameColumnName, user.lastName)
      .eq(emailColumnName, user.email?.toLowerCase())
      .eq(unconfirmedEmailColumnName, user.unconfirmedEmail?.toLowerCase())
      .eq(activationCodeColumnName, user.activationCode)
      .eq(activeColumnName, user.active);

    return userResponse;
  }

  /**
   * This method adds a user to the db
   */
  async addUser(username: string, hashedPassword: string, email: string, activationCode: string): Promise<PostgrestResponse<IUser>> {
    const addedUser = await DatabaseModel.CLIENT
      .from('User')
      .insert([
        { username: username, password: hashedPassword, accessLevel: AccessLevel.USER, unconfirmedEmail: email?.toLowerCase(), activationCode: activationCode, active: false },
      ]);

    return addedUser;
  }

  /**
   * This method is used to update a user
   * @param user updated user object
   */
  async updateUser(user: IUser): Promise<PostgrestResponse<IUser>> {
    const updatedUser = await DatabaseModel.CLIENT
      .from('User')
      .update({ username: user.username, password: user.password, accessLevel: user.accessLevel, firstName: user.firstName, lastName: user.lastName, email: user.email?.toLowerCase() || null, unconfirmedEmail: user.unconfirmedEmail?.toLowerCase() || null, activationCode: user.activationCode, active: user.active })
      .eq('id', user.id);

    return updatedUser;
  }

  /**
   * This method removes a target user from the database
   */
  async deleteUser(targetUserID: number): Promise<PostgrestResponse<IUser>> {
    const deletedUser = await DatabaseModel.CLIENT
      .from('User')
      .delete()
      .match({ 'id': targetUserID });

    return deletedUser;
  }

  //#endregion

  //#region Timer Methods

  getTimersFromResponse(dbResponse: PostgrestResponse<ITimer>): ITimer[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allTimers: ITimer[] = [];

    for (const timer of dbResponse.data) {
      allTimers.push({ id: timer.id, user: timer.user, name: timer.name, elapsedSeconds: timer.elapsedSeconds, startTime: timer.startTime })
    }
    return allTimers;
  }

  async selectTimerTable(userID: number): Promise<PostgrestResponse<ITimer>> {
    const timerResponse = await DatabaseModel.CLIENT
      .from('Timer')
      .select()
      .eq('user', userID);

    return timerResponse;
  }

  async addTimer(timer: ITimer): Promise<PostgrestResponse<ITimer>> {
    const addedTimer = await DatabaseModel.CLIENT
      .from('Timer')
      .insert([
        { user: timer.user.id, name: timer.name, elapsedSeconds: timer.elapsedSeconds, startTime: timer.startTime },
      ]);

    return addedTimer;
  }

  async deleteTimer(timerID: number, userID: number): Promise<PostgrestResponse<ITimer>> {
    const deletedTimer = await DatabaseModel.CLIENT
      .from('Timer')
      .delete()
      .match({ 'id': timerID, 'user': userID });
      
    return deletedTimer;
  }

  async updateTimer(userID: number, timer: ITimer): Promise<PostgrestResponse<ITimer>> {
    const updatedTimer = await DatabaseModel.CLIENT
      .from('Timer')
      .update({ name: timer.name, elapsedSeconds: timer.elapsedSeconds, startTime: timer.startTime })
      .eq('user', userID)
      .eq('id', timer.id);

    return updatedTimer;
  }

  async getFileFromBucket(bucketID: string, filePath: string): Promise<Blob> {
    const result = await DatabaseModel.CLIENT
      .storage
      .from(bucketID)
      .download(filePath);

    console.log(result.data);
    let file = result.data;
    return file;
  }

  async getFileURLFromBucket(bucketID: string, filePath: string): Promise<string> {
    const result = await DatabaseModel.CLIENT
      .storage
      .from(bucketID)
      .getPublicUrl(filePath);

    console.log(result.data);
    let url = result.data.publicURL;
    return url;
  }

  //#endregion
}