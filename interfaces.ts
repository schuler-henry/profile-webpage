// User:

export interface IUser {
  /** 
   * user.id=0 -> broadcast
   * user.id=1 -> system
   * user.id=2 -> admin (master-account)
   */
  id?: number;
  name?: string;
  hashedPassword?: string;
  accessLevel?: number;
}