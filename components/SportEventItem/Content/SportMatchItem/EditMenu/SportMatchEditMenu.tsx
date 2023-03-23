import { Component } from "react";
import { FrontEndController } from "../../../../../controller/frontEndController";
import { ISportMatch, ISportMatchSet, ISportTeam, IUser } from "../../../../../interfaces/database";
import { Button } from "../../../../Button/Button";
import { ClickableIcon } from "../../../../ClickableIcon/ClickableIcon";
import { PWPLanguageContext } from "../../../../PWPLanguageProvider/PWPLanguageProvider";
import { TagPicker } from "../../../../TagPicker/TagPicker";
import styles from "./SportMatchEditMenu.module.css";

export interface SportMatchEditMenuState {
  availableUsers: IUser[];
}

export interface SportMatchEditMenuProps {
  sportMatch: ISportMatch;
  hidden?: boolean;
  className?: string;
  onChange: (sportMatch: ISportMatch) => void;
  onClose: () => void;
}

export class SportMatchEditMenu extends Component<SportMatchEditMenuProps, SportMatchEditMenuState> {
  constructor(props: SportMatchEditMenuProps) {
    super(props);
    this.state = {
      availableUsers: [],
    };
  }

  async componentDidMount() {
    this.setState({
      availableUsers: await FrontEndController.getAllUsers(FrontEndController.getUserToken())
    })
  }
  
  render() {
    return (
      <PWPLanguageContext.Consumer>
        { LanguageContext => (
          <div
            className={styles.wrapper}
            hidden={this.props.hidden}
          >
            <div className={styles.separator} />
            {
              this.props.sportMatch.sportTeam.sort((a, b) => a.teamNumber > b.teamNumber ? 1 : -1).map((sportTeam, sportTeamIndex) => {
                return (
                  <div key={"sportTeam" + sportTeamIndex}>
                    <div className={styles.heading}>
                      <h2>{LanguageContext.t("sport:Team")} {sportTeam.teamNumber + 1}</h2>
                      <ClickableIcon 
                        iconName="Delete"
                        onClick={() => {
                          // delete sportTeam with teamNumber and sportScore with teamNumber
                          const sportMatch = structuredClone(this.props.sportMatch);
                          sportMatch.sportTeam = sportMatch.sportTeam.filter((item) => item.teamNumber !== sportTeam.teamNumber).reduce((returnValue: [], team) => returnValue.concat(Object.assign({ ...team, teamNumber: team.teamNumber > sportTeam.teamNumber ? team.teamNumber - 1 : team.teamNumber })), []);
                          if (sportMatch.sportTeam.length === 0) {
                            sportMatch.sportMatchSet = [];
                          } else {
                            sportMatch.sportMatchSet = sportMatch.sportMatchSet.reduce((returnValue: [], set) => returnValue.concat(Object.assign({ ...set, sportScore: set.sportScore.filter((item) => item.teamNumber !== sportTeam.teamNumber).reduce((returnValue: [], score) => returnValue.concat(Object.assign({ ...score, teamNumber: score.teamNumber > sportTeam.teamNumber ? score.teamNumber - 1 : score.teamNumber })), []) })), []);
                          }
                          this.props.onChange(sportMatch);
                        }}
                      />
                    </div>
                    <TagPicker 
                      options={
                        this.state.availableUsers.filter(
                          (user) => this.props.sportMatch.sportTeam.filter((sportTeam) => sportTeam.user.filter((sportTeamUser) => user.id === sportTeamUser.id).length !== 0).length === 0
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
                        this.props.onChange({ ...this.props.sportMatch, sportTeam: [ ...this.props.sportMatch.sportTeam.reduce((returnValue: ISportTeam[], team: ISportTeam) => team.teamNumber === sportTeam.teamNumber ? returnValue : returnValue.concat(team), []), sportTeam ]})
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
                  while (this.props.sportMatch.sportTeam.find((item) => item.teamNumber === nextSportTeamNumber)) {
                    nextSportTeamNumber++;
                  }
                  this.props.onChange({ ...this.props.sportMatch, sportTeam: [...this.props.sportMatch.sportTeam, { teamNumber: nextSportTeamNumber, user: [] }], sportMatchSet: [...this.props.sportMatch.sportMatchSet.map((sportMatchSet) => Object.assign({ ...sportMatchSet, sportScore: [ ...sportMatchSet.sportScore, { teamNumber: nextSportTeamNumber, score: 0 } ] }))] })
                }}
              >
                {LanguageContext.t("sport:AddTeam")}
              </Button>
            </div>
            {
              this.props.sportMatch.sportTeam.length > 0 &&
              <>
                <div className={styles.smallSeparator} />
                <table className={styles.setTable}>
                  <thead>
                    <tr>
                      <td></td>
                      {
                        this.props.sportMatch.sportTeam.map((sportTeam, sportTeamIndex) => {
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
                      this.props.sportMatch.sportMatchSet.sort((a, b) => a.setNumber > b.setNumber ? 1 : -1).map((sportMatchSet, sportMatchSetIndex) => {
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
                                        this.props.onChange({ ...this.props.sportMatch, sportMatchSet: [ ...this.props.sportMatch.sportMatchSet.reduce((returnValue: ISportMatchSet[], set: ISportMatchSet) => set.setNumber === sportMatchSet.setNumber ? returnValue : returnValue.concat(set), []), sportMatchSet ]})
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
                                  const sportMatch = structuredClone(this.props.sportMatch);
                                  sportMatch.sportMatchSet = sportMatch.sportMatchSet.filter((item) => item.setNumber !== sportMatchSet.setNumber).reduce((returnValue: [], set) => returnValue.concat(Object.assign({ ...set, setNumber: set.setNumber > sportMatchSet.setNumber ? set.setNumber - 1 : set.setNumber })), []);
                                  this.props.onChange(sportMatch);
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
                      while (this.props.sportMatch.sportMatchSet.find((item) => item.setNumber === nextSportMatchSetNumber)) {
                        nextSportMatchSetNumber++;
                      }
                      this.props.onChange({ ...this.props.sportMatch, sportMatchSet: [ ...this.props.sportMatch.sportMatchSet, { id: undefined, setNumber: nextSportMatchSetNumber, sportScore: this.props.sportMatch.sportTeam.map((sportTeam, sportTeamIndex) => { return { teamNumber: sportTeam.teamNumber, score: 0 } }) }] })
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
              value={this.props.sportMatch.description}
              onChange={(event) => {
                this.props.onChange({ ...this.props.sportMatch, description: event.target.value })
              }}
            />
            <div className={styles.controlButtonWrapper}>
              <ClickableIcon
                iconName="CheckMark"
                onClick={() => {
                  this.props.onClose();
                }}
              />
            </div>
          </div>
        )}
      </PWPLanguageContext.Consumer>
    )
  }
}