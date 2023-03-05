import React, { Component } from "react";
import styles from "./SportMatchItemEdit.module.css";
import { IUser, ISportMatch, ISportTeam, ISportMatchSet } from '../../interfaces/database'
import { PWPAuthContext } from "../PWPAuthProvider/PWPAuthProvider";
import { ClickableIcon } from "../ClickableIcon/ClickableIcon";
import { TagPicker } from "../TagPicker/TagPicker";
import { FrontEndController } from "../../controller/frontEndController";
import { Button } from "../Button/Button";
import { getWinnerTeamNumber } from "../../shared/getWinnerTeamNumber";
import { PWPLanguageContext } from "../PWPLanguageProvider/PWPLanguageProvider";

export interface SportMatchItemEditState {
  winnerTeamNumber: number[]; // index = teamNumber; value = number of sets won
  availableUsers: IUser[];
  sportMatch: ISportMatch;
}

export interface SportMatchItemEditProps {
  sportMatch: ISportMatch;
  onSave: (sportMatch: ISportMatch) => void;
}

export class SportMatchItemEdit extends Component<SportMatchItemEditProps, SportMatchItemEditState> {
  constructor(props: SportMatchItemEditProps) {
    super(props);
    this.state = {
      winnerTeamNumber: undefined,
      availableUsers: [],
      sportMatch: {
        id: undefined,
        description: "",
        sportTeam: [],
        sportMatchSet: [],
      }
    }
  }

  static contextType = PWPAuthContext

  async componentDidMount() {
    this.setState({ 
      winnerTeamNumber: getWinnerTeamNumber(this.state.sportMatch.sportMatchSet),
      availableUsers: await FrontEndController.getAllUsers(FrontEndController.getUserToken()),
      sportMatch: structuredClone(this.props.sportMatch) || this.state.sportMatch
    })
  }

  async componentDidUpdate(prevProps: Readonly<SportMatchItemEditProps>, prevState: Readonly<SportMatchItemEditState>, snapshot?: any) {
    if (prevState.sportMatch !== this.state.sportMatch) {
      this.setState({ 
        winnerTeamNumber: getWinnerTeamNumber(this.state.sportMatch.sportMatchSet),
      })
    }
  }

