// User:

import { AccessLevel } from "./enums/accessLevel";

export interface User {
  /** 
   * user.id=0 -> broadcast
   * user.id=1 -> system
   * user.id=2 -> admin (master-account)
   */
  id: number;
  name: string;
  password: string;
  accessLevel: AccessLevel;
}