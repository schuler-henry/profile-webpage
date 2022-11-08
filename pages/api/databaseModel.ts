// @ts-check
import { createClient, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js'
import { AccessLevel } from '../../enums/accessLevel';
import { ISport, ISportClub, ISportClubMembership, ISportClubMembershipSport, ISportEvent, ISportEventType, ISportLocation, ITimer, IUser } from '../../interfaces/database'

/**
 * DataBase Model to Connect BackendController with Supabase DB
 * @category API
 */
export class DatabaseModel {
  //#region Variables
  private static CLIENT: SupabaseClient;
  //#endregion

  //#region Constructor
  constructor() {
    const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    DatabaseModel.CLIENT = createClient(supabaseUrl, supabaseAnonKey);
  }

  //#endregion

  //#region Universal Methods

  /**
   * Checks if DB-Response is successful and at least one row is returned
   */
  evaluateSuccess(dbResponse: PostgrestResponse<any>): boolean {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      console.log(dbResponse.error)
      return false;
    }
    return true;
  }

  //#endregion

  //#region User Methods

  /**
   * This method extracts user object from db response
   */
  getUserFromResponse(dbResponse: PostgrestResponse<IUser>): IUser[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allUsers: IUser[] = [];

    for (const user of dbResponse.data) {
      allUsers.push({ id: user.id, username: user.username, password: user.password, accessLevel: user.accessLevel, firstName: user.firstName, lastName: user.lastName, email: user.email, unconfirmedEmail: user.unconfirmedEmail, activationCode: user.activationCode, active: user.active, sportClubMembership: [] })
      if (user.sportClubMembership) {
        for (const membership of user.sportClubMembership) {
          allUsers[allUsers.length - 1].sportClubMembership.push({ id: membership.id, user: membership.user, sportClub: membership.sportClub, membershipSport: [] })
          for (const sport of membership?.membershipSport) {
            allUsers[allUsers.length - 1].sportClubMembership[allUsers[allUsers.length - 1].sportClubMembership.length - 1].membershipSport.push({ sport: {id: sport.sport.id, name: sport.sport.name}, memberStatus: sport.memberStatus, approved: sport.approved })
          }
        }
      }
    }
    return allUsers;
  }

  /**
   * This is a universal select function for the user database
   */
  async selectUserTable(user: {userID?: number, username?: string, password?: string, accessLevel?: AccessLevel, firstName?: string, lastName?: string, email?: string, unconfirmedEmail?: string, activationCode?: string, active?: boolean}): Promise<PostgrestResponse<IUser>> {
    let idColumnName = "";
    let usernameColumnName = "";
    let passwordColumnName = "";
    let accessLevelColumnName = "";
    let firstNameColumnName = "";
    let lastNameColumnName = "";
    let emailColumnName = "";
    let unconfirmedEmailColumnName = "";
    let activationCodeColumnName = "";
    let activeColumnName = "";

    if (!(user.userID === undefined) && !isNaN(user.userID)) idColumnName = "id";
    if (!(user.username === undefined)) usernameColumnName = "username";
    if (!(user.password === undefined)) passwordColumnName = "password";
    if (!(user.accessLevel === undefined) && !isNaN(user.accessLevel)) accessLevelColumnName = "accessLevel";
    if (!(user.firstName === undefined)) firstNameColumnName = "firstName";
    if (!(user.lastName === undefined)) lastNameColumnName = "lastName";
    if (!(user.email === undefined)) emailColumnName = "email";
    if (!(user.unconfirmedEmail === undefined)) unconfirmedEmailColumnName = "unconfirmedEmail";
    if (!(user.activationCode === undefined)) activationCodeColumnName = "activationCode";
    if (!(user.active === undefined)) activeColumnName = "active";

    const userResponse = await DatabaseModel.CLIENT
      .from('User')
      .select(`
        id,
        username,
        password,
        accessLevel,
        firstName,
        lastName,
        email,
        unconfirmedEmail,
        activationCode,
        active,
        sportClubMembership:SportClubMembership(
          id,
          user,
          sportClub(
            id,
            name,
            address,
            sport:Sport(*),
            sportLocation:SportLocation(*)
          ),
          membershipSport:SportClubMembership_Sport_Relation(
            memberStatus,
            approved,
            sport:Sport(*)
          )
        )
      `)
      .eq(idColumnName, user.userID)
      .eq(usernameColumnName, user.username)
      .eq(passwordColumnName, user.password)
      .eq(accessLevelColumnName, user.accessLevel)
      .eq(firstNameColumnName, user.firstName)
      .eq(lastNameColumnName, user.lastName)
      .eq(emailColumnName, user.email?.toLowerCase())
      .eq(unconfirmedEmailColumnName, user.unconfirmedEmail?.toLowerCase())
      .eq(activationCodeColumnName, user.activationCode)
      .eq(activeColumnName, user.active);

    return userResponse;
  }

  /**
   * This method adds a user to the db
   */
  async addUser(username: string, hashedPassword: string, email: string, activationCode: string): Promise<PostgrestResponse<IUser>> {
    const addedUser = await DatabaseModel.CLIENT
      .from('User')
      .insert([
        { username: username, password: hashedPassword, accessLevel: AccessLevel.USER, unconfirmedEmail: email?.toLowerCase(), activationCode: activationCode, active: false },
      ]);

    return addedUser;
  }

  /**
   * This method is used to update a user
   * @param user updated user object
   */
  async updateUser(user: IUser): Promise<PostgrestResponse<IUser>> {
    const updatedUser = await DatabaseModel.CLIENT
      .from('User')
      .update({ username: user.username, password: user.password, accessLevel: user.accessLevel, firstName: user.firstName, lastName: user.lastName, email: user.email?.toLowerCase() || null, unconfirmedEmail: user.unconfirmedEmail?.toLowerCase() || null, activationCode: user.activationCode, active: user.active })
      .eq('id', user.id);

    return updatedUser;
  }

  /**
   * This method removes a target user from the database (currently not available due to constraints with sportEvents)
   */
  async deleteUser(targetUserID: number): Promise<PostgrestResponse<IUser>> {
    const deletedUser = await DatabaseModel.CLIENT
      .from('User')
      .delete()
      .match({ 'id': targetUserID });

    return deletedUser;
  }

  //#endregion

  //#region Timer Methods

  getTimersFromResponse(dbResponse: PostgrestResponse<ITimer>): ITimer[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allTimers: ITimer[] = [];

    for (const timer of dbResponse.data) {
      allTimers.push({ id: timer.id, user: timer.user, name: timer.name, elapsedSeconds: timer.elapsedSeconds, startTime: timer.startTime })
    }
    return allTimers;
  }

  async selectTimerTable(userID: number): Promise<PostgrestResponse<ITimer>> {
    const timerResponse = await DatabaseModel.CLIENT
      .from('Timer')
      .select()
      .eq('user', userID);

    return timerResponse;
  }

  async addTimer(timer: ITimer): Promise<PostgrestResponse<ITimer>> {
    const addedTimer = await DatabaseModel.CLIENT
      .from('Timer')
      .insert([
        { user: timer.user.id, name: timer.name, elapsedSeconds: timer.elapsedSeconds, startTime: timer.startTime },
      ]);

    return addedTimer;
  }

  async deleteTimer(timerID: number, userID: number): Promise<PostgrestResponse<ITimer>> {
    const deletedTimer = await DatabaseModel.CLIENT
      .from('Timer')
      .delete()
      .match({ 'id': timerID, 'user': userID });
      
    return deletedTimer;
  }

  async updateTimer(userID: number, timer: ITimer): Promise<PostgrestResponse<ITimer>> {
    const updatedTimer = await DatabaseModel.CLIENT
      .from('Timer')
      .update({ name: timer.name, elapsedSeconds: timer.elapsedSeconds, startTime: timer.startTime })
      .eq('user', userID)
      .eq('id', timer.id);

    return updatedTimer;
  }

  //#endregion

  //#region Sport Methods

  getSportClubsFromResponse(dbResponse: PostgrestResponse<ISportClub>): ISportClub[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      console.log(dbResponse.error)
      return [];
    }

    const allSportClubs: ISportClub[] = [];

    for (const sportClub of dbResponse.data) {
      allSportClubs.push({ id: sportClub.id, name: sportClub.name, address: sportClub.address, sport: sportClub.sport || [], sportLocation: sportClub.sportLocation || [], sportClubMembership: sportClub.sportClubMembership || [] })
    }
    return allSportClubs;
  }

  getSportsFromResponse(dbResponse: PostgrestResponse<ISport>): ISport[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allSports: ISport[] = [];

    for (const sport of dbResponse.data) {
      allSports.push({ id: sport.id, name: sport.name })
    }
    return allSports;
  }

  getSportEventTypesFromResponse(dbResponse: PostgrestResponse<ISportEventType>): ISportEventType[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allSportEventTypes: ISportEventType[] = [];

    for (const sportEventType of dbResponse.data) {
      allSportEventTypes.push({ id: sportEventType.id, name: sportEventType.name })
    }
    return allSportEventTypes;
  }

  getSportClubMembershipFromResponse(dbResponse: PostgrestResponse<ISportClubMembership>): ISportClubMembership[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      console.log(dbResponse.error)
      return [];
    }

    const allSportClubMemberships: ISportClubMembership[] = [];

    for (const sportClubMembership of dbResponse.data) {
      allSportClubMemberships.push({ id: sportClubMembership.id, user: sportClubMembership.user, sportClub: sportClubMembership.sportClub, membershipSport: sportClubMembership.membershipSport })
    }
    return allSportClubMemberships;
  }

  getSportClubMembershipSportFromResponse(dbResponse: PostgrestResponse<ISportClubMembershipSport>): ISportClubMembershipSport[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      // console.log(dbResponse.error)
      return [];
    }

    const allSportClubMembershipSports: ISportClubMembershipSport[] = [];

    for (const sportClubMembershipSport of dbResponse.data) {
      allSportClubMembershipSports.push({ sport: sportClubMembershipSport.sport, memberStatus: sportClubMembershipSport.memberStatus, approved: sportClubMembershipSport.approved })
    }
    return allSportClubMembershipSports;
  }

  async getSportEventsFromResponse(dbResponse: PostgrestResponse<ISportEvent>): Promise<ISportEvent[]> {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      console.log(dbResponse.error)
      return [];
    }

    const allSportEvents: ISportEvent[] = [];

    for (const sportEvent of dbResponse.data) {
      allSportEvents.push({ id: sportEvent.id, description: sportEvent.description, startTime: sportEvent.startTime, endTime: sportEvent.endTime, visibility: sportEvent.visibility, creator: undefined, sport: undefined, sportClubs: undefined, sportEventType: undefined, sportMatch: undefined, sportLocation: undefined })
      if (sportEvent.creator) {
        allSportEvents[allSportEvents.length - 1].creator = { id: sportEvent.creator.id, username: sportEvent.creator.username, password: sportEvent.creator.password, accessLevel: sportEvent.creator.accessLevel, firstName: sportEvent.creator.firstName, lastName: sportEvent.creator.lastName, email: sportEvent.creator.email, unconfirmedEmail: sportEvent.creator.unconfirmedEmail, activationCode: sportEvent.creator.activationCode, active: sportEvent.creator.active, sportClubMembership: sportEvent.creator.sportClubMembership }
      }
      if (sportEvent.sport) {
        allSportEvents[allSportEvents.length - 1].sport = { id: sportEvent.sport.id, name: sportEvent.sport.name }
      }
      if (sportEvent.sportLocation) {
        allSportEvents[allSportEvents.length - 1].sportLocation = { id: sportEvent.sportLocation.id, name: sportEvent.sportLocation.name, address: sportEvent.sportLocation.address }
      }
      if (sportEvent.sportEventType) {
        allSportEvents[allSportEvents.length - 1].sportEventType = { id: sportEvent.sportEventType.id, name: sportEvent.sportEventType.name }
      }
      if (sportEvent.sportClubs) {
        allSportEvents[allSportEvents.length - 1].sportClubs = []
        for (const sportClubs of sportEvent.sportClubs) {
          allSportEvents[allSportEvents.length - 1].sportClubs.push({ host: sportClubs.host, sportClub: undefined })
          if (sportClubs.sportClub) {
            allSportEvents[allSportEvents.length - 1].sportClubs[allSportEvents[allSportEvents.length - 1].sportClubs.length - 1].sportClub = { id: sportClubs.sportClub.id, name: sportClubs.sportClub.name, address: sportClubs.sportClub.address, sport: sportClubs.sportClub.sport, sportLocation: sportClubs.sportClub.sportLocation, sportClubMembership: sportClubs.sportClub.sportClubMembership }
          }
        }
      }
      if (sportEvent.sportMatch) {
        const sportEventIndex = allSportEvents.length - 1;
        allSportEvents[sportEventIndex].sportMatch = []
        for (const sportMatch of sportEvent.sportMatch) {
          allSportEvents[sportEventIndex].sportMatch.push({ id: sportMatch.id, description: sportMatch.description, sportTeam: undefined, sportMatchSet: undefined })
          if (sportMatch.sportTeam) {
            const sportMatchIndex = allSportEvents[sportEventIndex].sportMatch.length - 1;
            allSportEvents[sportEventIndex].sportMatch[sportMatchIndex].sportTeam = []
            for (const sportTeam of sportMatch.sportTeam) {
              allSportEvents[sportEventIndex].sportMatch[sportMatchIndex].sportTeam.push({ teamNumber: sportTeam.teamNumber, user: undefined })
              const sportTeamIndex = allSportEvents[sportEventIndex].sportMatch[sportMatchIndex].sportTeam.length - 1;
              allSportEvents[sportEventIndex].sportMatch[sportMatchIndex].sportTeam[sportTeamIndex].user = []
              // fetch users separately because supabase caches the subquery -> every team has the same users
              for (const user of this.getUserFromResponse(await this.selectSportTeamUsers(sportMatch.id, sportTeam.teamNumber)) ) {
                allSportEvents[sportEventIndex].sportMatch[sportMatchIndex].sportTeam[sportTeamIndex].user.push({ id: user.id, username: user.username, password: user.password, accessLevel: user.accessLevel, firstName: user.firstName, lastName: user.lastName, email: user.email, unconfirmedEmail: user.unconfirmedEmail, activationCode: user.activationCode, active: user.active, sportClubMembership: user.sportClubMembership })
              }
            }
          }
          if (sportMatch.sportMatchSet) {
            const sportMatchIndex = allSportEvents[sportEventIndex].sportMatch.length - 1;
            allSportEvents[sportEventIndex].sportMatch[sportMatchIndex].sportMatchSet = []
            for (const sportMatchSet of sportMatch.sportMatchSet) {
              allSportEvents[sportEventIndex].sportMatch[sportMatchIndex].sportMatchSet.push({ id: sportMatchSet.id, setNumber: sportMatchSet.setNumber, sportScore: undefined })
              if (sportMatchSet.sportScore) {
                const sportMatchSetIndex = allSportEvents[sportEventIndex].sportMatch[sportMatchIndex].sportMatchSet.length - 1;
                allSportEvents[sportEventIndex].sportMatch[sportMatchIndex].sportMatchSet[sportMatchSetIndex].sportScore = []
                for (const sportScore of sportMatchSet.sportScore) {
                  allSportEvents[sportEventIndex].sportMatch[sportMatchIndex].sportMatchSet[sportMatchSetIndex].sportScore.push({ teamNumber: sportScore.teamNumber, score: sportScore.score })
                }
              }
            }
          }
        }
      }
    }
    return allSportEvents;
  }

  async selectSportClubTable(sportClub: {id?: number, name?: string, address?: string, sport?: ISport[], sportLocation?: ISportLocation[]}): Promise<PostgrestResponse<ISportClub>> {
    let idColumnName = "";
    let nameColumnName = "";
    let addressColumnName = "";
    let sportColumnName = "";
    let sportLocationColumnName = "";
    
    if (!(sportClub.id === undefined)) idColumnName = "id";
    if (!(sportClub.name === undefined)) nameColumnName = "name";
    if (!(sportClub.address === undefined)) addressColumnName = "address";
    if (!(sportClub.sport === undefined)) sportColumnName = "sport";
    if (!(sportClub.sportLocation === undefined)) sportLocationColumnName = "sportLocation";

    const sportClubResponse = await DatabaseModel.CLIENT
      .from('SportClub')
      .select(`
        id,
        name,
        address,
        sport:Sport(*),
        sportLocation:SportLocation(*)
      `)
      .eq(idColumnName, sportClub.id)
      .eq(nameColumnName, sportClub.name)
      .eq(addressColumnName, sportClub.address)
      .eq(sportColumnName, sportClub.sport)
      .eq(sportLocationColumnName, sportClub.sportLocation);

    return sportClubResponse;
  }

  async selectSportClubMembershipTable(sportClubMembership: {id?: number, user?: number, sportClub?: number}): Promise<PostgrestResponse<ISportClubMembership>> {
    let idColumnName = "";
    let userColumnName = "";
    let sportClubColumnName = "";
    
    if (!(sportClubMembership.id === undefined)) idColumnName = "id";
    if (!(sportClubMembership.user === undefined)) userColumnName = "user";
    if (!(sportClubMembership.sportClub === undefined)) sportClubColumnName = "sportClub";

    const sportClubMembershipResponse = await DatabaseModel.CLIENT
      .from('SportClubMembership')
      .select()
      .eq(idColumnName, sportClubMembership.id)
      .eq(userColumnName, sportClubMembership.user)
      .eq(sportClubColumnName, sportClubMembership.sportClub);

    return sportClubMembershipResponse;
  }

  async selectSportClubMembershipTableComplete(sportClubMembership: {id?: number, userID?: number, sportClubID?: number, sportID?: number[]}): Promise<PostgrestResponse<ISportClubMembership>> {
    let idColumnName = "";
    let userColumnName = "";
    let sportClubColumnName = "";
    let sportColumnName = "";
    
    if (!(sportClubMembership.id === undefined)) idColumnName = "id";
    if (!(sportClubMembership.userID === undefined)) userColumnName = "user.id";
    if (!(sportClubMembership.sportClubID === undefined)) sportClubColumnName = "sportClub";
    if (!(sportClubMembership.sportID === undefined)) sportColumnName = "membershipSport.sport.id";

    const sportClubMembershipResponse = await DatabaseModel.CLIENT
      .from('SportClubMembership')
      .select(`
        id,
        user:User(
          id,
          username,
          firstName,
          lastName,
          email
        ),
        sportClub,
        membershipSport:SportClubMembership_Sport_Relation(
          memberStatus,
          approved,
          sport:Sport(*)
        )
      `)
      .eq(idColumnName, sportClubMembership.id)
      .eq(userColumnName, sportClubMembership.userID)
      .eq(sportClubColumnName, sportClubMembership.sportClubID)
      .in(sportColumnName, sportClubMembership.sportID);

    return sportClubMembershipResponse;
  }

  async selectSportTable(sport: {id?: number, name?: string}): Promise<PostgrestResponse<ISport>> {
    let idColumnName = "";
    let nameColumnName = "";
    
    if (!(sport.id === undefined)) idColumnName = "id";
    if (!(sport.name === undefined)) nameColumnName = "name";

    const sportResponse = await DatabaseModel.CLIENT
      .from('Sport')
      .select()
      .eq(idColumnName, sport.id)
      .eq(nameColumnName, sport.name);

    return sportResponse;
  }

  async selectSportEventTypeTable(sportEventType: {id?: number, name?: string}): Promise<PostgrestResponse<ISportEventType>> {
    let idColumnName = "";
    let nameColumnName = "";

    if (!(sportEventType.id === undefined)) idColumnName = "id";
    if (!(sportEventType.name === undefined)) nameColumnName = "name";

    const sportEventTypeResponse = await DatabaseModel.CLIENT
      .from('SportEventType')
      .select()
      .eq(idColumnName, sportEventType.id)
      .eq(nameColumnName, sportEventType.name);

    return sportEventTypeResponse;
  }

  async selectSportClubMembershipSportRelationTable(sportClubMembershipSport: {sportClubMembership?: number, sport?: number, memberStatus?: number, approved?: boolean}): Promise<PostgrestResponse<ISportClubMembershipSport>> {
    let sportClubMembershipColumnName = "";
    let sportColumnName = "";
    let memberStatusColumnName = "";
    let approvedColumnName = "";
    
    if (!(sportClubMembershipSport.sportClubMembership === undefined)) sportClubMembershipColumnName = "sportClubMembership";
    if (!(sportClubMembershipSport.sport === undefined)) sportColumnName = "sport";
    if (!(sportClubMembershipSport.memberStatus === undefined)) memberStatusColumnName = "memberStatus";
    if (!(sportClubMembershipSport.approved === undefined)) approvedColumnName = "approved";

    const sportClubMembershipSportResponse = await DatabaseModel.CLIENT
      .from('SportClubMembership_Sport_Relation')
      .select(`
        sport:Sport(*),
        memberStatus,
        approved
      `)
      .eq(sportClubMembershipColumnName, sportClubMembershipSport.sportClubMembership)
      .eq(sportColumnName, sportClubMembershipSport.sport)
      .eq(memberStatusColumnName, sportClubMembershipSport.memberStatus)
      .eq(approvedColumnName, sportClubMembershipSport.approved);

    return sportClubMembershipSportResponse;
  }

  async addSportClubMembership(sportClubMembership: {user: number, sportClub: number}): Promise<PostgrestResponse<ISportClubMembership>> {
    const addedSportClubMembership = await DatabaseModel.CLIENT
      .from('SportClubMembership')
      .insert([
        { user: sportClubMembership.user, sportClub: sportClubMembership.sportClub },
      ]);

    return addedSportClubMembership;
  }

  async deleteSportClubMembership(sportClubMembership: {id?: number, user?: number, sportClub?: number}): Promise<PostgrestResponse<ISportClubMembership>> {
    let idColumnName = "";
    let userColumnName = "";
    let sportClubColumnName = "";

    if (!(sportClubMembership.id === undefined)) idColumnName = "id";
    if (!(sportClubMembership.user === undefined)) userColumnName = "user";
    if (!(sportClubMembership.sportClub === undefined)) sportClubColumnName = "sportClub";

    const deletedSportClubMembership = await DatabaseModel.CLIENT
      .from('SportClubMembership')
      .delete()
      .eq(idColumnName, sportClubMembership.id)
      .eq(userColumnName, sportClubMembership.user)
      .eq(sportClubColumnName, sportClubMembership.sportClub);
      
    return deletedSportClubMembership;
  }

  async addSportClubMembershipSport(sportClubMembershipSport: {sportClubMembership?: number, sport?: number, approved?: boolean}): Promise<PostgrestResponse<ISportClubMembershipSport>> {
    const addedSportClubMembershipSport = await DatabaseModel.CLIENT
      .from('SportClubMembership_Sport_Relation')
      .insert([
        { sportClubMembership: sportClubMembershipSport.sportClubMembership, memberStatus: 0, approved: sportClubMembershipSport.approved || false, sport: sportClubMembershipSport.sport },
      ]);

    return addedSportClubMembershipSport;
  }

  async deleteSportClubMembershipSport(sportClubMembershipSport: {sportClubMembership?: number, sport?: number, memberStatus?: number, approved?: boolean}): Promise<PostgrestResponse<ISportClubMembershipSport>> {
    let sportClubMembershipColumnName = "";
    let sportColumnName = "";
    let memberStatusColumnName = "";
    let approvedColumnName = "";

    if (!(sportClubMembershipSport.sportClubMembership === undefined)) sportClubMembershipColumnName = "sportClubMembership";
    if (!(sportClubMembershipSport.sport === undefined)) sportColumnName = "sport";
    if (!(sportClubMembershipSport.memberStatus === undefined)) memberStatusColumnName = "memberStatus";
    if (!(sportClubMembershipSport.approved === undefined)) approvedColumnName = "approved";
    
    const deletedSportClubMembershipSport = await DatabaseModel.CLIENT
      .from('SportClubMembership_Sport_Relation')
      .delete()
      .eq(sportClubMembershipColumnName, sportClubMembershipSport.sportClubMembership)
      .eq(sportColumnName, sportClubMembershipSport.sport)
      .eq(memberStatusColumnName, sportClubMembershipSport.memberStatus)
      .eq(approvedColumnName, sportClubMembershipSport.approved);

    return deletedSportClubMembershipSport;
  }

  async selectSportClubMembershipTableAdmin(sportClubID: number, sportID: number[]) {
    const matches = await DatabaseModel.CLIENT
      .rpc('get_admin_memberships', { sportClubID: sportClubID, sportID: sportID });

    return matches;
  }

  async updateSportClubMembershipSportRelation(sportClubMembership: number, sport: number, newMemberStatus: number, newApproved: boolean): Promise<PostgrestResponse<ISportClubMembershipSport>> {
    const updatedSportClubMembershipSport = await DatabaseModel.CLIENT
      .from('SportClubMembership_Sport_Relation')
      .update({ memberStatus: newMemberStatus, approved: newApproved })
      .eq("sportClubMembership", sportClubMembership)
      .eq("sport", sport)
    
    return updatedSportClubMembershipSport;
  }

  async getUsersWithoutMembershipSport(sportClubID: number, sportID: number) {
    const matches = await DatabaseModel.CLIENT
      .rpc('get_users_without_membership_sport', { sportClubID: sportClubID, sportID: sportID });

    return matches;
  }

  async selectSportEventTable(): Promise<PostgrestResponse<ISportEvent>> {
    const sportEventResponse = await DatabaseModel.CLIENT
      .rpc('get_sport_events', {  });

    return sportEventResponse;
  }

  async selectSportTeamUsers(sportMatchId: number, sportTeamNumber: number): Promise<PostgrestResponse<IUser>> {
    const sportTeamUsers = await DatabaseModel.CLIENT
      .rpc('get_sport_team_users', { sportMatchId: sportMatchId, sportTeamNumber: sportTeamNumber });

    return sportTeamUsers;
  }

  //#endregion
}