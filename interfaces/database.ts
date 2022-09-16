// User:

import { AccessLevel } from "../enums/accessLevel";

export interface IUser {
  /** 
   * user.id=0 -> broadcast
   * user.id=1 -> system
   * user.id=2 -> admin (master-account)
   */
  id: number;
  username: string;
  password: string;
  accessLevel: AccessLevel;
  firstName: string;
  lastName: string;
  email: string;
  unconfirmedEmail: string;
  activationCode: string;
  active: boolean;
}

// Timer:

export interface ITimer {
  id: number;
  user: IUser;
  name: string;
  elapsedSeconds: number;
  startTime: Date;
}