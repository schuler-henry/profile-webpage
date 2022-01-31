import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { isUsernameValid, isPasswordValid } from './users/requirements';
import * as bcrypt from 'bcrypt';

export class SupabaseConnection {
  private static CLIENT: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    SupabaseConnection.CLIENT = createClient(supabaseUrl, supabaseAnonKey);
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
      return true;
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
   * 
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