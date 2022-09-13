// User:

import { AccessLevel } from "../enums/accessLevel";

export interface IUser {
  /** 
   * user.id=0 -> broadcast
   * user.id=1 -> system
   * user.id=2 -> admin (master-account)
   */
  id: number;
  name: string;
  password: string;
  accessLevel: AccessLevel;
  email: string;
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