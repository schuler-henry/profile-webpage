import React, { Component, createRef, RefObject } from "react";
import styles from "./SportEventItem.module.css";
import { ISportEvent } from '../../interfaces/database'
import { Icon } from "@fluentui/react";
import { PWPLanguageContext } from "../PWPLanguageProvider/PWPLanguageProvider";
import { SportEventCardItem } from "./CardItem/SportEventCardItem";
import { SportEventContent } from "./Content/SportEventContent";
import { ClickableIcon } from "../ClickableIcon/ClickableIcon";
import { SportEventEditMenu } from "./EditMenu/SportEventEditMenu";
import { ConfirmPopUp } from "../ConfirmPopUp/ConfirmPopUp";
import { FrontEndController } from "../../controller/frontEndController";


export interface SportEventItemState {
  expand: boolean;
  decrease: boolean;
  positionValues: DOMRect;
  verticalMenu: boolean;
  cardHidden: boolean;
  edit: boolean;
  confirmDelete: boolean;
  confirmDiscard: boolean;
  confirmSave: boolean;
}

export interface SportEventItemProps {
  sportEvent: ISportEvent;
  changed: boolean;
  onChange: (sportEvent: ISportEvent) => void;
  onDelete: () => void;
  onDiscard: () => void;
  onSave: () => void;
  isCreator?: boolean;
}

export class SportEventItem extends Component<SportEventItemProps, SportEventItemState> {
  private WRAPPER: RefObject<HTMLDivElement>;
  constructor(props) {
    super(props);
    this.WRAPPER = createRef();
    this.state = {
      expand: false,
      decrease: false,
      positionValues: undefined, // saves the current position of the card on the screen: undefined = card view, else = extended view
      verticalMenu: false,
      cardHidden: false,
      edit: false, // TODO: Redo edit feature
      confirmDelete: false,
      confirmDiscard: false,
      confirmSave: false,
    }
  }

