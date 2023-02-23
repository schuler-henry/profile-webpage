import React, { Component } from "react";
import styles from "./SportEventItem.module.css";
import { ISportEvent } from '../../interfaces/database'
import { Icon } from "@fluentui/react";
import { PWPLanguageContext } from "../PWPLanguageProvider/PWPLanguageProvider";
import { SportEventCardItem } from "./CardItem/SportEventCardItem";
import { SportEventContent } from "./Content/SportEventContent";


export interface SportEventItemState {
  expand: boolean;
  decrease: boolean;
  positionValues: DOMRect;
  cardHidden: boolean;
  edit: boolean;
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
      positionValues: undefined, // saves the current position of the card on the screen: undefined = card view, else = extended view
      cardHidden: false,
      edit: false, // TODO: Redo edit feature
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
        this.setState({ decrease: false, positionValues: undefined, cardHidden: false })
      }, 800)
      this.setState({ expand: false, decrease: true })
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
              >
                {/* Card-View */}
                <SportEventCardItem 
                  sportEvent={this.props.sportEvent}
                  className={`${styles.sportEventCard} ${this.state.cardHidden && styles.hideCard}`}
                />
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
                {/* Extended View */}
                {/* This view can only be seen in extended mode (this.state.positionValues !== undefined) */}
                <SportEventContent
                  sportEvent={this.props.sportEvent}
                  hidden={this.state.positionValues === undefined}
                />
              </div>
            </div>
          </div>
        )}
      </PWPLanguageContext.Consumer>
    );
  }
}