import React, { Component } from "react";
import styles from "./AdminSportClubSportUserList.module.css";
import { ISport, ISportClub, ISportClubMembership, ISportClubMembershipSport, IUser } from "../../interfaces/database";
import { ClickableIcon } from "../ClickableIcon/ClickableIcon";
import { FrontEndController } from "../../controller/frontEndController";
import { DropdownOption } from "../Dropdown/Dropdown";
import { WithTranslation } from "next-i18next";
import { ConfirmPopUp } from "../ConfirmPopUp/ConfirmPopUp";
import { IUserSelector } from "../IUserSelector/IUserSelector";
import { Icon } from "@fluentui/react";
import { getSportClubPositionText } from "../../shared/getSportClubPositionText";

export interface AdminSportClubSportUserListState {
  sortItem: DropdownOption;
  sortAscending: boolean;
  acceptMembershipItem: ISportClubMembership;
  deleteAdminMembershipItem: ISportClubMembership;
  addUser: {sportClubID: number, sportID: number, list: IUser[]};
  fetchData: boolean;
  success: boolean;
  displaySuccess: boolean;
  club: ISportClub;
}

export interface AdminSportClubSportUserListProps extends WithTranslation {
  club: ISportClub;
  sport: ISport;
}

export class AdminSportClubSportUserList extends Component<AdminSportClubSportUserListProps, AdminSportClubSportUserListState> {
  constructor(props) {
    super(props);
    this.state = {
      deleteAdminMembershipItem: undefined,
      sortAscending: true,
      acceptMembershipItem: undefined,
      addUser: undefined,
      sortItem: undefined,
      fetchData: false,
      success: false,
      displaySuccess: false,
      club: this.props.club,
    }
  }

  componentDidUpdate(prevProps: Readonly<AdminSportClubSportUserListProps>, prevState: Readonly<AdminSportClubSportUserListState>, snapshot?: any): void {
    if (this.props.club !== prevProps.club) {
      this.setState({ club: this.props.club });
    }
  }

  // This list contains all columns that are displayed in the table
  private sportClubAdminOrderByOptions: DropdownOption[] = [
    {key: "username", text: this.props.t('profile:Username')},
    {key: "firstName", text: this.props.t('profile:FirstName')},
    {key: "lastName", text: this.props.t('profile:LastName')},
    {key: "email", text: this.props.t('profile:Email')},
    {key: "position", text: this.props.t('profile:Position')},
    {key: "approved", text: this.props.t('profile:Approved')},
  ]

  /**
   * This method is used to sort the displayed table
   */
  private sportClubMembershipSorter = (value: DropdownOption, sport: ISport, ascending: boolean = true) => (a: ISportClubMembership, b: ISportClubMembership) => {
    // console.log(value, ascending, a, b)
    if (typeof a.user === "number" || typeof b.user === "number") {
      return 0; 
    }
    switch (value?.key) {
      case "username":
        return ascending ? a.user.username.localeCompare(b.user.username) : b.user.username.localeCompare(a.user.username);
      case "firstName":
        return ascending ? a.user.firstName.localeCompare(b.user.firstName) : b.user.firstName.localeCompare(a.user.firstName);
      case "lastName":
        return ascending ? a.user.lastName.localeCompare(b.user.lastName) : b.user.lastName.localeCompare(a.user.lastName);
      case "email":
        return ascending ? a.user.email.localeCompare(b.user.email) : b.user.email.localeCompare(a.user.email);
      case "position":
        const aMembershipSport = a.membershipSport.find((membershipSport: ISportClubMembershipSport) => membershipSport.sport.id === sport.id);
        const bMembershipSport = b.membershipSport.find((membershipSport: ISportClubMembershipSport) => membershipSport.sport.id === sport.id);
        return ascending ? bMembershipSport.memberStatus - aMembershipSport.memberStatus : aMembershipSport.memberStatus - bMembershipSport.memberStatus;
      case "approved":
        const aMembershipSportApproved = Number(a.membershipSport.find((membershipSport: ISportClubMembershipSport) => membershipSport.sport.id === sport.id).approved);
        const bMembershipSportApproved = Number(b.membershipSport.find((membershipSport: ISportClubMembershipSport) => membershipSport.sport.id === sport.id).approved);
        return ascending ? aMembershipSportApproved - bMembershipSportApproved : bMembershipSportApproved - aMembershipSportApproved;
      default:
        return 0;
    }
  }

