// User:

import { AccessLevel } from "../enums/accessLevel";
import { SportEventVisibility } from "../enums/sportEventVisibility";

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
  sportClubMembership: ISportClubMembership[];
}

// Timer:

export interface ITimer {
  id: number;
  user: IUser;
  name: string;
  elapsedSeconds: number;
  startTime: Date;
}

// Sport:

export interface ISport {
  id: number;
  name: string;
}

export interface ISportClub {
  id: number;
  name: string;
  address: string;
  sport: ISport[];
  sportLocation: ISportLocation[];
  sportClubMembership: ISportClubMembership[];
}

export interface ISportClubMembership {
  id: number;
  user: number | IUser;
  sportClub: number | ISportClub;
  membershipSport: ISportClubMembershipSport[];
}

export interface ISportClubMembershipSport {
  memberStatus: number;
  approved: boolean;
  sport: ISport;
}

export interface ISportEvent {
  id: number;
  startTime: Date;
  endTime: Date;
  description: string;
  /**
   * 0: creator only
   * 1: creator and members
   * 2: creator, members and listet clubs (user must be part of that club's sport)
   * 3: creator, members and listet clubs (everyone from that club)
   * 4: everyone
   */
  visibility: SportEventVisibility;
  creator: IUser;
  sport: ISport;
  sportLocation: ISportLocation;
  sportEventType: ISportEventType;
  sportClubs: {sportClub: ISportClub, host: boolean}[];
  sportMatch: ISportMatch[];
}

export interface ISportEventType {
  id: number;
  name: string;
}

export interface ISportLocation {
  id: number;
  name: string;
  address: string;
}

export interface ISportMatch {
  id: number;
  description: string;
  sportTeam: ISportTeam[];
  sportMatchSet: ISportMatchSet[];
}

export interface ISportTeam {
  user: IUser[];
  teamNumber: number;
}

export interface ISportMatchSet {
  id: number;
  setNumber: number;
  sportScore: ISportScore[];
}

export interface ISportScore {
  teamNumber: number;
  score: number;
}