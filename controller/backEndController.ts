import { DatabaseModel } from '../pages/api/databaseModel';
import jwt from 'jsonwebtoken';
import fs from 'fs'
import path from 'path'
import * as bcrypt from 'bcrypt';
import { GitHubProject, ISport, ISportClub, ISportClubMembership, ISportClubMembershipSport, ISportEvent, ISportEventType, ISportLocation, ITimer, IUser } from '../interfaces/database';
import { randomStringGenerator } from '../shared/randomStringGenerator';
import { SMTPClient } from 'emailjs';
import { isEmailValid } from '../pages/api/users/requirements';
import { SportEventVisibility } from '../enums/sportEventVisibility';

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
   * This method extracts the userId from a token
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
            // console.log("Email send failed !!!!")
            // console.log(e)
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
      // console.log("User is undefined or unconfirmed email is empty")
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
      // console.log("email invalid")
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
        // console.log("Email send failed !!!!")
        // console.log(e)
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

  async handleGetAllUsers(userToken: string): Promise<IUser[]> {
    if (this.isTokenValid(userToken)) {
      const users =  this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({}));
      // remove password, accessLevel, unconfirmedEmail, activationCode
      return users.map((user) => {
        return (
          { ...user, password: "", accessLevel: 0, unconfirmedEmail: "", activationCode: "" }
        )
      })
    }
    return [];
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

  async getFileFromBucket(bucketID: string, filePath: string): Promise<Blob> {
    const fileBlob = await this.databaseModel.downloadFileFromBucket(bucketID, filePath);
    return fileBlob;
  }

  async getFileURLFromBucket(bucketID: string, filePath: string): Promise<string> {
    return this.databaseModel.getFileURLFromBucket(bucketID, filePath);
  }

  //#endregion

  //#region Summaries Methods

  async handleGetAllSummaries(): Promise<string[]> {
    const fileNames: string[] = (await this.databaseModel.getFolderContentInfoFromBucket("studies.summaries", "summaries"))
                                  .filter(item => item.name.endsWith('.md'))
                                  .map(item => item.name)

    const data = await Promise.all(
      fileNames.map(
        async (fileName: string) => {
          return (await this.databaseModel.downloadFileFromBucket("studies.summaries", `summaries/${fileName}`)).text()
        }
      )
    )

    return data
  }

  //#endregion

  //#region GitHubProjects Methods
  
  async handleGetGitHubProjects(): Promise<GitHubProject[]> {
    return this.databaseModel.getGitHubProjectsFromResponse(await this.databaseModel.selectGitHubProjectsTable());
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

  // helper functions
  /**
   * This method checks whether the given user is creator of the given sport event
   */
  isCreator(sportEvent: ISportEvent, userId: number): boolean {
    return sportEvent.creator.id === userId;
  }

  /**
   * This method checks whether the given user is participant of the given sport event
   */
  isSportEventMember(sportEvent: ISportEvent, userId: number): boolean {
    for (const sportMatch of sportEvent.sportMatch) {
      for (const sportTeam of sportMatch.sportTeam) {
        for (const user of sportTeam.user) {
          if (user.id === userId) {
            return true
          }
        }
      }
    }
    return false
  }

  /**
   * This method checks whether the given user is member of the selected sport clubs
   */
  async isSportClubMember(sportEvent: ISportEvent, userId: number): Promise<boolean> {
    sportEvent.sportClubs.forEach(async sportClub => {
      if(this.databaseModel.evaluateSuccess(await this.databaseModel.selectSportClubMembershipTable({sportClub: sportClub.sportClub.id, user: userId}))) {
        return true
      }
    })
    return false
  }

  /**
   * This method checks whether the given user is member of the selected sport clubs sports
   */
  async isSportClubSportMember(sportEvent: ISportEvent, userId: number): Promise<boolean> {
    sportEvent.sportClubs.forEach(async sportClub => {
      const membership = this.databaseModel.getSportClubMembershipFromResponse(await this.databaseModel.selectSportClubMembershipTable({sportClub: sportClub.sportClub.id, user: userId}))[0]
      if (membership.membershipSport.find(item => item.sport.id === sportEvent.sport.id)) {
        return true
      }
    })
    return false
  }

  /**
   * This method returns all sport events from the database that are visible to the given user
   */
  async handleGetSportEvents(token: string): Promise<ISportEvent[]> {
    if (this.isTokenValid(token)) {
      const userId = this.getIdFromToken(token);
      const allSportEvents = await this.databaseModel.getSportEventsFromResponse(await this.databaseModel.selectSportEventTable());
      let sportEvents: ISportEvent[] = [];

      for (const sportEvent of allSportEvents) {
        let addEvent = false
        switch (sportEvent.visibility) {
          case SportEventVisibility.creatorOnly:
            if (this.isCreator(sportEvent, userId)) {
              addEvent = true
            }
            break;
          case SportEventVisibility.creatorMembers:
            if (this.isCreator(sportEvent, userId) || this.isSportEventMember(sportEvent, userId)) {
              addEvent = true
            }
            break;
          case SportEventVisibility.creatorMemberClubSportMember: 
            if (this.isCreator(sportEvent, userId) || this.isSportEventMember(sportEvent, userId) || await this.isSportClubSportMember(sportEvent, userId)) {
              addEvent = true
            }
            break;
          case SportEventVisibility.creatorMemberClubMember:
            if (this.isCreator(sportEvent, userId) || this.isSportEventMember(sportEvent, userId) || await this.isSportClubMember(sportEvent, userId)) {
              addEvent = true
            }
            break;
          case SportEventVisibility.public:
            addEvent = true
            break;
          default:
            break;
        }

        if (addEvent) {
          sportEvents.push(sportEvent);
        }
      }
      return sportEvents
    }
    return [];
  }

  async handleAddSportEvent(token: string, sportEvent: ISportEvent): Promise<number> {
    if (!this.isTokenValid(token)) {
      return undefined;
    }

    if (
      !sportEvent.startTime ||
      !sportEvent.endTime ||
      sportEvent.visibility === undefined ||
      !sportEvent.sport ||
      !sportEvent.sportLocation ||
      !sportEvent.sportEventType
    ) {
      return undefined;
    }

    const user = this.databaseModel.getUserFromResponse(await this.databaseModel.selectUserTable({userID: this.getIdFromToken(token)}))[0];

    if (user === undefined) {
      return undefined;
    }

    sportEvent.creator = user;

    const addSportEvent = await this.databaseModel.addSportEventTable(sportEvent)

    return (await this.databaseModel.getSportEventsFromResponse(addSportEvent))[0].id;
  }

  async handleDeleteSportEvent(token: string, sportEventId: number): Promise<boolean> {
    if (!this.isTokenValid(token)) {
      return false;
    }

    const sportEvent = (await this.databaseModel.getSportEventsFromResponse(await this.databaseModel.selectSportEventTable())).find(item => item.id === sportEventId);

    if (sportEvent === undefined) {
      return true;
    }

    if (sportEvent.creator.id !== this.getIdFromToken(token)) {
      return false;
    }

    if (!await this.handleUpdateSportEvent(token, { ...sportEvent, sportClubs: [], sportMatch: [] })) {
      return false;
    }

    return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteSportEventTable({id: sportEventId}));
  }

  async handleUpdateSportEvent(token: string, sportEvent: ISportEvent): Promise<boolean> {
    if (!this.isTokenValid(token)) {
      return false;
    }

    if (sportEvent.id === undefined) {
      sportEvent.id = await this.handleAddSportEvent(token, sportEvent);
    }

    // updated existing sport event
    const sportEventFromDB = (await this.databaseModel.getSportEventsFromResponse(await this.databaseModel.selectSportEventTable())).find(item => item.id === sportEvent.id);
    
    if (sportEventFromDB === undefined || !this.isCreator(sportEventFromDB, this.getIdFromToken(token))) {
      return false;
    }

    // sport event is valid and user has the rights to update it

    // update sport event
    const sportEventUpdate = await this.databaseModel.updateSportEventTable(sportEventFromDB.id, {
      startTime: sportEvent.startTime,
      endTime: sportEvent.endTime,
      description: sportEvent.description,
      visibility: sportEvent.visibility,
      creator: sportEvent.creator.id,
      sport: sportEvent.sport.id,
      sportLocation: sportEvent.sportLocation.id,
      sportEventType: sportEvent.sportEventType.id,
    });

    if (!this.databaseModel.evaluateSuccess(sportEventUpdate)) {
      return false;
    }

    // update sport clubs

    let newSportClubRelations = structuredClone(sportEvent.sportClubs);
    for (const sportClubRelation of sportEventFromDB?.sportClubs || []) {
      const index = newSportClubRelations.findIndex(item => item.sportClub.id === sportClubRelation.sportClub.id);
      if (index >= 0) {
        // item still exists -> update
        if (sportClubRelation.host !== newSportClubRelations[index].host) {
          const sportClubRelationUpdate = await this.databaseModel.updateSportEventSportClubRelationTable({ sportEvent: sportEventFromDB.id, sportClub: sportClubRelation.sportClub.id }, { host: newSportClubRelations[index].host })
          if (!this.databaseModel.evaluateSuccess(sportClubRelationUpdate)) {
            return false;
          }
        }
        newSportClubRelations.splice(index, 1);
      } else {
        // item was removed -> delete
        const deleteSportClubRelation = await this.databaseModel.deleteSportEventSportClubRelationTable({sportEvent: sportEventFromDB.id, sportClub: sportClubRelation.sportClub.id});
        if (!this.databaseModel.evaluateSuccess(deleteSportClubRelation)) {
          return false;
        }
      }
    }

    // add new sport club relations

    for (const sportClubRelation of newSportClubRelations) {
      const addSportClubRelation = await this.databaseModel.addSportEventSportClubRelationTable({
        sportEvent: sportEventFromDB.id,
        sportClub: sportClubRelation.sportClub.id,
        host: sportClubRelation.host
      });
      if (!this.databaseModel.evaluateSuccess(addSportClubRelation)) {
        return false;
      }
    }

    // update sport matches

    let newSportMatchRelations = structuredClone(sportEvent.sportMatch);
    for (const dbSportMatch of sportEventFromDB?.sportMatch || []) {
      const index = newSportMatchRelations.findIndex(item => item.id === dbSportMatch.id);
      if (index >= 0) {
        // item still exists -> update
        const newSportMatch = newSportMatchRelations[index];
        
        // update sport match
        if (dbSportMatch.description !== newSportMatch.description) {
          const updateSportMatch = await this.databaseModel.updateSportMatchTable({id: dbSportMatch.id}, { description: newSportMatch.description });
          if (!this.databaseModel.evaluateSuccess(updateSportMatch)) {
            return false;
          }
        }

        // update sport match user relations
        const newSportTeams = structuredClone(newSportMatch.sportTeam);
        for (const dbSportTeam of dbSportMatch.sportTeam) {
          const index = newSportTeams.findIndex(item => item.teamNumber === dbSportTeam.teamNumber);
          if (index >= 0) {
            // teamNumber still exists -> update users
            const newSportTeam = newSportTeams[index];
            const newUsers = structuredClone(newSportTeam.user);
            for (const dbUser of dbSportTeam.user) {
              const index = newUsers.findIndex(item => item.id === dbUser.id);
              if (index >= 0) {
                // user still exists -> do nothing (user is already in the sport match)
                newUsers.splice(index, 1);
              } else {
                // user was removed -> delete
                const deleteSportMatchUserRelation = await this.databaseModel.deleteSportMatchUserRelationTable({ sportMatch: dbSportMatch.id, user: dbUser.id });
                if (!this.databaseModel.evaluateSuccess(deleteSportMatchUserRelation)) {
                  return false;
                }
              }
            }

            // add new user
            for (const newUser of newUsers) {
              const addSportMatchUserRelation = await this.databaseModel.addSportMatchUserRelationTable({ 
                sportMatch: dbSportMatch.id, 
                user: newUser.id ,
                teamNumber: newSportTeam.teamNumber,
              });
              if (!this.databaseModel.evaluateSuccess(addSportMatchUserRelation)) {
                return false;
              }
            }
            newSportTeams.splice(index, 1);
          } else {
            // team was removed -> delete
            const deleteSportMatchUserRelation = await this.databaseModel.deleteSportMatchUserRelationTable({sportMatch: dbSportMatch.id, teamNumber: dbSportTeam.teamNumber});
            if (!this.databaseModel.evaluateSuccess(deleteSportMatchUserRelation)) {
              return false;
            }
          }
        }

        // update sport match sets
        const newSportMatchSets = structuredClone(newSportMatch.sportMatchSet);
        for (const dbSportMatchSet of dbSportMatch.sportMatchSet) {
          const index = newSportMatchSets.findIndex(item => item.id === dbSportMatchSet.id);
          if (index >= 0) {
            // set still exists -> update
            const newSportMatchSet = newSportMatchSets[index];
            if (dbSportMatchSet.setNumber !== newSportMatchSet.setNumber) {
              const updateSportMatchSet = await this.databaseModel.updateSportMatchSetTable({id: dbSportMatchSet.id}, { setNumber: newSportMatchSet.setNumber });
              if (!this.databaseModel.evaluateSuccess(updateSportMatchSet)) {
                return false;
              }
            }

            // update sport match set scores
            const newSportMatchSetScores = structuredClone(newSportMatchSet.sportScore);
            for (const dbSportMatchSetScore of dbSportMatchSet.sportScore) {
              const index = newSportMatchSetScores.findIndex(item => item.teamNumber === dbSportMatchSetScore.teamNumber);
              if (index >= 0) {
                // score still exists -> update
                if (dbSportMatchSetScore.score !== newSportMatchSetScores[index].score) {
                  const updateSportMatchSetScore = await this.databaseModel.updateSportSetScoreTable(
                    { sportMatchSet: dbSportMatchSet.id, teamNumber: dbSportMatchSetScore.teamNumber}, 
                    { score: newSportMatchSetScores[index].score });
                  if (!this.databaseModel.evaluateSuccess(updateSportMatchSetScore)) {
                    return false;
                  }
                }
                newSportMatchSetScores.splice(index, 1);
              } else {
                // score was removed -> delete
                const deleteSportMatchSetScore = await this.databaseModel.deleteSportSetScoreTable({sportMatchSet: dbSportMatchSet.id, teamNumber: dbSportMatchSetScore.teamNumber});
                if (!this.databaseModel.evaluateSuccess(deleteSportMatchSetScore)) {
                  return false;
                }
              }
            }

            // add new sport match set scores
            for (const newSportMatchSetScore of newSportMatchSetScores) {
              const addSportMatchSetScore = await this.databaseModel.addSportSetScoreTable({ 
                sportMatchSet: dbSportMatchSet.id, 
                teamNumber: newSportMatchSetScore.teamNumber,
                score: newSportMatchSetScore.score,
              });
              if (!this.databaseModel.evaluateSuccess(addSportMatchSetScore)) {
                return false;
              }
            }

            newSportMatchSets.splice(index, 1);
          } else {
            // set was removed -> delete
            // delete sport match set scores
            const deleteSportMatchSetScore = await this.databaseModel.deleteSportSetScoreTable({sportMatchSet: dbSportMatchSet.id});
            if (!this.databaseModel.evaluateSuccess(deleteSportMatchSetScore)) {
              return false;
            }
            // delete sport match set
            const deleteSportMatchSet = await this.databaseModel.deleteSportMatchSetTable({id: dbSportMatchSet.id});
            if (!this.databaseModel.evaluateSuccess(deleteSportMatchSet)) {
              return false;
            }
          }
        }
        
        // add new sport match sets
        for (const newSportMatchSet of newSportMatchSets) {
          const addSportMatchSet = await this.databaseModel.addSportMatchSetTable({ 
            sportMatch: dbSportMatch.id, 
            setNumber: newSportMatchSet.setNumber,
          });
          if (!this.databaseModel.evaluateSuccess(addSportMatchSet)) {
            return false;
          }

          const sportMatchSetId = this.databaseModel.getSportMatchSetFromResponse(addSportMatchSet)[0].id;

          // add sport match set scores
          for (const newSportMatchSetScore of newSportMatchSet.sportScore) {
            const addSportMatchSetScore = await this.databaseModel.addSportSetScoreTable({ 
              sportMatchSet: sportMatchSetId, 
              teamNumber: newSportMatchSetScore.teamNumber,
              score: newSportMatchSetScore.score,
            });
            if (!this.databaseModel.evaluateSuccess(addSportMatchSetScore)) {
              return false;
            }
          }
        }

        newSportMatchRelations.splice(index, 1);
      } else {
        // item was removed -> delete

        // delete sport match user relations
        const deleteSportMatchUserRelations = await this.databaseModel.deleteSportMatchUserRelationTable({sportMatch: dbSportMatch.id});

        if (!this.databaseModel.evaluateSuccess(deleteSportMatchUserRelations)) {
          return false;
        }
        
        // delete sport match sets
        for (const sportMatchSet of dbSportMatch.sportMatchSet) {
          // delete sport match set score
          const deleteSportMatchSetScores = await this.databaseModel.deleteSportSetScoreTable({sportMatchSet: sportMatchSet.id});

          if (!this.databaseModel.evaluateSuccess(deleteSportMatchSetScores)) {
            return false;
          }
        }
        const deleteSportMatchSets = await this.databaseModel.deleteSportMatchSetTable({sportMatch: dbSportMatch.id});

        if (!this.databaseModel.evaluateSuccess(deleteSportMatchSets)) {
          return false;
        }

        const deleteSportMatch = await this.databaseModel.deleteSportMatchTable({id: dbSportMatch.id});

        if (!this.databaseModel.evaluateSuccess(deleteSportMatch)) {
          return false;
        }
      }
    }

    // add new sport match relations

    for (const sportMatchRelation of newSportMatchRelations) {
      // add sport match
      const addSportMatch = await this.databaseModel.addSportMatchTable({
        description: sportMatchRelation.description,
        sportEvent: sportEventFromDB.id,
      })

      if (!this.databaseModel.evaluateSuccess(addSportMatch)) {
        return false;
      }

      const sportMatchId = this.databaseModel.getSportMatchFromResponse(addSportMatch)[0].id;

      // add sport match user relations
      for (const sportTeam of sportMatchRelation.sportTeam) {
        for (const user of sportTeam.user) {
          const addSportMatchUserRelation = await this.databaseModel.addSportMatchUserRelationTable({
            sportMatch: sportMatchId,
            user: user.id,
            teamNumber: sportTeam.teamNumber,
          })

          if (!this.databaseModel.evaluateSuccess(addSportMatchUserRelation)) {
            return false;
          }
        }
      }

      // add sport match sets
      for (const sportMatchSet of sportMatchRelation.sportMatchSet) {
        const addSportMatchSet = await this.databaseModel.addSportMatchSetTable({
          sportMatch: sportMatchId,
          setNumber: sportMatchSet.setNumber,
        })

        if (!this.databaseModel.evaluateSuccess(addSportMatchSet)) {
          return false;
        }

        const sportMatchSetId = this.databaseModel.getSportMatchSetFromResponse(addSportMatchSet)[0].id;

        // add sport match set score
        for (const sportSetScore of sportMatchSet.sportScore) {
          const addSportMatchSetScore = await this.databaseModel.addSportSetScoreTable({
            sportMatchSet: sportMatchSetId,
            teamNumber: sportSetScore.teamNumber,
            score: sportSetScore.score,
          })

          if (!this.databaseModel.evaluateSuccess(addSportMatchSetScore)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  async handleGetAllSports(token: string): Promise<ISport[]> {
    if (this.isTokenValid(token)) {
      return this.databaseModel.getSportsFromResponse(await this.databaseModel.selectSportTable({}));
    }
    return [];
  }

  async handleGetAllSportEventTypes(token: string): Promise<ISportEventType[]> {
    if (this.isTokenValid(token)) {
      return this.databaseModel.getSportEventTypesFromResponse(await this.databaseModel.selectSportEventTypeTable({}));
    }
    return [];
  }

  async handleGetAllSportLocations(token: string): Promise<ISportLocation[]> {
    if (this.isTokenValid(token)) {
      return this.databaseModel.getSportLocationsFromResponse(await this.databaseModel.selectSportLocationTable({}));
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