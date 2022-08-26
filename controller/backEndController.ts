import { DatabaseModel } from '../pages/api/databaseModel';
import jwt from 'jsonwebtoken';
import fs from 'fs'
import path from 'path'
import * as bcrypt from 'bcrypt';
import { ITimer, IUser } from '../interfaces';

/**
 * Backend Controller of PersonalWebPage
 * @category Controller
 */
export class BackEndController {
  //#region Variables
  private static KEY: string;
  private databaseModel = new DatabaseModel();

  //#endregion

  //#region Constructor
  constructor() {
    BackEndController.KEY = process.env.TOKEN_KEY || '';
  }

  //#endregion

  //#region Token Methods

  /**
   * This method validates a given token with the current key.
   */
  isTokenValid(token: string): boolean {
    try {
      jwt.verify(token, BackEndController.KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * This method checks whether a given token is valid and contains an existing user
   */
  async isUserTokenValid(token: string): Promise<boolean> {
    if (this.isTokenValid(token)) {
      if (await this.handleUserAlreadyExists(this.getUsernameFromToken(token))) {
        return true;
      }
    }
    return false;
  }

  /**
   * This method extracts the username from a token
   */
  getUsernameFromToken(token: string): string {
    try {
      const data = jwt.decode(token);
      if (typeof data === "object" && data !== null) {
        return data.username
      }
    } catch (error) {

    }
    return "";
  }

  //#endregion

  //#region Password Methods

  /**
   * This method checks a password for requirements
   */
  isPasswordValid(password: string): boolean {
    /**
    * Requirements:
    * Length: min. 8 characters
    * Characters: min. 1 number, 1 uppercase character, 1 lowercase character, 1 special character
    * Characters: only letters and numbers + !*#,;?+-_.=~^%(){}|:"/
    */
    if (password.length >= 8) {
      if (password.match(".*[0-9].*") && password.match(".*[A-Z].*") && password.match(".*[a-z].*") && password.match('.*[!,*,#,;,?,+,_,.,=,~,^,%,(,),{,},|,:,",/,\,,\-].*')) {
        if (password.match('^[a-z,A-Z,0-9,!,*,#,;,?,+,_,.,=,~,^,%,(,),{,},|,:,",/,\,,\-]*$')) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Function to hash a password
   */
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword
  }

  /**
   * Function to check plain text with hash
   */
  async checkPassword(clearPassword: string, hashedpassword: string): Promise<boolean> {
    return await bcrypt.compare(clearPassword, hashedpassword);
  }

  //#endregion

  //#region User Methods

  /**
   * This method returns a filled User object for the given User.
   */
  async handleGetUserFromToken(token: string): Promise<IUser> {
    if (this.isTokenValid(token)) {
      const username = this.getUsernameFromToken(token);
      return this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, username))[0];
    }
    return null;
  }

  /**
   * This method changes the password from the current user
   */
  async handleChangeUserPassword(token: string, oldPassword: string, newPassword: string): Promise<boolean> {
    if (!this.isTokenValid(token)) {
      return false;
    }

    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, this.getUsernameFromToken(token)))[0];

    if (user === undefined) {
      return false;
    }

    if (this.isPasswordValid(newPassword) && await this.checkPassword(oldPassword, user.password)) {
      const newHashedPassword = await this.hashPassword(newPassword);
      return this.databaseModel.evaluateSuccess(await this.databaseModel.changeUserPassword(newHashedPassword, user.id));
    }

    return false;
  }

  /**
   * This method removes a target user from the database
   */
  async handleDeleteUser(userToken: string): Promise<boolean> {
    if (!await this.isUserTokenValid(userToken)) {
      return false;
    }

    const userTokenName = this.getUsernameFromToken(userToken);

    const targetUser = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, userTokenName))[0];

    if (targetUser === undefined) {
      return false;
    }

    return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteUser(targetUser.id));
  }

  /**
   * This method logs in a user if the given credentials are valid.
   */
  async handleLoginUser(username: string, password: string): Promise<string> {
    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable(undefined, username))[0];

    if (user === undefined) {
      return "";
    }

    if (await this.checkPassword(password, user.password)) {
      const token = jwt.sign({
        username: username,
      }, BackEndController.KEY, { expiresIn: '1 day' });
      return token;
    }
    return "";
  }

  /**
   * API function to register a user
   */
  async handleRegisterUser(username: string, password: string): Promise<boolean> {
    if (!await this.handleUserAlreadyExists(username)) {
      const vUsernameValid = this.isUsernameValid(username);
      const vPasswordValid = this.isPasswordValid(password);
      if (vUsernameValid && vPasswordValid) {
        const hashedPassword = await this.hashPassword(password);

        return this.databaseModel.evaluateSuccess(await this.databaseModel.addUser(username, hashedPassword));
      }
    }
    return false;
  }

  /**
   * This method checks whether a user already exists in the DB.
   */
  async handleUserAlreadyExists(username: string): Promise<boolean> {
    return this.databaseModel.evaluateSuccess(await this.databaseModel.selectUserTable(undefined, username));
  }

  /**
   * This method checks a username for requirements
   */
  isUsernameValid(username: string): boolean {
    /**
    * Requirements:
    * Length: 4-16 characters
    * Characters: only letters and numbers
    * Keyword admin is not allowed
    */
    if (username.length >= 4 && username.length <= 16) {
      if (username.match("^[a-zA-Z0-9]+$")) {
        if (username.match("[a-z,A-Z,0-9]*[a,A][d,D][m,M][i,I][n,N][a-z,A-Z,0-9]*")) {
          return false;
        }
        return true;
      }
    }
    return false;
  }

  //#endregion

  //#region File Methods

  getFileContent(filePath: string, fileName: string): string {
    let content: string;

    const dir = path.resolve('./', filePath)

    try {
      content = fs.readFileSync(`${path.join(dir, fileName)}`, 'utf-8');
    } catch (error) {
      content = "# This file does not exist!";
    }

    return content;
  }

  //#endregion

  //#region Timer Methods

  async handleGetTimersByToken(token: string): Promise<ITimer[]> {
    if (this.isTokenValid(token)) {
      const user: IUser = await this.handleGetUserFromToken(token);
      return this.databaseModel.getTimersFromResponse(await this.databaseModel.selectTimerTable(user.id));
    }
    return [];
  }

  async handleAddTimer(token: string, name: string): Promise<boolean> {
    if (this.isTokenValid(token)) {
      const user: IUser = await this.handleGetUserFromToken(token);
      const timer: ITimer = {id: null, user: user, name: name, elapsedSeconds: 0, startTime: null};
      return this.databaseModel.evaluateSuccess(await this.databaseModel.addTimer(timer));
    }
    return false;
  }

  async handleUpdateTimer(token: string, timer: ITimer): Promise<boolean> {
    if (this.isTokenValid(token)) {
      const user: IUser = await this.handleGetUserFromToken(token);
      return this.databaseModel.evaluateSuccess(await this.databaseModel.updateTimer(user.id, timer));
    }
    return false;
  }

  //#endregion
}