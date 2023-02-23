import { Component } from "react";
import styles from "./SportEventContent.module.css";
import { ISportEvent } from "../../../interfaces/database";
import { PWPLanguageContext } from "../../PWPLanguageProvider/PWPLanguageProvider";
import React from "react";
import { SportMatchItem } from "../../SportMatchItem/SportMatchItem";

export interface SportEventContentState {
}

export interface SportEventContentProps {
  sportEvent: ISportEvent;
  hidden?: boolean;
  className?: string;
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
                  />
                )
              })
            }
          </div>
        )}
        </PWPLanguageContext.Consumer>
      );
    }
}