  render() {
    return (
      this.state.club ? 
        <div>
          <h3>{this.props.sport.name}</h3>
          <div className={styles.sportClubMembershipTableWrapper} style={{ maxWidth: "max-content" }}>
            <table>
              <thead>
                <tr>
                  {
                    this.sportClubAdminOrderByOptions.map((option: DropdownOption, optionIndex) => {
                      return(
                        <th 
                          key={optionIndex.toString()}
                          onClick={() => {
                            if (this.state.sortItem?.key === option.key) {
                              this.setState({ sortAscending: !this.state.sortAscending })
                            } else {
                              this.setState({ sortItem: option, sortAscending: true })
                            }
                          }}
                        >
                          <span
                            style={{ display: "inline-flex", gap: "10px", alignItems: "center" }} 
                          >
                            <p>
                              {option.text}
                            </p>
                            {
                              this.state.sortItem?.key === option.key && 
                                (this.state.sortAscending ?
                                  <Icon 
                                    iconName="ChevronDown"
                                    style={{ fontSize: "14px", height: "14px", display: "flex"}}
                                  />
                                  :
                                  <Icon 
                                    iconName="ChevronUp"
                                    style={{ fontSize: "14px", height: "14px", display: "flex"}}
                                  />)
                            }
                          </span>
                        </th>
                      )
                    })
                  }
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.club.sportClubMembership
                    .filter((membership) => membership.membershipSport
                      .find((membershipSport) => membershipSport.sport.id === this.props.sport.id))
                    .sort(this.sportClubMembershipSorter(this.state.sortItem, this.props.sport, this.state.sortAscending))
                    .map((membership, membershipIndex) => {
                    
                      let membershipSport = membership.membershipSport.find((findSport) => findSport.sport.id === this.props.sport.id);
                    return(
                      <tr key={"membershipAdmin" + membershipIndex}>
                        <td>{typeof membership.user === "object" ? membership.user.username : "--"}</td>
                        <td>{typeof membership.user === "object" ? membership.user.firstName : "--"}</td>
                        <td>{typeof membership.user === "object" ? membership.user.lastName : "--"}</td>
                        <td>{typeof membership.user === "object" ? membership.user.email : "--"}</td>
                        <td style={{ color: "var(--color-text-secondary)" }}>{this.props.t('profile:' + getSportClubPositionText(membershipSport?.memberStatus))}</td>
                        <td style={{ color: membershipSport?.approved ? "var(--color-text-approved)" : "var(--color-text-warning)" }}>{membershipSport?.approved.toString() || "--"}</td>
                        <td>
                          <span style={{ display: "inline-flex", columnGap: "12px", justifyContent: "right", width: "100%" }}>
                            {
                              !membershipSport.approved &&
                                <ClickableIcon 
                                  iconName="Accept"
                                  buttonSize="30px" 
                                  fontSize="18px"
                                  onClick={() => {
                                    const acceptMembership = structuredClone(membership)
                                    acceptMembership.membershipSport = [structuredClone(membershipSport)]
                                    acceptMembership.sportClub = structuredClone(this.state.club)
                                    this.setState({ acceptMembershipItem: acceptMembership })
                                  }}
                                />
                            }
                            <ClickableIcon 
                              iconName="Trash" 
                              buttonSize="30px" 
                              fontSize="18px"
                              onClick={() => {
                                const deleteMembership = structuredClone(membership)
                                deleteMembership.membershipSport = [structuredClone(membershipSport)]
                                deleteMembership.sportClub = structuredClone(this.state.club)
                                this.setState({ deleteAdminMembershipItem: deleteMembership })
                              }}
                            />
                          </span>
                        </td>
                      </tr>
                    )
                  })
                }
                <tr>
                  <td colSpan={7}>
                    <div style={{ position: "sticky", left: "calc(50% - 16.5px)", right: "calc(50% - 16.5px)", width: "fit-content" }}>
                      <ClickableIcon 
                        iconName="Add"
                        onClick={async () => {
                          this.setState({ addUser: {sportClubID: this.state.club.id, sportID: this.props.sport.id, list: undefined}})
                          this.setState({ addUser: { sportClubID: this.state.club.id, sportID: this.props.sport.id, list: await FrontEndController.getUsersWithoutSportClubMembershipSport(FrontEndController.getUserToken(), this.state.club.id, this.props.sport.id)} })
                        }}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {
            (this.state.acceptMembershipItem) &&
            <ConfirmPopUp
              title={this.props.t('profile:AcceptMembership')}
              onConfirm={this.state.fetchData ? undefined : async () => {
                this.setState({ fetchData: true })
                this.setState({ success: await FrontEndController.acceptSportClubMembership(FrontEndController.getUserToken(), this.state.acceptMembershipItem), club: (await FrontEndController.getAdminSportClubs(FrontEndController.getUserToken())).find((club) => club.id === this.state.club.id), fetchData: false, displaySuccess: true, acceptMembershipItem: undefined })
              }}
              onCancel={this.state.fetchData ? undefined : () => {
                this.setState({ acceptMembershipItem: undefined })
              }}
              sync={this.state.fetchData}
            >
              <div className={`${styles.confirmWrapper} ${styles.sportClubMembershipTableWrapper}`}>
                <table style={{margin: "0 auto"}}>
                  <thead>
                    <tr>
                      <th>{this.props.t('profile:SportClub')}</th>
                      <th>{this.props.t('profile:Sport')}</th>
                      {
                        typeof this.state.acceptMembershipItem.user === "object" &&
                        <>
                          <th>{this.props.t('profile:Username')}</th>
                          <th>{this.props.t('profile:FirstName')}</th>
                          <th>{this.props.t('profile:LastName')}</th>
                          <th>{this.props.t('profile:Email')}</th>
                          <th>{this.props.t('profile:Position')}</th>
                        </>
                      }
                      <th>{this.props.t('profile:Approved')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.acceptMembershipItem.membershipSport.map((membershipSport: ISportClubMembershipSport, sportIndex) => {
                        return(
                          <tr key={"deleteSport" + sportIndex}>
                            <td>{typeof this.state.acceptMembershipItem.sportClub === "object" && this.state.acceptMembershipItem.sportClub.name}</td>
                            <td>{membershipSport.sport.name}</td>
                            {
                              typeof this.state.acceptMembershipItem.user === "object" &&
                              <>
                                <td>{this.state.acceptMembershipItem.user.username}</td>
                                <td>{this.state.acceptMembershipItem.user.firstName}</td>
                                <td>{this.state.acceptMembershipItem.user.lastName}</td>
                                <td>{this.state.acceptMembershipItem.user.email}</td>
                                <td style={{ color: "var(--color-text-secondary)" }}>{this.props.t('profile:' + getSportClubPositionText(membershipSport?.memberStatus))}</td>
                              </>
                            }
                            <td>
                              <span style={{ whiteSpace: "nowrap", wordBreak: "keep-all", display: "inline-flex" }}>
                                <p style={{ color: membershipSport.approved ? "var(--color-text-approved)" : "var(--color-text-warning)" }}>
                                  {membershipSport.approved.toString()}
                                </p>
                                &nbsp;&rarr;&nbsp;
                                <p style={{ color: "var(--color-text-approved)"}}>
                                  true
                                </p>
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </ConfirmPopUp>
          }
          {
            (this.state.deleteAdminMembershipItem) &&
            <ConfirmPopUp
              title={this.props.t('profile:DeleteMembership')}
              warning={this.props.t('profile:DeleteAdminMembershipWarning')}
              onConfirm={this.state.fetchData ? undefined : async () => {
                this.setState({ fetchData: true })
                this.setState({ success: await FrontEndController.deleteAdminSportClubMembership(FrontEndController.getUserToken(), this.state.deleteAdminMembershipItem), club: (await FrontEndController.getAdminSportClubs(FrontEndController.getUserToken())).find((club) => club.id === this.state.club.id), fetchData: false, displaySuccess: true, deleteAdminMembershipItem: undefined })
              }}
              onCancel={this.state.fetchData ? undefined : () => {
                this.setState({ deleteAdminMembershipItem: undefined })
              }}
              sync={this.state.fetchData}
            >
              <div className={`${styles.confirmWrapper} ${styles.sportClubMembershipTableWrapper}`}>
                <table style={{margin: "0 auto"}}>
                  <thead>
                    <tr>
                      <th>{this.props.t('profile:SportClub')}</th>
                      <th>{this.props.t('profile:Sport')}</th>
                      {
                        typeof this.state.deleteAdminMembershipItem.user === "object" &&
                        <>
                          <th>{this.props.t('profile:Username')}</th>
                          <th>{this.props.t('profile:FirstName')}</th>
                          <th>{this.props.t('profile:LastName')}</th>
                          <th>{this.props.t('profile:Email')}</th>
                          <th>{this.props.t('profile:Position')}</th>
                        </>
                      }
                      <th>{this.props.t('profile:Approved')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.deleteAdminMembershipItem.membershipSport.map((membershipSport: ISportClubMembershipSport, sportIndex) => {
                        return(
                          <tr key={"deleteSport" + sportIndex}>
                            <td>{typeof this.state.deleteAdminMembershipItem.sportClub === "object" && this.state.deleteAdminMembershipItem.sportClub.name}</td>
                            <td>{membershipSport.sport.name}</td>
                            {
                              typeof this.state.deleteAdminMembershipItem.user === "object" &&
                              <>
                                <td>{this.state.deleteAdminMembershipItem.user.username}</td>
                                <td>{this.state.deleteAdminMembershipItem.user.firstName}</td>
                                <td>{this.state.deleteAdminMembershipItem.user.lastName}</td>
                                <td>{this.state.deleteAdminMembershipItem.user.email}</td>
                                <td style={{ color: "var(--color-text-secondary)" }}>{this.props.t('profile:' + getSportClubPositionText(membershipSport?.memberStatus))}</td>
                              </>
                            }
                            <td style={{ color: membershipSport.approved ? "var(--color-text-approved)" : "var(--color-text-warning)" }}>
                              {membershipSport.approved.toString()}
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </ConfirmPopUp>
          }
          {
            this.state.addUser !== undefined &&
            <IUserSelector 
              userList={this.state.addUser?.list}
              onConfirm={async (userList) => {
                if (userList.length !== 0) {
                  this.setState({ fetchData: true })
                  this.setState({ success: await FrontEndController.addAdminSportClubMemberships(FrontEndController.getUserToken(), this.state.addUser.sportClubID, this.state.addUser.sportID, userList), club: (await FrontEndController.getAdminSportClubs(FrontEndController.getUserToken())).find((club) => club.id === this.state.club.id), fetchData: false, displaySuccess: true, addUser: undefined })
                } else {
                  this.setState({ addUser: undefined })
                }
              }}
              onCancel={() => this.setState({ addUser: undefined })}
              sync={this.state.fetchData}
            />
          }
          {
            this.state.displaySuccess &&
              <ConfirmPopUp
                title={this.state.success ? this.props.t('common:Success') : this.props.t('common:Error')}
                onConfirm={async () => {
                  this.setState({ displaySuccess: false })
                }}
              />
          }
        </div>
        :
        <></>
    );
  }
}