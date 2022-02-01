/**
 * This is the controller of Profile-WebPage
 */
export class WebPageController {
  public data: any;
  constructor() {
    this.initialize()
  }

  /**
   * This method is used to initialize the controller
   */
  public async initialize() {

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
   * This method checks whether the given credentials have a match in the database
   * @param {string} username the username of the user to be checked
   * @param {string} password the password of the user to be checked
   * @returns {Promise<boolean>} true if the user is valid, false if the user is not valid
   */
  public static verifyUser = async (username: string, password: string): Promise<boolean> => {
    // request backend for validation
    let response = await fetch('./api/users/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method registers a user to the database
   * @param {string} username the username of the user to be created
   * @param {string} password the password of the user to be created
   * @param {string} confirmPassword confirming the password
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
    return data.wasSuccessfull;
  }
}

export default new WebPageController();