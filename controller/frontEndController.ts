import jwt from 'jsonwebtoken'
import { ColorTheme } from '../enums/colorTheme';
import { ITimer, IUser } from '../interfaces';
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
   * This method logs a user in if there is a match with the database. Therfore a token is created which is stored in the browsers local storage.
   */
  static async loginUser(username: string, password: string): Promise<boolean> {
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

    const data = await response.json();

    if (data.userToken === "") {
      localStorage.removeItem(this.userTokenName);
      return false;
    }
    localStorage.setItem(this.userTokenName, data.userToken);
    return true;
  }

  /**
   * This method registers a user to the database
   */
  static async registerUser(username: string, password: string): Promise<boolean> {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });

    const data = await response.json();
    if (data.wasSuccessful) {
      await FrontEndController.loginUser(username, password);
    }

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
   * This method logs out the current user.
   */
  static logoutUser(): boolean {
    localStorage.removeItem(this.userTokenName);
    return true;
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
    console.log("hlalo")
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
}