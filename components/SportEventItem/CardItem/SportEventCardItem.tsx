import { Component, createRef, RefObject } from "react";
import styles from "./SportEventCardItem.module.css";
import { ISportEvent } from "../../../interfaces/database";
import { PWPLanguageContext } from "../../PWPLanguageProvider/PWPLanguageProvider";
import { Icon } from "@fluentui/react";
import { dateStringToFormattedDateString } from "../../../shared/dateStringToFormattedDateString";
import { dateStringToFormattedTimeString } from "../../../shared/dateStringToFormattedTimeString";
import React from "react";

export interface SportEventCardItemState {
  sideView: boolean;
}

export interface SportEventCardItemProps {
  sportEvent: ISportEvent;
  changed: boolean;
  className?: string;
}

export class SportEventCardItem extends Component<SportEventCardItemProps, SportEventCardItemState> {
  private WRAPPER: RefObject<HTMLDivElement>;
  constructor(props: SportEventCardItemProps) {
    super(props);
    this.WRAPPER = createRef();
    this.state = {
      sideView: false,
    };
  }

  componentDidMount(): void {
    window.addEventListener("resize", this.setViewDirection.bind(this));
    this.setViewDirection();
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.setViewDirection.bind(this));
  }

  private setViewDirection() {
    if (this.WRAPPER.current?.clientWidth < 360 && this.state.sideView) {
      this.setState({ sideView: false });
    } else if (this.WRAPPER.current?.clientWidth >= 360 && !this.state.sideView) {
      this.setState({ sideView: true });
    }
  }

  render() {
    return (
      <PWPLanguageContext.Consumer>
        { LanguageContext => (
          <div className={`${styles.wrapper} ${this.state.sideView && styles.sideView} ${this.props.className}`} ref={this.WRAPPER}>
            <div className={styles.overview}>
              <div className={styles.title}>
                <h1>
                  { LanguageContext.t("sport:" + this.props.sportEvent?.sport?.name) }
                </h1>
                <p>
                  { LanguageContext.t("sport:" + this.props.sportEvent?.sportEventType?.name) }
                </p>
              </div>
              <div className={styles.iconWrapper}>
                <Icon 
                  iconName={ this.props.sportEvent?.sport?.name.length > 0 ? this.props.sportEvent.sport.name : "MoreSports" } 
                  className={styles.icon}
                />
              </div>
              <div className={styles.dateWrapper}>
                <p>
                  { this.props.sportEvent?.startTime !== undefined ? dateStringToFormattedDateString(this.props.sportEvent.startTime) : "DD.MM.YYYY" }
                  <br />
                  { this.props.sportEvent?.startTime !== undefined ? dateStringToFormattedTimeString(this.props.sportEvent.startTime) : "HH:MM" }
                  &nbsp;-&nbsp;
                  { this.props.sportEvent?.endTime !== undefined ? dateStringToFormattedTimeString(this.props.sportEvent.endTime) : "HH:MM"}
                </p>
              </div>
            </div>
            <div className={styles.info}>
              <div>
                {
                  this.props.sportEvent?.sportClubs?.map((sportClub, index) => {
                    return (
                      <React.Fragment key={"SportClubName" + index}>
                        { 
                          index !== 0 && 
                          <>
                            vs.&nbsp;
                          </>
                        }
                        <p className={styles.sportClub}>
                          { sportClub?.sportClub?.name }
                          &nbsp;
                          {
                            sportClub?.host &&
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
                  (this.props.sportEvent?.description?.trim().length !== 0) &&
                    <div className={styles.description}>
                      { this.props.sportEvent?.description }
                    </div>
                }
                <div className={styles.locationDetails}>
                  <p>
                    { this.props.sportEvent?.sportLocation?.name }
                  </p>
                  <p>
                    { this.props.sportEvent?.sportLocation?.address }
                  </p>
                </div>
              </div>
            </div>
            <div 
              className={styles.changedDot}
              style={{ color: this.props.changed ? "var(--color-border-changed)" : "var(--color-border-approved)" }}
            >
              <Icon 
                iconName="LocationDot"
              />
            </div>
          </div>
        )}
        </PWPLanguageContext.Consumer>
      );
    }
}