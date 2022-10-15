import { DatabaseModel } from '../pages/api/databaseModel';
import jwt from 'jsonwebtoken';
import fs from 'fs'
import path from 'path'
import * as bcrypt from 'bcrypt';
import { ISportClub, ISportClubMembership, ISportEvent, ITimer, IUser } from '../interfaces/database';
import { randomStringGenerator } from '../shared/randomStringGenerator';
import { SMTPClient } from 'emailjs';
import { isEmailValid } from '../pages/api/users/requirements';

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

  createToken(id: number, username: string): string {
    const token = jwt.sign({
      id: id,
      username: username,
    }, BackEndController.KEY, { expiresIn: '1 day' });
    return token
  }

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
      const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({ userID: this.getIdFromToken(token) }))[0];
      if (user !== undefined) {
        return true;
      }
    }
    return false;
  }

  /**
   * This method extracts the username from a token
   */
   getIdFromToken(token: string): number {
    try {
      const data = jwt.decode(token);
      if (typeof data === "object" && data !== null && data.id !== undefined) {
        return data.id
      }
    } catch (error) {

    }
    return -1;
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

  async handleRenewToken(token: string): Promise<string> {
    if (this.isTokenValid(token)) {
      const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({ userID: this.getIdFromToken(token) }))[0];
      if (user === undefined) {
        return "";
      }

      return this.createToken(user.id, user.username);
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
      return this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({username: username}))[0];
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

    let user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({username: this.getUsernameFromToken(token)}))[0];

    if (user === undefined) {
      return false;
    }

    if (this.isPasswordValid(newPassword) && await this.checkPassword(oldPassword, user.password)) {
      const newHashedPassword = await this.hashPassword(newPassword);
      user.password = newHashedPassword;
      return this.databaseModel.evaluateSuccess(await this.databaseModel.updateUser(user))
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

    const targetUser = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({username: userTokenName}))[0];

    if (targetUser === undefined) {
      return false;
    }

    return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteUser(targetUser.id));
  }

  /**
   * This method logs in a user if the given credentials are valid.
   */
  async handleLoginUser(username: string, password: string): Promise<string> {
    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({username: username}))[0];

    if (user === undefined) {
      return "";
    }

    if (!user.active) {
      return "inactive";
    }

    if (await this.checkPassword(password, user.password)) {
      return this.createToken(user.id, user.username);
    }
    return "";
  }

  /**
   * API function to register a user
   */
  async handleRegisterUser(username: string, password: string, email: string): Promise<boolean> {
    email = email?.toLowerCase();
    if (!await this.handleUserAlreadyExists(username)) {
      const vUsernameValid = this.isUsernameValid(username);
      const vPasswordValid = this.isPasswordValid(password);
      const vEmailValid = isEmailValid(email);
      if (vUsernameValid && vPasswordValid && vEmailValid) {
        const hashedPassword = await this.hashPassword(password);
        const activationCode = randomStringGenerator(10);

        if (this.databaseModel.evaluateSuccess(await this.databaseModel.addUser(username, hashedPassword, email, activationCode))) {
          // send email with activation code
          const emailClient = new SMTPClient({
            user: process.env.MAIL,
            password: process.env.MAIL_PASSWORD,
            host: process.env.MAIL_HOST,
            ssl: true
          })
  
          try {
            await emailClient.sendAsync(
              {
                from: process.env.NOREPLY,
                to: email,
                subject: "Signup | Verification",
                text: `Thanks for signing up!

Your account has been created, you can login with your credentials after you have activated your account by pressing the url below.

---------------------------------------------
username: ${username}
---------------------------------------------
              
Please click this link to activate your account:
https://henryschuler.de/activate?username=${username}&activationCode=${activationCode}


---------------------------------------------

If the link does not work, visit https://henryschuler.de/activate and enter the following information:

username: ${username}
code: ${activationCode}


Thanks,
Henry Schuler`,
// TODO: Display E-Mail as styled HTML
// attachment: [
//   { data: '<html>i <i>hope</i> this works!</html>', alternative: true },
//   { path: 'path/to/file.zip', type: 'application/zip', name: 'renamed.zip' },
// ],
              }
            )
          } catch (e) {
            // TODO: Handle failed email sending, i.e. delete user from DB
            console.log("Email send failed !!!!")
            console.log(e)
          }
          return true
        }
      }
    }
    return false;
  }

  async handleActivateUser(username: string, activationCode: string): Promise<boolean> {
    if (username === "" || activationCode === "" || username === undefined || activationCode === undefined) {
      return false;
    }
    
    let user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({username: username, activationCode: activationCode}))[0];

    if (user === undefined || user.unconfirmedEmail === "" || user.unconfirmedEmail === null) {
      console.log("User is undefined or unconfirmed email is empty")
      return false;
    }

    // user with correct activationCode and inactive found -> activate user

    user.activationCode = null;
    user.active = true;
    user.email = user.unconfirmedEmail;
    user.unconfirmedEmail = null;
    return this.databaseModel.evaluateSuccess(await this.databaseModel.updateUser(user));
  }

  /**
   * This method updates a user in the database
   * username, first and last name
   */
  async handleUpdateProfile(userToken: string, newUser: IUser): Promise<boolean> {
    if (!this.isTokenValid(userToken)) {
      return false;
    }

    let user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({userID: this.getIdFromToken(userToken)}))[0];

    if (user === undefined) {
      return false;
    }

    // check if all new values are valid
    if (user.username !== newUser.username) {
      // check username requirements
      if (!this.isUsernameValid(newUser.username) || await this.handleUserAlreadyExists(newUser.username)) {
        return false;
      }
      user.username = newUser.username;
    }
    if (user.firstName !== newUser.firstName) {
      user.firstName = newUser.firstName.replace(/ /g, "");
    }
    if (user.lastName !== newUser.lastName) {
      user.lastName = newUser.lastName.replace(/  /g, " ").trim();
    }

    return this.databaseModel.evaluateSuccess(await this.databaseModel.updateUser(user));
  }

  /**
   * This method adds a new email to the user (unconfirmedEmail), generates a activation code and sends an email to the new email address
   */
  async handleUpdateEmail(userToken: string, newEmail: string): Promise<boolean> {
    if (!this.isTokenValid(userToken)) {
      return false;
    }

    let user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({userID: this.getIdFromToken(userToken)}))[0];

    if (user === undefined) {
      return false;
    }

    if (!isEmailValid(newEmail) || await this.handleEmailAlreadyExists(newEmail)) {
      console.log("email invalid")
      return false;
    }

    // valid email that does not exist already
    user.unconfirmedEmail = newEmail;
    user.activationCode = randomStringGenerator(10);

    if (this.databaseModel.evaluateSuccess(await this.databaseModel.updateUser(user))) {
      // send email with activation code
      const emailClient = new SMTPClient({
        user: process.env.MAIL,
        password: process.env.MAIL_PASSWORD,
        host: process.env.MAIL_HOST,
        ssl: true
      })

      try {
        await emailClient.sendAsync(
          {
            from: process.env.NOREPLY,
            to: newEmail,
            subject: "Confirm your new email address",
            text: `You have requested to change your email address to ${newEmail}.

The request has been processed. By confirming your new email address, the changes will be applied.

---------------------------------------------
username: ${user.username}
---------------------------------------------
          
Please follow this link to confirm your new email address:
https://henryschuler.de/activate?username=${user.username}&activationCode=${user.activationCode}


---------------------------------------------

If the link does not work, visit https://henryschuler.de/activate and enter the following information:

username: ${user.username}
code: ${user.activationCode}


Thanks,
Henry Schuler`,
// TODO: Display E-Mail as styled HTML
// attachment: [
//   { data: '<html>i <i>hope</i> this works!</html>', alternative: true },
//   { path: 'path/to/file.zip', type: 'application/zip', name: 'renamed.zip' },
// ],
          }
        )
      } catch (e) {
        // TODO: Handle failed email sending, i.e. delete changes from DB
        console.log("Email send failed !!!!")
        console.log(e)
      }
      return true
    }
    return false
  }

  /**
   * This method adds the given sport club memberships to the user
   */
  async handleAddUserSportClubMembership(userToken: string, sportClubMembership: ISportClubMembership): Promise<boolean> {
    if (!this.isTokenValid(userToken)) {
      return false;
    }

    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({userID: this.getIdFromToken(userToken)}))[0];

    if (user === undefined) {
      return false;
    }

    // check if sport club membership has sportClub and sport defined
    if ((typeof sportClubMembership.sportClub === "object" ? sportClubMembership.sportClub.id : sportClubMembership.sportClub) === undefined || sportClubMembership.membershipSport.length <= 0) {
      return false;
    }

    // check if membership already exists
    let existingMembership = user.sportClubMembership.find((membership) => (typeof membership.sportClub === "object" ? membership.sportClub.id : membership.sportClub) === (typeof sportClubMembership.sportClub === "object" ? sportClubMembership.sportClub.id : sportClubMembership.sportClub))
    if (!existingMembership) {
      // create membership
      if (!this.databaseModel.evaluateSuccess(await this.databaseModel.addSportClubMembership({user: user.id, sportClub: (typeof sportClubMembership.sportClub === "object" ? sportClubMembership.sportClub.id : sportClubMembership.sportClub)}))) {
        // could not create membership
        return false;
      }
    } else {
      // membership already exists
      // check for already existing sports
      for (const membershipSport of sportClubMembership.membershipSport) {
        let existingMembershipSport = existingMembership.membershipSport.find((existingMembershipSport) => existingMembershipSport.sport.id === membershipSport.sport.id)
        if (existingMembershipSport) {
          // sport already exists
          sportClubMembership.membershipSport.splice(sportClubMembership.membershipSport.findIndex(item => item.sport.id === existingMembershipSport.sport.id), 1)
        }
      }
      if (sportClubMembership.membershipSport.length <= 0) {
        // all sports already exist
        return false;
      }
    }
    // membership exists

    if (existingMembership === undefined) {
      existingMembership = this.databaseModel.getSportClubMembershipFromResponse(await this.databaseModel.selectSportClubMembershipTable({user: user.id, sportClub: (typeof sportClubMembership.sportClub === "object" ? sportClubMembership.sportClub.id : sportClubMembership.sportClub)}))[0];
    }

    for (const membershipSport of sportClubMembership.membershipSport) {
      // add all sports
      if (!this.databaseModel.evaluateSuccess(await this.databaseModel.addSportClubMembershipSport({sportClubMembership: existingMembership.id, sport: membershipSport.sport.id}))) {
        // could not add sport
        return false;
      }
    }

    return true;
  }

  /**
   * This method removes the given sport club memberships from the user
   */
  async handleDeleteUserSportClubMembership(userToken: string, sportClubMembership: ISportClubMembership): Promise<boolean> {
    if (!this.isTokenValid(userToken)) {
      return false;
    }

    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({userID: this.getIdFromToken(userToken)}))[0];

    if (user === undefined) {
      return false;
    }
    
    // check if user has membership
    let existingMembership = user.sportClubMembership.find((membership) => (typeof membership.sportClub === "object" ? membership.sportClub.id : membership.sportClub) === (typeof sportClubMembership.sportClub === "object" ? sportClubMembership.sportClub.id : sportClubMembership.sportClub))
    if (!existingMembership) {
      return false
    }

    for (const membershipSport of sportClubMembership.membershipSport) {
      // check if user has sport
      let existingMembershipSport = existingMembership.membershipSport.find((existingMembershipSport) => existingMembershipSport.sport.id === membershipSport.sport.id)
      if (existingMembershipSport) {
        // sport exists
        // remove sportClubMembershipSport from db
        if (!this.databaseModel.evaluateSuccess(await this.databaseModel.deleteSportClubMembershipSport({sportClubMembership: existingMembership.id, sport: existingMembershipSport.sport.id}))) {
          // could not delete sport
          return false;
        } else {
          // remove sport from membership
          existingMembership.membershipSport.splice(existingMembership.membershipSport.findIndex(item => item.sport.id === existingMembershipSport.sport.id), 1)
        }
      }
    }

    if(existingMembership.membershipSport.length <= 0) {
      // remove membership from db
      if (!this.databaseModel.evaluateSuccess(await this.databaseModel.deleteSportClubMembership({id: existingMembership.id}))) {
        // could not delete membership
        return false;
      }
    }

    return true
  }

  /**
   * This method checks whether a email already exists in the DB.
   */
  async handleEmailAlreadyExists(email: string): Promise<boolean> {
    email = email?.toLowerCase();
    return this.databaseModel.evaluateSuccess(await this.databaseModel.selectUserTable({email: email})) || this.databaseModel.evaluateSuccess(await this.databaseModel.selectUserTable({unconfirmedEmail: email}));
  }

  /**
   * This method checks whether a user already exists in the DB.
   */
  async handleUserAlreadyExists(username: string): Promise<boolean> {
    return this.databaseModel.evaluateSuccess(await this.databaseModel.selectUserTable({username: username}));
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

  async handleDeleteTimer(token: string, timerId: number): Promise<boolean> {
    if (this.isTokenValid(token)) {
      const user: IUser = await this.handleGetUserFromToken(token);
      return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteTimer(timerId, user.id));
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

  //#region Sport Methods

  /**
   * This method checks whether the given user has Trainer permission (or higher) for the given sport club sport
   */
  async isValidTrainer(userToken: string, sportClubID: number, sportID: number) {
    if (!this.isTokenValid(userToken)) {
      return false;
    }

    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({userID: this.getIdFromToken(userToken)}))[0];

    if (user === undefined) {
      return false;
    }

    const userSportClubMembership = user.sportClubMembership.find(item => (typeof item.sportClub === "object" ? item.sportClub.id : item.sportClub) === sportClubID);

    if (userSportClubMembership === undefined) {
      return false;
    }

    const userMembershipSport = userSportClubMembership.membershipSport.find(item => item.sport.id === sportID);

    if (userMembershipSport === undefined || !userMembershipSport.approved || userMembershipSport.memberStatus <= 0) {
      return false;
    }

    return true;
  }

  /**
   * This method returns all sport clubs from the database
   */
  async handleGetSportClubs(token: string): Promise<ISportClub[]> {
    if (this.isTokenValid(token)) {
      return this.databaseModel.getSportClubsFromResponse(await this.databaseModel.selectSportClubTable({}));
    }
    return [];
  }

  // TODO: update function
  async handleGetSportEvents(token: string): Promise<ISportEvent[]> {
    if (this.isTokenValid(token)) {
      return this.databaseModel.getSportEventsFromResponse(await this.databaseModel.selectSportEventTable());
    }
    return [];
  }

  /**
   * This method returns all sport clubs
   */
  async handleGetAdminSportClubs(token: string): Promise<ISportClub[]> {
    if (this.isTokenValid(token)) {
      let adminClubs: ISportClub[] = [];
      const user = await this.handleGetUserFromToken(token);
      for (const membership of user.sportClubMembership) {
        const sportClubID = typeof membership.sportClub === "object" ? membership.sportClub.id : membership.sportClub
        let sportIDArray = [];

        for (const membershipSport of membership.membershipSport) {
          if (membershipSport.memberStatus > 0 && membershipSport.approved) {
            sportIDArray.push(membershipSport.sport.id)
          }
        }

        if (sportIDArray.length > 0) {
          // add sportClub with selected sports
          adminClubs.push(this.databaseModel.getSportClubsFromResponse(await this.databaseModel.selectSportClubMembershipTableAdmin(sportClubID, sportIDArray))[0])
        }
      }
      return adminClubs;
    }
    return [];
  }

  /**
   * This method sets the accepted status of a sport club membership sport for a user
   */
  async handleAcceptSportClubMembership(userToken: string, sportClubMembership: ISportClubMembership): Promise<boolean> {
    if (!this.isTokenValid(userToken)) {
      return false;
    }
      
    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({userID: this.getIdFromToken(userToken)}))[0];

    if (user === undefined) {
      return false;
    }

    const userSportClubMembership = user.sportClubMembership.find(item => (typeof item.sportClub === "object" ? item.sportClub.id : item.sportClub) === (typeof sportClubMembership.sportClub === "object" ? sportClubMembership.sportClub.id : sportClubMembership.sportClub));
    
    // console.log(userSportClubMembership, sportClubMembership);

    for (const membershipSport of sportClubMembership.membershipSport) {
      const userMembershipSport = userSportClubMembership.membershipSport.find(item => item.sport.id === membershipSport.sport.id)
      if (userMembershipSport && userMembershipSport.approved && userMembershipSport.memberStatus > 0) {
        // console.log(userMembershipSport, membershipSport);
        // approve membership
        // console.log(sportClubMembership.id, membershipSport.sport.id, membershipSport.memberStatus, membershipSport.approved);
        return this.databaseModel.evaluateSuccess(await this.databaseModel.updateSportClubMembershipSportRelation(sportClubMembership.id, membershipSport.sport.id, membershipSport.memberStatus, true));
      }
    }
    
    return false;
  }

  /**
   * This method deletes a sport club membership of a user
   */
  async handleDeleteAdminSportClubMembership(userToken: string, sportClubMembership: ISportClubMembership): Promise<boolean> {
    if (!this.isTokenValid(userToken)) {
      return false;
    }

    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({userID: this.getIdFromToken(userToken)}))[0];

    if (user === undefined) {
      return false;
    }

    const userSportClubMembership = user.sportClubMembership.find(item => (typeof item.sportClub === "object" ? item.sportClub.id : item.sportClub) === (typeof sportClubMembership.sportClub === "object" ? sportClubMembership.sportClub.id : sportClubMembership.sportClub));

    for (const membershipSport of sportClubMembership.membershipSport) {
      const userMembershipSport = userSportClubMembership.membershipSport.find(item => item.sport.id === membershipSport.sport.id)
      if (userMembershipSport && userMembershipSport.approved && userMembershipSport.memberStatus > 0) {
        // delete membership
        if(!this.databaseModel.evaluateSuccess(await this.databaseModel.deleteSportClubMembershipSport({sportClubMembership: sportClubMembership.id, sport: membershipSport.sport.id}))) {
          return false;
        }
      }
    }

    if (this.databaseModel.getSportClubMembershipSportFromResponse(await this.databaseModel.selectSportClubMembershipSportRelationTable({sportClubMembership: sportClubMembership.id})).length === 0) {
      // delete membership
      return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteSportClubMembership({id: sportClubMembership.id}));
    }
    return true;
  }

  /**
   * This method returns all users that are not members of the given sport club sport
   */
  async handleGetUsersWithoutSportClubMembershipSport(userToken: string, sportClubID: number, sportID: number): Promise<IUser[]> {
    if (!await this.isValidTrainer(userToken, sportClubID, sportID)) {
      return [];
    }

    return this.databaseModel.getUserFromResponse(await this.databaseModel.getUsersWithoutMembershipSport(sportClubID, sportID));
  }

  /**
   * This method adds a sport club membership sport for multiple users
   */
  async handleAddAdminUserSportClubMembership(userToken: string, sportClubID: number, sportID: number, users: IUser[]): Promise<boolean> {
    if (!await this.isValidTrainer(userToken, sportClubID, sportID)) {
      return false;
    }

    for (const user of users) {
      // check if sportMembership for sportClubID already exists
      let sportClubMembership = this.databaseModel.getSportClubMembershipFromResponse(await this.databaseModel.selectSportClubMembershipTable({user: user.id, sportClub: sportClubID}))[0];
      if (sportClubMembership === undefined) {
        // create new sportClubMembership
        sportClubMembership = this.databaseModel.getSportClubMembershipFromResponse(await this.databaseModel.addSportClubMembership({user: user.id, sportClub: sportClubID}))[0];
        if (sportClubMembership === undefined) {
          return false;
        }
      }
      // sportClubMembership is defined
      // check if sport for sportClubMembership already exists
      let sportClubMembershipSport = this.databaseModel.getSportClubMembershipSportFromResponse(await this.databaseModel.selectSportClubMembershipSportRelationTable({sportClubMembership: sportClubMembership.id, sport: sportID}))[0];
      if (sportClubMembershipSport === undefined) {
        // create new sportClubMembershipSport
        sportClubMembershipSport = this.databaseModel.getSportClubMembershipSportFromResponse(await this.databaseModel.addSportClubMembershipSport({sportClubMembership: sportClubMembership.id, sport: sportID, approved: true}))[0];
        if (sportClubMembershipSport === undefined) {
          return false;
        }
      }
    }
    
    return true;
  }

  //#endregion
}