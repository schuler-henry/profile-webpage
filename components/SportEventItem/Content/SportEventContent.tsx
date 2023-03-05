import { Component } from "react";
import styles from "./SportEventContent.module.css";
import { ISportEvent } from "../../../interfaces/database";
import { PWPLanguageContext } from "../../PWPLanguageProvider/PWPLanguageProvider";
import React from "react";
import { SportMatchItem } from "./SportMatchItem/SportMatchItem";
import { ClickableIcon } from "../../ClickableIcon/ClickableIcon";

export interface SportEventContentState {
}

export interface SportEventContentProps {
  sportEvent: ISportEvent;
  isCreator?: boolean;
  hidden?: boolean;
  className?: string;
  onChange: (sportEvent: ISportEvent) => void;
}

export class SportEventContent extends Component<SportEventContentProps, SportEventContentState> {
  constructor(props: SportEventContentProps) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(): void {
  }

  componentWillUnmount(): void {
  }

  render() {
    return (
      <PWPLanguageContext.Consumer>
        { LanguageContext => (
          <div
            className={`${styles.wrapper} ${this.props.className}`}
            style={{ display: this.props.hidden && "none" }}
            hidden={this.props.hidden}
          >
            {
              this.props.sportEvent?.sportMatch?.map((sportMatch, index) => {
                return (
                  <SportMatchItem 
                    key={"SportMatchItem" + index}
                    sportMatch={sportMatch}
                    isCreator={this.props.isCreator}
                    onChange={(sportMatch) => {
                      let sportEvent = structuredClone(this.props.sportEvent);
                      sportEvent.sportMatch[index] = sportMatch;
                      this.props.onChange(sportEvent);
                    }}
                    onDelete={() => {
                      let sportEvent = structuredClone(this.props.sportEvent);
                      sportEvent.sportMatch.splice(index, 1);
                      this.props.onChange(sportEvent);
                    }}
                  />
                )
              })
            }
            {
              this.props.isCreator &&
              <div className={styles.buttonGroup}>
                <ClickableIcon 
                  iconName="Add"
                  onClick={() => {
                    const lowestId = this.props.sportEvent.sportMatch.reduce((returnValue, item) => item.id < returnValue ? item.id : returnValue, 0)
                    this.props.onChange({...this.props.sportEvent, sportMatch: [...this.props.sportEvent.sportMatch, {id: lowestId - 1, description: undefined, sportTeam: [], sportMatchSet: [] }] })
                  }}
                />
              </div>
            }
          </div>
        )}
        </PWPLanguageContext.Consumer>
      );
    }
}