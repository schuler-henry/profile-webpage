import React, { Component } from "react";
import styles from "./SportMatchItem.module.css";
import { ISportMatch } from '../../interfaces/database'
import { PWPAuthContext } from "../PWPAuthProvider/PWPAuthProvider";

export interface SportMatchItemState {
  winnerTeamNumber: number[]; // index = teamNumber; value = number of sets won
}

export interface SportMatchItemProps {
  sportMatch: ISportMatch;
}

export class SportMatchItem extends Component<SportMatchItemProps, SportMatchItemState> {
  constructor(props) {
    super(props);
    this.state = {
      winnerTeamNumber: undefined,
    }
  }

  static contextType = PWPAuthContext

  componentDidMount(): void {
    const sportMatchSets = this.props.sportMatch.sportMatchSet;
    let winnerList = [];
    for (const sportMatchSet of sportMatchSets.sort((a, b) => a.setNumber > b.setNumber ? 1 : -1)) {
      const setWinner = sportMatchSet.sportScore.reduce((a, b) => a.score > b.score ? a : b).teamNumber;
      while (winnerList.length <= setWinner) {
        winnerList.push(0);
      }
      winnerList[setWinner] += 1;
    }
    this.setState({ winnerTeamNumber: winnerList})
  }

  render() {
    if (this.props.sportMatch !== undefined) {
      return (
        <div className={styles.elementWrapper}>
          <table>
            <thead>
              <tr>
                <td></td>
                <td colSpan={this.props.sportMatch.sportMatchSet.length}>Result</td>
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
                                <span style={ this.context.user?.id === user.id ? { backgroundColor: "rgb(0, 255, 0, 0.2)" } : {} }>
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
                            <td key={"sportMatchSet" + sportMatchSetIndex} style={ sportMatchSet.sportScore.reduce((a, b) => a.score > b.score ? a : b).teamNumber === sportTeam.teamNumber ? { color: "red" } : {}}>
                              {
                                sportMatchSet.sportScore.find((item) => item.teamNumber === sportTeam.teamNumber)?.score
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
            {this.props.sportMatch.description}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <p>
            No Sport Event Match
          </p>
        </div>
      );
    }
  }
}