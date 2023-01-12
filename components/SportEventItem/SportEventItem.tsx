import React, { Component } from "react";
import styles from "./SportEventItem.module.css";
import { ISportEvent } from '../../interfaces/database'
import { dateStringToFormattedDateString } from "../../shared/dateStringToFormattedDateString";
import { dateStringToFormattedTimeString } from "../../shared/dateStringToFormattedTimeString";
import { Icon } from "@fluentui/react";
import { SportMatchItem } from "../SportMatchItem/SportMatchItem";
import { SportEventItemEdit } from "../SportEventItemEdit/SportEventItemEdit";
import { ClickableIcon } from "../ClickableIcon/ClickableIcon";
import { FrontEndController } from "../../controller/frontEndController";
import { ConfirmPopUp } from "../ConfirmPopUp/ConfirmPopUp";
import { PWPLanguageContext } from "../PWPLanguageProvider/PWPLanguageProvider";


export interface SportEventItemState {
  expand: boolean;
  decrease: boolean;
  positionValues: DOMRect;
  edit: boolean;
  confirmDelete: boolean;
  updating: boolean;
}

export interface SportEventItemProps {
  sportEvent: ISportEvent;
  onChange?: () => void;
  isCreator?: boolean;
}

export class SportEventItem extends Component<SportEventItemProps, SportEventItemState> {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      decrease: false,
      positionValues: undefined,
      edit: false,
      confirmDelete: false,
      updating: false,
    }
  }

  componentDidMount(): void {
      this.setState({ edit: this.props.sportEvent.id === undefined })
  }

  componentDidUpdate(prevProps: Readonly<SportEventItemProps>, prevState: Readonly<SportEventItemState>, snapshot?: any): void {
    if (!this.state.edit && this.props.sportEvent.id === undefined) {
      this.setState({ edit: true });
    }
    if (prevProps.sportEvent.id !== this.props.sportEvent.id) {
      this.setState({ edit: false })
    }
  }

  private minimize() {
    if (this.state.expand) {
      setTimeout(() => {
        this.setState({ decrease: false, positionValues: undefined })
      }, 800)
      this.setState({ expand: false, decrease: true })
    }
  }

  render() {
    return (
      <PWPLanguageContext.Consumer>
        { LanguageContext => (
          <div
            style={ this.state.positionValues ? { height: this.state.positionValues.height, width: this.state.positionValues.width } : {} }
          >
            <div 
              className={`${(this.state.positionValues !== undefined) && styles.elementBackground}`}
              style={{ height: "100%" }}
              onClick={(e) => {
                if (this.state.expand && e.target === e.currentTarget) {
                  this.minimize();
                }
              }}
            >
              <div 
                className={`${styles.elementWrapper} ${this.state.expand && styles.expand} ${this.state.decrease && styles.decrease}`}
                style={ this.state.positionValues ? { position: "absolute", height: this.state.positionValues.height, width: this.state.positionValues.width, left: this.state.positionValues.x, top: this.state.positionValues.y } : {  height: "100%" }}
                onClick={(e) => {
                  if (!this.state.expand) {
                    this.setState({ expand: true, decrease: false, positionValues: e.currentTarget.getBoundingClientRect() })
                  }
                }}
              > 
                {
                  this.state.edit ?
                  <div style={{ height: "100%", position: "relative" }}>
                    <div className={this.state.positionValues ? "" : styles.addPreview} hidden={this.state.positionValues !== undefined}>
                      <Icon 
                        iconName={"Edit"}
                        style={{ fontSize: "30px" }}
                      />
                    </div>
                    <div style={{ height: "100%" }} >
                      <SportEventItemEdit 
                        sportEvent={this.props.sportEvent}
                        preview={!this.state.positionValues}
                        onSave={(sportEvent) => {
                          this.props.onChange && this.props.onChange();
                          this.setState({ edit: false })
                          this.minimize()
                        }}
                        onCancel={() => {
                          this.setState({ edit: false })
                        }}
                      />
                    </div>
                  </div>
                  :
                  <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    {
                      this.state.positionValues && this.props.isCreator &&
                      <div className={styles.controlButtons}>
                        <ClickableIcon 
                          iconName="Edit"
                          onClick={() => {
                            this.setState({ edit: true })
                          }}
                        />
                        <ClickableIcon
                          iconName="Delete"
                          onClick={async () => {
                            this.setState({ confirmDelete: true })
                          }}
                        />
                        {
                          this.state.confirmDelete &&
                            <ConfirmPopUp 
                              title={LanguageContext.t('sport:DeleteSportEvent')}
                              message={LanguageContext.t('sport:DeleteSportEventMessage')}
                              onConfirm={this.state.updating ? () => {} : async () => {
                                this.setState({ updating: true })
                                await FrontEndController.deleteSportEvent(FrontEndController.getUserToken(), this.props.sportEvent.id);
                                this.props.onChange && this.props.onChange();
                                this.setState({ confirmDelete: false, updating: false })
                                this.minimize();
                              }}
                              onCancel={this.state.updating ? () => {} : () => {
                                this.setState({ confirmDelete: false }) 
                              }}
                              sync={this.state.updating}
                            />
                        }
                      </div>
                    }
                    <div className={styles.preview}>
                      <div className={styles.left}>
                        <div className={styles.sportHeading}>
                          <h1 className={styles.sport}>
                            { LanguageContext.t("sport:" + this.props.sportEvent.sport?.name) }
                          </h1>
                          <p>
                            { LanguageContext.t("sport:" + this.props.sportEvent.sportEventType?.name) }
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
                        <div className={styles.visibilityLevel}>
                          { this.props.sportEvent.visibility }
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
        )}
      </PWPLanguageContext.Consumer>
    );
  }
}