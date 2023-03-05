import React, { Component } from "react";
import styles from "./SportMatchItem.module.css";
import { ISportMatch } from '../../../../interfaces/database'
import { PWPAuthContext } from "../../../PWPAuthProvider/PWPAuthProvider";
import { SportMatchItemEdit } from "../../../SportMatchItemEdit/SportMatchItemEdit";
import { ClickableIcon } from "../../../ClickableIcon/ClickableIcon";
import { ConfirmPopUp } from "../../../ConfirmPopUp/ConfirmPopUp";
import { getWinnerTeamNumber } from "../../../../shared/getWinnerTeamNumber";
import { PWPLanguageContext } from "../../../PWPLanguageProvider/PWPLanguageProvider";
import { SportMatchEditMenu } from "./EditMenu/SportMatchEditMenu";

export interface SportMatchItemState {
  winnerTeamNumber: number[]; // index = teamNumber; value = number of sets won
  edit: boolean;
  confirmDelete: boolean;
}

export interface SportMatchItemProps {
  sportMatch: ISportMatch;
  onChange: (sportMatch: ISportMatch) => void;
  onDelete: () => void;
  isCreator?: boolean;
}

export class SportMatchItem extends Component<SportMatchItemProps, SportMatchItemState> {
  constructor(props) {
    super(props);
    this.state = {
      winnerTeamNumber: undefined,
      edit: false,
      confirmDelete: false,
    }
  }

  static contextType = PWPAuthContext

  componentDidMount(): void {
    this.setState({ winnerTeamNumber: getWinnerTeamNumber(this.props.sportMatch?.sportMatchSet) })
  }

  componentDidUpdate(prevProps: Readonly<SportMatchItemProps>, prevState: Readonly<SportMatchItemState>, snapshot?: any): void {
    if (prevProps.sportMatch !== this.props.sportMatch) {
      this.setState({ winnerTeamNumber: getWinnerTeamNumber(this.props.sportMatch.sportMatchSet) })
    }
  }

  render() {
    if (this.props.sportMatch !== undefined) {
      return (
        <PWPLanguageContext.Consumer>
          { LanguageContext => (
            <div className={styles.wrapper}>
              <div className={`${styles.elementWrapper} ${this.state.edit && styles.editWrapper}`}>
                <table>
                  <thead>
                    <tr>
                      <td></td>
                      <td colSpan={this.props.sportMatch?.sportMatchSet?.length}>{LanguageContext.t("sport:Result")}</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.sportMatch.sportTeam.sort((a, b) => a.teamNumber > b.teamNumber ? 1 : -1).map((sportTeam, sportTeamIndex) => {
                        return (
                          <tr key={"sportTeam" + sportTeamIndex}>
                            <td style={ this.state.winnerTeamNumber && (this.state.winnerTeamNumber[sportTeam.teamNumber] === Math.max(...this.state.winnerTeamNumber)) ? {} : { color: "var(--color-text-off)"} }>
                              {
                                sportTeam.user?.map((user, userIndex) => {
                                  return (
                                    <React.Fragment key={"user" + userIndex}>
                                      {
                                        userIndex !== 0 && 
                                        <>
                                        &nbsp;/
                                        <br />
                                        </>
                                      }
                                      <span className={this.context.user?.id === user.id ? styles.isUser : ""}>
                                        {
                                          (!user.firstName || user.firstName === "" && !user.lastName || user.lastName === "") ?
                                          <>
                                            { user.username }
                                          </>
                                          :
                                          <>
                                            { user.firstName }
                                            &nbsp;
                                            { user.lastName }
                                          </>
                                        }
                                      </span>
                                    </React.Fragment>
                                  )
                                })
                              }
                            </td>
                            {
                              this.props.sportMatch.sportMatchSet.sort((a, b) => a.setNumber > b.setNumber ? 1 : -1).map((sportMatchSet, sportMatchSetIndex) => {
                                return (
                                  <td key={"sportMatchSet" + sportMatchSetIndex} style={ sportMatchSet.sportScore?.reduce((a, b) => a.score > b.score ? a : b).teamNumber === sportTeam.teamNumber ? { color: "red" } : {}}>
                                    {
                                      sportMatchSet.sportScore?.find((item) => item.teamNumber === sportTeam.teamNumber)?.score
                                    }
                                  </td>
                                )
                              })
                            }
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                <div className={styles.info}>
                  <p>
                    {this.props.sportMatch.description}
                  </p>
                  {
                    this.props.isCreator &&
                      <div className={styles.buttonGroup}>
                        {
                          !this.state.edit &&
                          <ClickableIcon 
                            iconName="Edit"
                            onClick={() => {
                              this.setState({ edit: true })
                            }}
                          />
                        }
                        <ClickableIcon
                          iconName="Delete"
                          onClick={() => {
                            this.setState({ confirmDelete: true })
                          }}
                        />
                        {
                          this.state.confirmDelete &&
                          <ConfirmPopUp 
                            title={LanguageContext.t("sport:DeleteSportMatch")}
                            message={LanguageContext.t("sport:DeleteSportMatchMessage")}
                            onConfirm={() => {
                              this.props.onDelete();
                              this.setState({ confirmDelete: false });
                            }}
                            onCancel={() => {
                              this.setState({ confirmDelete: false });
                            }}
                          />
                        }
                      </div>
                  }
                </div>
              </div>
              <SportMatchEditMenu 
                sportMatch={this.props.sportMatch}
                hidden={!this.state.edit}
                onChange={(sportMatch) => {
                  this.props.onChange(sportMatch);
                }}
                onClose={() => {
                  this.setState({ edit: false })
                }}
              />
            </div>
          )}
        </PWPLanguageContext.Consumer>
      );
    } else {
      return (
        <PWPLanguageContext.Consumer>
          { LanguageContext => (
            <div>
              <p>
                { LanguageContext.t("sport:NoSportEventMatch")}
              </p>
            </div>
          )}
        </PWPLanguageContext.Consumer>
      );
    }
  }
}