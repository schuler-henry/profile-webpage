import React, { Component } from "react";
import styles from "./SportMatchItem.module.css";
import { ISportMatch } from '../../interfaces/database'

export interface SportMatchItemState {

}

export interface SportMatchItemProps {
  sportMatch: ISportMatch;
}

export class SportMatchItem extends Component<SportMatchItemProps, SportMatchItemState> {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    if (this.props.sportMatch !== undefined) {
      return (
        <div>
          { this.props.sportMatch.description }
          {
            this.props.sportMatch.sportTeam.map((sportTeam, sportTeamIndex) => {
              return (
                <div key={"sportTeam" + sportTeamIndex}>
                  { sportTeam.teamNumber}
                  {/* {
                    sportTeam.user.map((user, userIndex) => {
                      return (
                        <div key={"user" + userIndex}>
                          { user.username }
                        </div>
                      )
                    })
                  } */}
                </div>
              )
            })
          }
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