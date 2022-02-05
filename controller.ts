import jwt from 'jsonwebtoken'
/**
 * This is the controller of Profile-WebPage
 */
export class WebPageController {
  public static userTokenName: string = "pwp.auth.token";
  constructor() {

  }

  /**
   * This method checks the username for current username requirements
   * @param {string} username username to validate with requirements
   * @returns {Promise<boolean>} True if requirements are met, false if not
   */
  public static isUsernameValid = async (username: string): Promise<boolean> => {
    let response = await fetch('./api/users/is_username_valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method checks the password for current password requirements
   * @param {string} password password to validate with requirements
   * @returns {Promise<boolean>} True if requirements are met, false if not
   */
  public static isPasswordValid = async (password: string): Promise<boolean> => {
    let response = await fetch('./api/users/is_password_valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: password
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method checks whether a given user exists in the database
   * @param {number, string} user name or id to check
   * @returns {Promise<boolean>} True if user exists, else false
   */
  public static doesUserExist = async (user: {id?: number, name?: string}): Promise<boolean> => {
    let response = await fetch('./api/users/does_exist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID: user.id,
        username: user.name
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method returns the current authentication token
   * @returns {string} token of the currently logged in user
   */
  public static getUserToken = (): string => {
    let token = localStorage.getItem(this.userTokenName);
    if (token !== null) {
      return token;
    }
    return "";
  }

  /**
   * This method extracts the usernem from the token and returns it.
   * @param {string} token Token with user information
   * @returns {string} Username if token contains username, else empty string
   */
  public static getUserFromToken = (token: string): string => {
    let content = jwt.decode(token)
    if (typeof content === "object" && content !== null) {
      return content.username
    }
    return ""
  }

  /**
   * This method checks whether the given token has a valid signature and user
   * @param {string} token token to be verified
   * @returns {Promise<boolean>} true if signature is valid and user exists, false if not
   */
  public static verifyUserByToken = async (token: string): Promise<boolean> => {
    // request backend for validation
    let response = await fetch('./api/users/verify_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method logs a user in if there is a match with the database. Therfore a token is created which is stored in the browsers local storage.
   * @param {string} username Username to log in
   * @param {string} password Password for user
   * @returns {Promise<boolean>} True if login was successfull, false if not
   */
  public static loginUser = async (username: string, password: string): Promise<boolean> => {
    let response = await fetch('./api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });
    let data = await response.json();
    console.log(data.userToken)
    if (data.userToken === "") {
      localStorage.removeItem("pwp.auth.token")
      return false;
    }

    localStorage.setItem("pwp.auth.token", data.userToken)

    return true;
  }

  /**
   * This method registers a user to the database
   * @param {string} username the username of the user to be created
   * @param {string} password the password of the user to be created
   * @returns {Promise<boolean>} true if registration was successfull, false if not
   */
  public static registerUser = async (username: string, password: string): Promise<boolean> => {
    let response = await fetch('./api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });
    let data = await response.json();
    if (data.wasSuccessfull) {
      await WebPageController.loginUser(username, password);
    }
    return data.wasSuccessfull;
  }

  /**
   * This mehtod loggs out the current user.
   * @returns {boolean} True if logout was successfull, false if not
   */
  public static logoutUser = (): boolean => {
    localStorage.removeItem("pwp.auth.token")
    return true;
  }
}

export default new WebPageController();