import jwt from 'jsonwebtoken'
import { ColorTheme } from '../enums/colorTheme';
import { GitHubProject, ISport, ISportClub, ISportClubMembership, ISportEvent, ISportEventType, ISportLocation, ITimer, IUser } from '../interfaces/database';
import { GitHubUser, Repository } from '../interfaces/Github';

/**
 * This is the Frontend Controller of PersonalWebPage
 * @category Controller
 */
export class FrontEndController {
  static userTokenName = "pwp.auth.token";
  static themeName = "pwp.theme.token";

  //#region User Methods

  /**
   * This method triggers a localStorage event which triggers app.tsx to fetch user data
   */
  static async updateLoginStatus(): Promise<void> {
    var loginEvent = document.createEvent('StorageEvent');
    loginEvent.initStorageEvent('storage', false, false, FrontEndController.userTokenName, null, null, null, localStorage);
    dispatchEvent(loginEvent);
    // return promise that turns true if event is registered
    return new Promise((resolve, reject) => {
      window.addEventListener("userContextChanged", () => {
        resolve();
      }, { once: true });
    });
  }

  /**
   * This method checks whether a given email exists in the database
   */
  static async doesEmailExist(email: string): Promise<boolean> {  
    const response = await fetch('/api/users/does_email_exist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: email 
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  /**
   * This method checks whether a given user exists in the database
   */
  static async doesUserExist(username: string): Promise<boolean> {
    const response = await fetch('/api/users/does_exist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  /**
   * This method returns a filled User object for the given user.
   */
  static async getUserFromToken(token: string): Promise<IUser> {
    const response = await fetch('/api/users/get_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
      })
    });

    const data = await response.json();
    return data.user;
  }

  /**
   * This method checks the password for current password requirements
   */
  static async isPasswordValid(password: string): Promise<boolean> {
    const response = await fetch('/api/users/is_password_valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: password
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  /**
   * This method checks the email for current email requirements
   */
  static async isEmailValid(email: string): Promise<boolean> {
    const response = await fetch('/api/users/is_email_valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  /**
   * This method checks the username for current username requirements
   */
  static async isUsernameValid(username: string): Promise<boolean> {
    const response = await fetch('/api/users/is_username_valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  /**
   * This method logs a user in if there is a match with the database. Therefore a token is created which is stored in the browsers local storage.
   */
  static async loginUser(username: string, password: string): Promise<string> {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });

    localStorage.removeItem(this.userTokenName);

    const data = await response.json();

    return data.userToken;
  }

  /**
   * This method registers a user to the database
   */
  static async registerUser(username: string, password: string, email: string): Promise<boolean> {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      })
    });

    const data = await response.json();

    return data.wasSuccessful;
  }

  /**
   * This method activated a user
   */
  static async activateUser(username: string, activationCode: string): Promise<boolean> {
    const response = await fetch('/api/users/activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        activationCode: activationCode,
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  /**
   * This method changes the password of the current user
   */
  static async changePassword(userToken: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const response = await fetch('/api/users/change_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  /**
   * This method updates a user profile in the database
   * username, first and last name
   */
  static async updateUserProfile(userToken: string, newUser: IUser): Promise<boolean> {
    const response = await fetch('/api/users/update_user_profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        newUser: newUser
      })
    });

    await this.renewToken();

    const data = await response.json();

    return data.wasSuccessful;
  }

  /**
   * This method adds a new email to the user (needs to be activated afterwards)
   */
  static async updateUserEmail(userToken: string, newEmail: string): Promise<boolean> {
    const response = await fetch('/api/users/update_user_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        newEmail: newEmail
      })
    });

    const data = await response.json();