  render() {
    if (this.state.sportMatch !== undefined) {
      return (
        <PWPLanguageContext.Consumer>
          { LanguageContext => (
            <div className={styles.elementWrapper}>
              <div className={styles.previewWrapper}>
                <table>
                  <thead>
                    <tr>
                      <td></td>
                      <td colSpan={this.state.sportMatch.sportMatchSet.length}>{LanguageContext.t("sport:Result")}</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.sportMatch.sportTeam.sort((a, b) => a.teamNumber > b.teamNumber ? 1 : -1).map((sportTeam, sportTeamIndex) => {
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
                              this.state.sportMatch.sportMatchSet.sort((a, b) => a.setNumber > b.setNumber ? 1 : -1).map((sportMatchSet, sportMatchSetIndex) => {
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
                  {this.state.sportMatch.description}
                </div>
              </div>
              <div 
                className={styles.separator}
              />
              {
                this.state.sportMatch.sportTeam.sort((a, b) => a.teamNumber > b.teamNumber ? 1 : -1).map((sportTeam, sportTeamIndex) => {
                  return (
                    <div key={"sportTeam" + sportTeamIndex}>
                      <div className={styles.heading}>
                        <h2>{LanguageContext.t("sport:Team")} {sportTeam.teamNumber + 1}</h2>
                        <ClickableIcon 
                          iconName="Delete"
                          onClick={() => {
                            // delete sportTeam with teamNumber and sportScore with teamNumber
                            const sportMatch = structuredClone(this.state.sportMatch);
                            sportMatch.sportTeam = sportMatch.sportTeam.filter((item) => item.teamNumber !== sportTeam.teamNumber).reduce((returnValue: [], team) => returnValue.concat(Object.assign({ ...team, teamNumber: team.teamNumber > sportTeam.teamNumber ? team.teamNumber - 1 : team.teamNumber })), []);
                            if (sportMatch.sportTeam.length === 0) {
                              sportMatch.sportMatchSet = [];
                            } else {
                              sportMatch.sportMatchSet = sportMatch.sportMatchSet.reduce((returnValue: [], set) => returnValue.concat(Object.assign({ ...set, sportScore: set.sportScore.filter((item) => item.teamNumber !== sportTeam.teamNumber).reduce((returnValue: [], score) => returnValue.concat(Object.assign({ ...score, teamNumber: score.teamNumber > sportTeam.teamNumber ? score.teamNumber - 1 : score.teamNumber })), []) })), []);
                            }
                            this.setState({ sportMatch: sportMatch });
                          }}
                        />
                      </div>
                      <TagPicker 
                        options={
                          this.state.availableUsers.filter(
                            (user) => this.state.sportMatch.sportTeam.filter((sportTeam) => sportTeam.user.filter((sportTeamUser) => user.id === sportTeamUser.id).length !== 0).length === 0
                          ).reduce(
                            (returnValue: [], user: IUser) => returnValue.concat(Object.assign({ key: user.id.toString(), text: (user.firstName + " " + user.lastName + " (" + user.username + ")").trim() })), []
                          ) || []
                        }
                        selectedKeys={
                          sportTeam.user.reduce(
                            (returnValue: [], user: IUser) => returnValue.concat(Object.assign({ key: user.id.toString(), text: (user.firstName + " " + user.lastName + " (" + user.username + ")").trim() })), []
                          ) || []
                        }
                        onChange={(event, options) => {
                          sportTeam.user = options.map(option => this.state.availableUsers.find(user => user.id.toString() === option.key));
                          this.setState({ sportMatch: { ...this.state.sportMatch, sportTeam: [ ...this.state.sportMatch.sportTeam.reduce((returnValue: ISportTeam[], team: ISportTeam) => team.teamNumber === sportTeam.teamNumber ? returnValue : returnValue.concat(team), []), sportTeam ]} })
                        }}
                        contains
                      />
                    </div>
                  )
                })
              }
              <div className={styles.addTeamButton}>
                <Button
                  onClick={() => {
                    // iterate through this.state.sportMatch.sportTeam and get the next free number starting with 0
                    let nextSportTeamNumber = 0;
                    while (this.state.sportMatch.sportTeam.find((item) => item.teamNumber === nextSportTeamNumber)) {
                      nextSportTeamNumber++;
                    }
                    this.setState({ sportMatch: { ...this.state.sportMatch, sportTeam: [...this.state.sportMatch.sportTeam, { teamNumber: nextSportTeamNumber, user: [] }], sportMatchSet: [...this.state.sportMatch.sportMatchSet.map((sportMatchSet) => Object.assign({ ...sportMatchSet, sportScore: [ ...sportMatchSet.sportScore, { teamNumber: nextSportTeamNumber, score: 0 } ] }))] } })
                  }}
                >
                  {LanguageContext.t("sport:AddTeam")}
                </Button>
              </div>
              {
                this.state.sportMatch.sportTeam.length > 0 &&
                <>
                  <div className={styles.smallSeparator} />
                  <table className={styles.setTable}>
                    <thead>
                      <tr>
                        <td></td>
                        {
                          this.state.sportMatch.sportTeam.map((sportTeam, sportTeamIndex) => {
                            return (
                              <td key={sportTeamIndex.toString()}>
                                {LanguageContext.t("sport:Team")} {sportTeamIndex + 1}
                              </td>
                            )
                          })
                        }
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.sportMatch.sportMatchSet.sort((a, b) => a.setNumber > b.setNumber ? 1 : -1).map((sportMatchSet, sportMatchSetIndex) => {
                          return (
                            <tr key={sportMatchSetIndex.toString()}>
                              <td>
                                {LanguageContext.t("sport:Set")} {sportMatchSetIndex + 1}
                              </td>
                              {
                                sportMatchSet.sportScore?.sort((a, b) => a.teamNumber > b.teamNumber ? 1 : -1).map((sportScore, sportScoreIndex) => {
                                  return (
                                    <td key={sportScoreIndex.toString()}>
                                      <input 
                                        type="number" 
                                        value={sportScore.score === 0 ? "" : sportScore.score.toString()} 
                                        min="0"
                                        onChange={(event) => {
                                          sportScore.score = parseInt(event.target.value) || 0;
                                          this.setState({ sportMatch: { ...this.state.sportMatch, sportMatchSet: [ ...this.state.sportMatch.sportMatchSet.reduce((returnValue: ISportMatchSet[], set: ISportMatchSet) => set.setNumber === sportMatchSet.setNumber ? returnValue : returnValue.concat(set), []), sportMatchSet ]} })
                                        }} 
                                      />
                                    </td>
                                  )
                                })
                              }
                              <td>
                                <ClickableIcon 
                                  iconName="Delete"
                                  onClick={() => {
                                    const sportMatch = structuredClone(this.state.sportMatch);
                                    sportMatch.sportMatchSet = sportMatch.sportMatchSet.filter((item) => item.setNumber !== sportMatchSet.setNumber).reduce((returnValue: [], set) => returnValue.concat(Object.assign({ ...set, setNumber: set.setNumber > sportMatchSet.setNumber ? set.setNumber - 1 : set.setNumber })), []);
                                    this.setState({ sportMatch: sportMatch });
                                  }}
                                />
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                  <div className={styles.addSetButton}>
                    <Button
                      onClick={() => {
                        let nextSportMatchSetNumber = 0;
                        while (this.state.sportMatch.sportMatchSet.find((item) => item.setNumber === nextSportMatchSetNumber)) {
                          nextSportMatchSetNumber++;
                        }
                        this.setState({ sportMatch: { ...this.state.sportMatch, sportMatchSet: [ ...this.state.sportMatch.sportMatchSet, { id: undefined, setNumber: nextSportMatchSetNumber, sportScore: this.state.sportMatch.sportTeam.map((sportTeam, sportTeamIndex) => { return { teamNumber: sportTeam.teamNumber, score: 0 } }) }] } })
                      }}
                    >
                      {LanguageContext.t("sport:AddSet")}
                    </Button>
                  </div>
                </>
              }
              <div className={styles.smallSeparator} />
              <textarea 
                className={styles.description}
                value={this.state.sportMatch.description}
                onChange={(event) => {
                  this.setState({ sportMatch: { ...this.state.sportMatch, description: event.target.value } })
                }}
              />
              <div 
                className={styles.separator}
              />
              <div className={styles.submitButtonContainer}>
                <ClickableIcon 
                  iconName="Save"
                  onClick={() => {
                    this.props.onSave && this.props.onSave(this.state.sportMatch);
                  }}
                />
                <ClickableIcon 
                  iconName="Cancel"
                  onClick={() => {
                    this.props.onSave && this.props.onSave(this.props.sportMatch);
                  }}
                />
              </div>
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
                {LanguageContext.t("sport:NoSportEventMatch")}
              </p>
            </div>
          )}
        </PWPLanguageContext.Consumer>
      );
    }
  }
}