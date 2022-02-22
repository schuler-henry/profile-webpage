import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { isUsernameValid, isPasswordValid } from './users/requirements';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { IUser } from '../../interfaces';

export class SupabaseConnection {
  private static CLIENT: SupabaseClient;
  private static KEY: string;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    SupabaseConnection.CLIENT = createClient(supabaseUrl, supabaseAnonKey);
    SupabaseConnection.KEY = "Krasser Schlüssel";
  }

  /**
   * Function to hash a password
   * @param {string} password password to hash
   * @returns {Promise<string>} hashed password
   */
  private hashPassword = async (password: string): Promise<string> => {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);    
    return hashedPassword
  }

  /**
   * Function to check plain text with hash
   * @param {string} clearPassword password as plain text
   * @param {string} hashedpassword password as hash from db
   * @returns {Promise<boolean>} true if password and hash match, flase if not
   */
  private checkPassword = async (clearPassword: string, hashedpassword: string): Promise<boolean> => {
    return await bcrypt.compare(clearPassword, hashedpassword);
  }

  /** 
   * API function to check if the username/userID and the password are correct 
   * @param {string} username the username to check
   * @param {number} userID the userID to check
   * @param {string} password the password to check
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the username and password are correct
   */
  public isUserValid = async (user: {id?: number, name?: string, password: string}): Promise<boolean> => {
    let supabaseData: any;
    let supabaseError: any;

    if (user.id !== undefined) {
      // check if user is valid with the userID

      // fetch the data from the supabase database
      const { data, error } = await SupabaseConnection.CLIENT
        .from('User')
        .select()
        .eq('UserID', user.id);
      
      supabaseData = data;
      supabaseError = error;

    } else if (user.name !== undefined) {
      // check if user is valid with the username

      // fetch the data from the supabase database
      const { data, error } = await SupabaseConnection.CLIENT
        .from('User')
        .select()
        .eq('Username', user.name);

      supabaseData = data;
      supabaseError = error;

    } else {
      return false;
    }

    // check if data was received
    if (supabaseData === null || supabaseError !== null || supabaseData.length === 0) {

      // no users found -> user does not exist or password is wrong -> return false
      return false;
    } else {
      // user exists
      // console.log(supabaseData[0].Password)
      // console.log(supabaseData)

      return this.checkPassword(user.password, supabaseData[0].Password);
    }
  };

  /**
   * API function to check if the user exists
   * @param {number, string} user User to check
   * @returns {Promise<boolean>} True if user exists, false if not
   */
  public doesUserExist = async (user: {id?: number, name?: string}): Promise<boolean> => {
    let supabaseData: any;
    let supabaseError: any;

    if (user.id !== undefined) {
      // check if user is valid with the userID

      // fetch the data from the supabase database
      const { data, error } = await SupabaseConnection.CLIENT
        .from('User')
        .select()
        .eq('UserID', user.id);
      
      supabaseData = data;
      supabaseError = error;

    } else if (user.name !== undefined) {
      // check if user is valid with the username

      // fetch the data from the supabase database
      const { data, error } = await SupabaseConnection.CLIENT
        .from('User')
        .select()
        .eq('Username', user.name);

      supabaseData = data;
      supabaseError = error;

    } else {
      return false;
    }

    // check if data was received
    if (supabaseData === null || supabaseError !== null || supabaseData.length === 0) {
      // no user found -> return false
      return false;
    } else {
      // user exists -> return true
      return true;
    }
  }

  /**
   * This method validates a given token with the current key.
   * @param {string} token Token to validate
   * @returns {boolean} True if the token is valid, false if not
   */
  public isTokenValid = (token: string): boolean => {
    try {
      jwt.verify(token, SupabaseConnection.KEY);
      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  /**
   * This method extracts the username from a token
   * @param {string} token Token to extract username from
   * @returns {string} Username if token contains username, empty string if not
   */
  public getUsernameFromToken = (token: string): string => {
    try {
      let data = jwt.decode(token);
      if (typeof data === "object" && data !== null) {
        return data.username
      }
    } catch (error) {
      
    }
    return "";
  }

  /**
   * This method returns a filled IUser object for the given User.
   * @param {string} token Token to get IUser object from
   * @returns {Promise<IUser>} IUser object of username, empty IUser if token invalid
   */
  public getIUserFromToken = async (token: string): Promise<IUser> => {
    let returnUser: IUser = {};
    if (this.isTokenValid(token)) {
      const { data, error } = await SupabaseConnection.CLIENT
        .from('User')
        .select()
        .eq('Username', this.getUsernameFromToken(token));

      if (data === null || error !== null || data.length === 0) {
        return returnUser;
      }
      returnUser.id = data[0].UserID;
      returnUser.name = data[0].Username;
      returnUser.hashedPassword = data[0].Password;
      returnUser.accessLevel = data[0].AccessLevel;
      return returnUser;
    }
    return returnUser;
  }

  /**
   * This method checks whether a given token is valid and contains an existing user
   * @param {string} token Token with user credentials
   * @returns {boolean} True if token contains a valid user, false if not
   */
  public isUserTokenValid = async (token: string): Promise<boolean> => {
    if (this.isTokenValid(token)) {
      if (await this.doesUserExist({name: this.getUsernameFromToken(token)})) {
        // console.log("user exists")
        return true;
      }
    }
    return false;
  }

  /**
   * This method logs in a user if the given credentials are valid.
   * @param {string | string} user User credentials to log in (name + password)
   * @returns {string} Signed token with username if login was successfull, empty string if not
   */
  public loginUser = async (user: {name: string, password: string}): Promise<string> => {
    if (await this.isUserValid({name: user.name, password: user.password})) {
      let token = jwt.sign({
        username: user.name,
      }, SupabaseConnection.KEY, {expiresIn: '1 day'});
      return token;
    }
    return "";
  }

  /**
   * API function to register a user
   * @param user user to register with name and password
   * @returns {Promise<boolean>} true if registration was successfull, false if not
   */
  public registerUser = async (user: {name: string, password: string}): Promise<boolean> => {

    let userExists = await this.doesUserExist({name: user.name});

    if (!isUsernameValid(user.name) || !isPasswordValid(user.password) || userExists) {
      return false;
    }

    // hash password
    let hashedPassword = await this.hashPassword(user.password);

    const { data, error } = await SupabaseConnection.CLIENT
      .from('User')
      .insert([
        { Username: user.name, Password: hashedPassword },
      ]);

    if (data === null || error !== null || data.length === 0) {
      return false;
    }
    return true;
  }
}