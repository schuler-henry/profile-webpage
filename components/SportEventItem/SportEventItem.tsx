import React, { Component } from "react";
import styles from "./SportEventItem.module.css";
import { ISportEvent } from '../../interfaces/database'
import { dateStringToFormattedDateString } from "../../shared/dateStringToFormattedDateString";
import { dateStringToFormattedTimeString } from "../../shared/dateStringToFormattedTimeString";
import { Icon } from "@fluentui/react";
import { SportMatchItem } from "../SportMatchItem/SportMatchItem";
import { SportEventItemEdit } from "../SportEventItemEdit/SportEventItemEdit";


export interface SportEventItemState {
  expand: boolean;
  decrees: boolean;
  positionValues: DOMRect;
}

export interface SportEventItemProps {
  sportEvent?: ISportEvent;
}

export class SportEventItem extends Component<SportEventItemProps, SportEventItemState> {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      decrees: false,
      positionValues: undefined,
    }
  }
  render() {
    return (
      <div
        style={ this.state.positionValues ? { height: this.state.positionValues.height, width: this.state.positionValues.width } : {} }
      >
        <div 
          className={`${(this.state.positionValues !== undefined) && styles.elementBackground}`}
          style={{ height: "100%" }}
          onClick={(e) => {
            if (this.state.expand && e.target === e.currentTarget) {
              setTimeout(() => {
                this.setState({ decrees: false, positionValues: undefined })
              }, 800)
              this.setState({ expand: false, decrees: true })
            }
          }}
        >
          <div 
            className={`${styles.elementWrapper} ${this.state.expand && styles.expand} ${this.state.decrees && styles.decrees}`}
            style={ this.state.positionValues ? { position: "absolute", height: this.state.positionValues.height, width: this.state.positionValues.width, left: this.state.positionValues.x, top: this.state.positionValues.y } : { height: "100%" }}
            onClick={(e) => {
              if (!this.state.expand) {
                this.setState({ expand: true, decrees: false, positionValues: e.currentTarget.getBoundingClientRect() })
              }
            }}
          > 
            {
              this.props.sportEvent === undefined ? 
              <div style={{ height: "100%" }}>
                <div className={this.state.positionValues ? "" : styles.addPreview} hidden={Boolean(this.state.positionValues)}>
                  <Icon 
                    iconName="add"
                    style={{ fontSize: "30px" }}  
                  />
                </div>
                <div style={{ height: "100%" }} hidden={!this.state.positionValues}>
                  <SportEventItemEdit />
                </div>
              </div>
              :
              <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div className={styles.preview}>
                  <div className={styles.left}>
                    <div className={styles.sportHeading}>
                      <h1 className={styles.sport}>
                        { this.props.sportEvent.sport?.name }
                      </h1>
                      <p>
                        { this.props.sportEvent.sportEventType?.name }
                      </p>
                    </div>
                    <p className={styles.sportIcon}>
                      <Icon 
                        iconName={ this.props.sportEvent.sport?.name } 
                        style={{ height: "40px", width: "40px" }}
                      />
                    </p>
                    <p>
                      { dateStringToFormattedDateString(this.props.sportEvent.startTime) }
                      <br />
                      { dateStringToFormattedTimeString(this.props.sportEvent.startTime) }
                      &nbsp;-&nbsp;
                      { new Date(this.props.sportEvent.endTime).getDate() === new Date(this.props.sportEvent.startTime).getDate() ? "" : dateStringToFormattedDateString(this.props.sportEvent.endTime) + '\u00A0' }
                      { dateStringToFormattedTimeString(this.props.sportEvent.endTime) }
                    </p>
                  </div>
                  <div className={styles.right}>
                    <div className={styles.clubs}>
                      {
                        this.props.sportEvent.sportClubs?.map((sportClub, index) => {
                          return (
                            <React.Fragment key={index}>
                              { 
                                index !== 0 && 
                                <>
                                  vs.&nbsp;
                                </>
                              }
                              <p className={styles.sportClub}>
                                { sportClub.sportClub?.name }
                                &nbsp;
                                {
                                  sportClub.host &&
                                  <span style={{ fontWeight: "normal" }}>
                                    (H)&nbsp;
                                  </span>
                                }
                              </p>
                            </React.Fragment>
                          )
                        })
                      }
                    </div>
                    <div>
                      {
                        (this.props.sportEvent?.description.trim().length !== 0) &&
                          <div className={styles.description}>
                            { this.props.sportEvent?.description }
                          </div>
                      }
                      <div className={styles.locationDetails}>
                        <p>
                          { this.props.sportEvent.sportLocation?.name }
                        </p>
                        <p>
                          { this.props.sportEvent.sportLocation?.address }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={this.state.positionValues ? styles.content : ""} hidden={!this.state.positionValues}>
                  {
                    this.props.sportEvent.sportMatch?.map((sportMatch, index) => {
                      return (
                        <SportMatchItem 
                          key={"sportMatch" + index} 
                          sportMatch={ sportMatch }
                        />
                      )
                    })
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}