  componentDidMount(): void {
    window.addEventListener("resize", this.setMenuDirection.bind(this));
    this.setMenuDirection();
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

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.setMenuDirection.bind(this));
  }

  private toggleView(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (this.state.positionValues === undefined) {
      this.maximize(event);
    } else if (event.target === event.currentTarget) {
      this.minimize();
    }
  }

  private maximize(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // check if in card view (this.state.positionValues === undefined)
    if (this.state.positionValues === undefined) {
      // set process variables and save current position of card on screen
      this.setState({ expand: true, decrease: false, positionValues: event.currentTarget.getBoundingClientRect() })
    }
  }

  private minimize() {
    if (this.state.expand) {
      setTimeout(() => {
        this.setState({ decrease: false, positionValues: undefined })
      }, 800)
      this.setState({ expand: false, decrease: true, cardHidden: false })
    }
  }

  private setMenuDirection() {
    if (this.WRAPPER.current?.clientWidth < 520 && !this.state.verticalMenu) {
      this.setState({ verticalMenu: true });
    } else if (this.WRAPPER.current?.clientWidth >= 520 && this.state.verticalMenu) {
      this.setState({ verticalMenu: false });
    }
  }

  render() {
    return (
      <PWPLanguageContext.Consumer>
        { LanguageContext => (
          // container that keeps the card proportions in the grid view.
          <div
            style={ this.state.positionValues ? { height: this.state.positionValues.height, width: this.state.positionValues.width } : {} }
          >
            {/* clickable wrapper for maximizing and minimizing */}
            <div
              className={this.state.positionValues ? styles.minimizeClickWrapper : styles.maximizeClickWrapper}
              onClick={(event) => {
                this.toggleView(event);
              }}
            >
              {/* Choose view based on this.state.positionValues */}
              {/* container that can extend from card view to extended view */}
              <div
                className={`${styles.elementWrapper} ${this.state.expand && styles.expand} ${this.state.decrease && styles.decrease}`}
                style={ this.state.positionValues ? { position: "absolute", height: this.state.positionValues.height, width: this.state.positionValues.width, left: this.state.positionValues.x, top: this.state.positionValues.y } : {  height: "100%" }}
                ref={this.WRAPPER}
              >
                {/* Card-View */}
                <SportEventCardItem 
                  sportEvent={this.props.sportEvent}
                  className={`${styles.sportEventCard} ${this.state.cardHidden && styles.hideCard}`}
                />
                {/* Extended View */}
                {/* This view can only be seen in extended mode (this.state.positionValues !== undefined) */}
                {/* Clickable icon to hide/show Card-View */}
                <div className={`${styles.hideCardBox} ${this.state.cardHidden && styles.showCardBox}`} hidden={this.state.positionValues === undefined}>
                  <div 
                    className={styles.hideCardWrapper}
                    onClick={() => {
                      this.setState({ cardHidden: !this.state.cardHidden })
                    }}
                  >
                    <Icon iconName="ChevronUp" />
                  </div>
                </div>
                {/* Control icons */}
                {
                  this.props.isCreator && this.state.positionValues !== undefined &&
                  <div
                    className={styles.controlButtonWrapper}
                    style={{ flexDirection: this.state.verticalMenu ? "column-reverse" : "row" }}
                  >
                    {
                      !this.state.edit &&
                        <ClickableIcon 
                          iconName="Edit"
                          onClick={() => {
                            this.setState({ edit: true });
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
                      this.props.changed &&
                      <ClickableIcon 
                        iconName="Cancel"
                        onClick={() => {
                          this.setState({ confirmDiscard: true })
                        }}
                      />
                    }
                    {
                      this.props.changed &&
                      <ClickableIcon 
                        iconName="Save"
                        onClick={() => {
                          this.setState({ confirmSave: true })
                        }}
                      />
                    }
                  </div>
                }
                {
                  this.state.confirmDelete &&
                  <ConfirmPopUp 
                    title={LanguageContext.t('sport:DeleteSportEvent')}
                    message={LanguageContext.t('sport:DeleteSportEventMessage')}
                    warning={LanguageContext.t('sport:DeleteSportEventWarning')}
                    onConfirm={() => {
                      this.minimize();
                      this.setState({ confirmDelete: false })
                      setTimeout(() => {
                        this.props.onDelete();
                      }, 1000)
                    }}
                    onCancel={() => {
                      this.setState({ confirmDelete: false }) 
                    }}
                  />
                }
                {
                  this.state.confirmDiscard &&
                  <ConfirmPopUp 
                    title={LanguageContext.t('sport:DiscardChangesSportEvent')}
                    message={LanguageContext.t('sport:DiscardChangesSportEventMessage')}
                    onConfirm={() => {
                      this.setState({ confirmDiscard: false })
                      this.props.onDiscard();
                    }}
                    onCancel={() => {
                      this.setState({ confirmDiscard: false }) 
                    }}
                  />
                }
                {
                  this.state.confirmSave &&
                  <ConfirmPopUp 
                    title={LanguageContext.t('sport:SaveSportEvent')}
                    message={LanguageContext.t('sport:SaveSportEventMessage')}
                    onConfirm={() => {
                      this.setState({ confirmSave: false })
                      this.props.onSave();
                    }}
                    onCancel={() => {
                      this.setState({ confirmSave: false })
                    }}
                  />
                }
                {/* Content body */}
                <SportEventContent
                  sportEvent={this.props.sportEvent}
                  hidden={this.state.positionValues === undefined || this.state.edit}
                />
                {/* TODO: Add edit UI */}
                <SportEventEditMenu 
                  hidden={this.state.positionValues === undefined || !this.state.edit}
                  sportEvent={this.props.sportEvent}
                  onChange={(sportEvent: ISportEvent) => {
                    this.props.onChange(sportEvent)
                  }}
                  onClose={() => {
                    this.setState({ edit: false })
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </PWPLanguageContext.Consumer>
    );
  }
}