    return data.wasSuccessful;
  }

  /**
   * This method adds a new sport club membership to the user (needs to be approved by sport club manager afterwards)
   */
  static async addSportClubMembership(userToken: string, sportClubMembership: ISportClubMembership): Promise<boolean> {
    const response = await fetch('/api/users/add_sportclub_membership', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        sportClubMembership: sportClubMembership
      })
    });

    const data = await response.json();

    this.updateLoginStatus();

    return data.wasSuccessful;
  }

  /**
   * This method removes a sport club membership from the user
   */
  static async deleteSportClubMembership(userToken: string, sportClubMembership: ISportClubMembership): Promise<boolean> {
    const response = await fetch('/api/users/delete_sportclub_membership', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        sportClubMembership: sportClubMembership
      })
    });

    const data = await response.json();

    this.updateLoginStatus();

    return data.wasSuccessful;
  }

  /**
   * This method checks whether the given token has a valid signature and user
   */
  static async verifyUserByToken(token: string): Promise<boolean> {
    const response = await fetch('/api/users/verify_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
      })
    });

    const data = await response.json();

    return data.wasSuccessful;
  }

  /**
   * This method renews the current user token and updates the username inside.
   */
  static async renewToken(): Promise<void> {
    const response = await fetch('/api/users/renew_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: this.getUserToken(),
      })
    });

    const data = await response.json();

    localStorage.removeItem(this.userTokenName);
    localStorage.setItem(this.userTokenName, data.userToken);
    this.updateLoginStatus();
  }

  /**
   * This method logs out the current user.
   */
  static logoutUser(): boolean {
    localStorage.removeItem(this.userTokenName);
    this.updateLoginStatus();
    return true;
  }

  static async getAllUsers(userToken: string): Promise<IUser[]> {
    const response = await fetch('/api/users/get_all_users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
      })
    });

    const data = await response.json();
    return data.users;
  }

  static async findUsers(userToken: string, searchString: string): Promise<IUser[]> {
    const response = await fetch('/api/users/find_users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        searchString: searchString
      })
    });

    const data = await response.json();
    return data.users;
  }

  static async getActivationCode(userToken: string, userID: number): Promise<string> {
    const response = await fetch('/api/users/get_activation_code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        userID: userID
      })
    });

    const data = await response.json();
    return data.activationCode;
  }

  //#endregion

  //#region Token Methods

  /**
   * This method returns the current authentication token
   */
  static getUserToken(): string {
    const token = localStorage.getItem(this.userTokenName);
    if (token !== null) {
      return token;
    }
    return "";
  }

  /**
   * This method extracts the username from the token and returns it.
   */
  static getUsernameFromToken(token: string): string {
    const content = jwt.decode(token);
    if (typeof content === "object" && content !== null) {
      return content.username;
    }
    return "";
  }

  //#endregion

  static setTheme(theme: ColorTheme) {
    localStorage.setItem(this.themeName, JSON.stringify({theme: theme}));
  }

  static getTheme(): ColorTheme {
    const jsonTheme = localStorage.getItem(this.themeName);
    try {
      const theme = JSON.parse(jsonTheme).theme
      return theme
    } catch (error) {
      return ColorTheme.darkTheme;
    }
  }

  //#region File Methods

  static async getFileContent(filePath: string, fileName: string): Promise<string> {
    const response = await fetch('/api/files/getFileContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filePath: filePath,
        fileName: fileName,
      })
    });

    const data = await response.json();
    // console.log(data.content)
    return data.content;
  }

  static async getFileFromDatabase(bucketID: string, filePath: string): Promise<string> {
    const response = await fetch('/api/files/get_file_from_bucket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bucketID: bucketID,
        filePath: filePath,
      })
    });

    const data = await response.json();

    return data.content;
  }

  static async getFileURLFromDatabase(bucketID: string, filePath: string): Promise<string> {
    const response = await fetch('/api/files/getFileUrlFromBucket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bucketID: bucketID,
        filePath: filePath,
      })
    });

    const data = await response.json();
    // console.log(data)
    return data.url;
  }

  //#endregion

  //#region Summaries Methods

  static async getAllSummaries(): Promise<string[]> {
    const response = await fetch('/api/files/get_all_summaries', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();

    return data.summaries;
  }

  //#endregion

  //#region GitHubProjects Methods

  static async getGitHubProjects(): Promise<GitHubProject[]> {
    const response = await fetch('/api/projects/get_all_projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();

    return data.projects;
  }
  
  //#endregion

  //#region Github API

  static async getRepoInformation(user: string, repoName: string): Promise<Repository> {
    const response = await fetch(`https://api.github.com/repos/${user}/${repoName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json();
    return data;
  }

  static async getRepoSubItem(user: string, repoName: string, subItem: string): Promise<GitHubUser[]> {
    const response = await fetch(`https://api.github.com/repos/${user}/${repoName}/${subItem}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json();
    return data;
  }

  //#endregion

  //#region Timer Functions

  static async getTimers(token: string): Promise<ITimer[]> {
    const response = await fetch('/api/timers/get_timers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
      })
    });

    const data = await response.json();
    return data.timers;
  }

  static async addTimer(token: string, name: string): Promise<boolean> {
    const response = await fetch('/api/timers/add_timer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        name: name
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  static async deleteTimer(token: string, timerId: number): Promise<boolean> {
    const response = await fetch('/api/timers/delete_timer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        timerId: timerId
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  static async updateTimer(token: string, timer: ITimer): Promise<boolean> {
    const response = await fetch('/api/timers/update_timer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        timer: timer,
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  //#endregion

  //#region Sport Functions

  /**
   * This method returns all existing sport clubs
   */
  static async getSportClubs(token: string): Promise<ISportClub[]> {
    const response = await fetch('/api/sport/get_clubs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
      })
    });

    const data = await response.json();
    return data.clubs;
  }

  /**
   * This method returns all existing sport clubs where the given user has admin/trainer permission
   */
  static async getAdminSportClubs(token: string): Promise<ISportClub[]> {
    const response = await fetch('/api/sport/get_admin_clubs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
      })
    });

    const data = await response.json();
    // console.log(data.clubs)
    return data.clubs;
  }

  /**
   * This method accepts a sport club membership (user permission required)
   */
  static async acceptSportClubMembership(userToken: string, sportClubMembership: ISportClubMembership): Promise<boolean> {
    const response = await fetch('/api/sport/accept_sportclub_membership', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        sportClubMembership: sportClubMembership
      })
    });

    const data = await response.json();

    return data.wasSuccessful;
  }

  /**
   * This method deletes a sport club membership for a user (Trainer permission required)
   */
  static async deleteAdminSportClubMembership(userToken: string, sportClubMembership: ISportClubMembership): Promise<boolean> {
    const response = await fetch('/api/sport/delete_admin_sportclub_membership', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        sportClubMembership: sportClubMembership
      })
    });

    const data = await response.json();

    return data.wasSuccessful;
  }

  /**
   * This method returns all users that are not members of the given sport club sport (Trainer permission required)
   */
  static async getUsersWithoutSportClubMembershipSport(userToken: string, sportClubId: number, sportId: number): Promise<IUser[]> {
    const response = await fetch('/api/sport/get_users_without_sportclub_membership_sport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        sportClubId: sportClubId,
        sportId: sportId
      })
    });

    const data = await response.json();

    return data.users;
  }

  /**
   * This method adds a sport club membership for multiple users (Trainer permission required)
   */
  static async addAdminSportClubMemberships(userToken: string, sportClubId: number, sportId: number, users: IUser[]): Promise<boolean> {
    const response = await fetch('/api/sport/add_admin_sportclub_membership_for_users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        sportClubId: sportClubId,
        sportId: sportId,
        users: users
      })
    });

    const data = await response.json();

    return data.wasSuccessful;
  }

  /**
   * This method returns all sportEvents
   */
  static async getSportEvents(userToken: string): Promise<ISportEvent[]> {
    const response = await fetch('/api/sport/get_sport_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: userToken,
      })
    });

    const data = await response.json();
    // console.log(data)
    return data.sportEvent;
  }

  static async deleteSportEvent(userToken: string, sportEventId: number): Promise<boolean> {
    const response = await fetch('/api/sport/delete_sport_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: userToken,
        sportEventId: sportEventId
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  static async updateSportEvent(userToken: string, sportEvent: ISportEvent): Promise<boolean> {
    const response = await fetch('/api/sport/update_sport_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: userToken,
        sportEvent: sportEvent
      })
    });

    const data = await response.json();
    return data.wasSuccessful;
  }

  /**
   * This method returns all sports
   */
  static async getAllSports(userToken: string): Promise<ISport[]> {
    const response = await fetch('/api/sport/get_all_sports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: userToken,
      })
    });

    const data = await response.json();

    return data.sports;
  }

  /**
   * This method returns all sport event types from the database
   */
  static async getAllSportEventTypes(userToken: string): Promise<ISportEventType[]> {
    const response = await fetch('/api/sport/get_all_sport_event_types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: userToken,
      })
    });

    const data = await response.json();

    return data.sportEventTypes;
  }

  static async getAllSportLocations(userToken: string): Promise<ISportLocation[]> {
    const response = await fetch('/api/sport/get_all_sport_locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: userToken,
      })
    });

    const data = await response.json();

    return data.sportLocations;
  }

  //#endregion
}