import React, { Component } from "react";
import sportEventItemStyles from "../SportEventItem/SportEventItem.module.css";
import styles from "./SportEventItemEdit.module.css";
import { ISport, ISportClub, ISportEvent, ISportEventType, ISportLocation } from '../../interfaces/database'
import { dateStringToFormattedDateString } from "../../shared/dateStringToFormattedDateString";
import { dateStringToFormattedTimeString } from "../../shared/dateStringToFormattedTimeString";
import { Icon } from "@fluentui/react";
import { SportMatchItem } from "../SportMatchItem/SportMatchItem";
import { FrontEndController } from "../../controller/frontEndController";
import { Dropdown, DropdownOption } from "../Dropdown/Dropdown";
import { SportEventVisibility } from "../../enums/sportEventVisibility";
import { TagPicker } from "../TagPicker/TagPicker";
import { ClickableIcon } from "../ClickableIcon/ClickableIcon";
import { ConfirmPopUp } from "../ConfirmPopUp/ConfirmPopUp";
import { Button } from "../Button/Button";

const onRenderOption = (option: DropdownOption): JSX.Element => {
  return(
    <div style={{ width: "100%", display: "flex"}}>
      {
        option?.data?.icon &&
        <span style={{ display: "flex", alignItems: "center" }}>
          <Icon style={{ display: "flex", marginRight: '8px', fontSize: "15px", height: "15px" }} iconName={option.data.icon} />
        </span>
      }
      <span>
        {option?.text}
      </span>
    </div>
  )
}

const onRenderCaretDown = (): JSX.Element => {
  return(
    <Icon iconName="ChevronDown" style={{ display: "flex" }} />
  )
}

export interface SportEventItemEditState {
  expand: boolean;
  decrees: boolean;
  availableSports: ISport[];
  availableSportEventTypes: ISportEventType[];
  availableSportClubs: ISportClub[];
  availableSportLocations: ISportLocation[];
  sportEvent: ISportEvent;
  tab: number;
  confirmUpdate: boolean;
  confirmCancel: boolean;
  confirmError: boolean;
  preview: boolean;
  updating: boolean;
}

export interface SportEventItemEditProps {
  sportEvent: ISportEvent;
  onSave?: (sportEvent: ISportEvent) => void;
  onCancel?: () => void;
  preview?: boolean;
}

export class SportEventItemEdit extends Component<SportEventItemEditProps, SportEventItemEditState> {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      decrees: false,
      availableSports: [],
      availableSportEventTypes: [],
      availableSportClubs: [],
      availableSportLocations: [],
      sportEvent: {
        id: undefined,
        startTime: undefined,
        endTime: undefined,
        description: "",
        visibility: SportEventVisibility.public,
        creator: undefined,
        sport: undefined,
        sportLocation: undefined,
        sportEventType: undefined,
        sportClubs: [],
        sportMatch: [],
      },
      tab: 0,
      confirmUpdate: false,
      confirmCancel: false,
      confirmError: false,
      preview: this.props.preview,
      updating: false,
    }
  }

  async componentDidMount() {
    this.setState({ 
      preview: this.props.preview,
      sportEvent: { ...this.state.sportEvent, ...this.props.sportEvent, startTime: this.props.sportEvent.startTime && new Date(this.props.sportEvent.startTime), endTime: this.props.sportEvent.endTime && new Date(this.props.sportEvent.endTime) },
      availableSports: await FrontEndController.getAllSports(FrontEndController.getUserToken()), 
      availableSportEventTypes: await FrontEndController.getAllSportEventTypes(FrontEndController.getUserToken()),
      availableSportClubs: await FrontEndController.getSportClubs(FrontEndController.getUserToken()),
      availableSportLocations: await FrontEndController.getAllSportLocations(FrontEndController.getUserToken()),
    });
  }

  componentDidUpdate(prevProps: Readonly<SportEventItemEditProps>, prevState: Readonly<SportEventItemEditState>, snapshot?: any): void {
    if (prevProps.preview !== this.props.preview) {
      this.setState({ preview: this.props.preview });
    }
    if (prevProps.sportEvent !== this.props.sportEvent) {
      this.setState({ sportEvent: { ...this.state.sportEvent, ...this.props.sportEvent } });
    }
  }

  private tabs = ["Sport Event", "Event Details", "Content"]

  private visibilityOptions: DropdownOption[] = [
    { key: SportEventVisibility.creatorOnly.toString(), text: "0 Creator (Private)"},
    { key: SportEventVisibility.creatorMembers.toString(), text: "1 Creator + Member"},
    { key: SportEventVisibility.creatorMemberClubSportMember.toString(), text: "2 Creator + Member + Sport Member (Club)"},
    { key: SportEventVisibility.creatorMemberClubMember.toString(), text: "3 Creator + Member + Club Member"},
    { key: SportEventVisibility.public.toString(), text: "4 Everyone (Public)"},
  ]

  selectTab(id: number) {
    this.setState({ tab: id });
  }

  render() {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column"}}>
        {
          !this.state.preview &&
          <div className={styles.submitButtonContainer}>
            {
              this.props.onSave &&
              <ClickableIcon 
                iconName="Save"
                onClick={() => {
                  this.setState({ confirmUpdate: true });
                }}
              />
            }
            {
              this.props.onCancel &&
              <ClickableIcon 
                iconName="Cancel"
                onClick={() => {
                  this.setState({ confirmCancel: true });
                }}
              />
            }
          </div>
        }
        {
          this.state.confirmUpdate &&
          <ConfirmPopUp 
            title="Save Sport Event"
            message="Do you want to save the sport event?"
            onConfirm={this.state.updating ? () => {} : async () => {
              this.setState({ updating: true });
              if (await FrontEndController.updateSportEvent(FrontEndController.getUserToken(), this.state.sportEvent)) {
                this.props.onSave(this.state.sportEvent)
                this.setState({ confirmUpdate: false, updating: false });
              } else {
                this.setState({ confirmUpdate: false, confirmError: true, updating: false });
              }
            }}
            onCancel={this.state.updating ? () => {} : () => {
              this.setState({ confirmUpdate: false });
            }}
            sync={this.state.updating}
          />
        }
        {
          this.state.confirmCancel &&
          <ConfirmPopUp
            title="Cancel Sport Event"
            message="Do you want to cancel your changes?"
            onConfirm={() => {
              this.props.onCancel();
              this.setState({ confirmCancel: false });
            }}
            onCancel={() => {
              this.setState({ confirmCancel: false });
            }}
          />
        }
        {
          this.state.confirmError &&
          <ConfirmPopUp
            title="Error"
            warning="Something went wrong while saving the sport event."
            onConfirm={() => {
              this.setState({ confirmError: false });
            }}
          />
        }
        <div className={sportEventItemStyles.preview} style={this.state.preview ? {height: "100%"} : {}}>
          <div className={sportEventItemStyles.left}>
            <div className={sportEventItemStyles.sportHeading}>
              <h1 className={sportEventItemStyles.sport}>
                { this.state.sportEvent.sport?.name }
              </h1>
              <p>
                { this.state.sportEvent.sportEventType?.name }
              </p>
            </div>
            <p className={sportEventItemStyles.sportIcon}>
              <Icon 
                iconName={ this.state.sportEvent.sport?.name } 
                style={{ height: "40px", width: "40px" }}
              />
            </p>
            <p>
              { dateStringToFormattedDateString(this.state.sportEvent.startTime) }
              <br />
              { dateStringToFormattedTimeString(this.state.sportEvent.startTime) }
              &nbsp;-&nbsp;
              { new Date(this.state.sportEvent.endTime).getDate() === new Date(this.state.sportEvent.startTime).getDate() ? "" : dateStringToFormattedDateString(this.state.sportEvent.endTime) + '\u00A0' }
              { dateStringToFormattedTimeString(this.state.sportEvent.endTime) }
            </p>
          </div>
          <div className={sportEventItemStyles.right}>
            <div className={sportEventItemStyles.clubs}>
              {
                this.state.sportEvent.sportClubs?.map((sportClub, index) => {
                  return (
                    <React.Fragment key={index}>
                      { 
                        index !== 0 && 
                        <>
                          vs.&nbsp;
                        </>
                      }
                      <p className={sportEventItemStyles.sportClub}>
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
                (this.state.sportEvent?.description.trim().length !== 0) &&
                  <div className={sportEventItemStyles.description}>
                    { this.state.sportEvent?.description }
                  </div>
              }
              <div className={sportEventItemStyles.locationDetails}>
                <p>
                  { this.state.sportEvent.sportLocation?.name }
                </p>
                <p>
                  { this.state.sportEvent.sportLocation?.address }
                </p>
              </div>
            </div>
            <div className={sportEventItemStyles.visibilityLevel}>
              { this.state.sportEvent.visibility }
            </div>
          </div>
        </div>
        <div className={styles.content} style={this.state.preview ? {display: "none"} : {}}>
          <div className={styles.innerNav}>
            {
              this.tabs.map((tab, index) => {
                return (
                  <div 
                    onClick={() => this.selectTab(index)} 
                    key={tab}
                    className={ this.state.tab === index ? styles.selected : "" } 
                  >
                    {tab}
                  </div>
                )
              })
            }
          </div>
          <div className={styles.innerContent}>
            {
              this.state.tab === 0 &&
                <div>
                  <div className={styles.sportHeading}>
                    <h2 className={styles.sport}>
                      Sport
                    </h2>
                    <Dropdown 
                      options={
                        this.state.availableSports?.reduce((returnValue: [], item, index) => returnValue.concat(Object.assign({ key: item.id.toString(), text: item.name })), []) || []
                      }
                      placeholder={{ key: "", text: "undefined" }}
                      onRenderOption={onRenderOption} 
                      onRenderCaretDown={onRenderCaretDown}
                      selectedKey={this.state.sportEvent.sport?.id.toString()}
                      onChange={(event, option) => {
                        this.setState({ sportEvent: {...this.state.sportEvent, sport: this.state.availableSports.find(item => item.id.toString() === option.key)} })
                      }}
                      width="100%"
                    />
                    <h2 className={styles.sport}>
                      Sport Event Type
                    </h2>
                    <Dropdown 
                      options={
                        this.state.availableSportEventTypes?.reduce((returnValue: [], item, index) => returnValue.concat(Object.assign({ key: item.id.toString(), text: item.name })), []) || []
                      }
                      placeholder={{ key: "", text: "sport event type" }}
                      onRenderOption={onRenderOption}
                      onRenderCaretDown={onRenderCaretDown}
                      selectedKey={this.state.sportEvent.sportEventType?.id.toString()}
                      onChange={(event, option) => {
                        this.setState({ sportEvent: {...this.state.sportEvent, sportEventType: this.state.availableSportEventTypes.find(item => item.id.toString() === option.key)} })
                      }}
                      width="100%"
                    />
                  </div>
                  <h2 className={styles.sport}>
                    Start Time
                  </h2>
                  <input 
                    type="datetime-local"  
                    className={styles.timeInput}
                    value={this.state.sportEvent.startTime && new Date(this.state.sportEvent.startTime.getTime() - this.state.sportEvent.startTime.getTimezoneOffset() * 60000).toISOString().slice(0, -8)}
                    onChange={(event) => {
                      const year = parseInt(event.target.value.slice(0, 4))
                      const month = parseInt(event.target.value.slice(5, 7))
                      const day = parseInt(event.target.value.slice(8, 10))
                      const hour = parseInt(event.target.value.slice(11, 13))
                      const minute = parseInt(event.target.value.slice(14, 16))
                      const date = new Date(year, month - 1, day, hour, minute)
                        this.setState({ sportEvent: {...this.state.sportEvent, startTime: date} })
                    }}
                  />
                  <h2 className={styles.sport}>
                    End Time
                  </h2>
                  <input 
                    type="datetime-local" 
                    className={styles.timeInput}
                    value={this.state.sportEvent.endTime && new Date(this.state.sportEvent.endTime.getTime() - this.state.sportEvent.endTime.getTimezoneOffset() * 60000).toISOString().slice(0, -8)}
                    onChange={(event) => {
                      const year = parseInt(event.target.value.slice(0, 4))
                      const month = parseInt(event.target.value.slice(5, 7))
                      const day = parseInt(event.target.value.slice(8, 10))
                      const hour = parseInt(event.target.value.slice(11, 13))
                      const minute = parseInt(event.target.value.slice(14, 16))
                      const date = new Date(year, month - 1, day, hour, minute)
                      this.setState({ sportEvent: {...this.state.sportEvent, endTime: date} })
                    }}
                  />
                </div>
            }
            {
              this.state.tab === 1 &&
              <div>
                <h2>
                  Sport Clubs
                </h2>
                <TagPicker
                  selectedKeys={this.state.sportEvent.sportClubs?.reduce((returnValue: [], item, index) => returnValue.concat(Object.assign({ key: item.sportClub.id.toString(), text: item.sportClub.name })), []) || []}
                  onChange={(event, options) => {
                    this.setState({ sportEvent: {...this.state.sportEvent, sportClubs: options.map((option, index) => ({ sportClub: this.state.availableSportClubs.find(item => item.id.toString() === option.key), host: index === 0 }))} })
                  }}
                  options={
                    this.state.availableSportClubs.reduce((returnValue: [], item, index) => returnValue.concat(Object.assign({ key: item.id.toString(), text: item.name })), []) || []
                  }
                  contains         
                />
                <h2>
                  Description
                </h2>
                <textarea 
                  className={styles.description}
                  value={this.state.sportEvent.description}
                  onChange={(event) => {
                    this.setState({ sportEvent: {...this.state.sportEvent, description: event.target.value} })
                  }}
                />
                <h2>
                  Sport Location
                </h2>
                <Dropdown
                  options={
                    this.state.availableSportLocations.sort(
                      (a) => { 
                        // if a in this.state.sportEvent.sportClubs[0].sportClub.sportLocation then set a to top
                        return this.state.sportEvent.sportClubs[0]?.sportClub?.sportLocation?.find(item => item.id === a.id) ? -1 : 1
                        }
                    ).reduce(
                      (returnValue: [], item, index) => returnValue.concat(Object.assign({ key: item.id.toString(), text: item.name + " " + item.address })), []
                    ) || []
                  }
                  placeholder={{ key: "", text: "sport location" }}
                  onRenderOption={onRenderOption}
                  onRenderCaretDown={onRenderCaretDown}
                  selectedKey={this.state.sportEvent.sportLocation?.id.toString()}
                  onChange={(event, option) => {
                    this.setState({ sportEvent: {...this.state.sportEvent, sportLocation: this.state.availableSportLocations.find(item => item.id.toString() === option.key)} })
                  }}
                  width="100%"
                />
                <h2>
                  Visibility
                </h2>
                <Dropdown 
                  options={ this.visibilityOptions }
                  onRenderOption={onRenderOption}
                  onRenderCaretDown={onRenderCaretDown}
                  selectedKey={this.state.sportEvent.visibility.toString()}
                  onChange={(event, option) => {
                    this.setState({ sportEvent: {...this.state.sportEvent, visibility: parseInt(option.key)} })
                  }}
                  width="100%"
                />
              </div>
            }
            {
              this.state.tab === 2 &&
              <div className={sportEventItemStyles.content} style={{borderTop: "none"}}>
                {
                  this.state.sportEvent.sportMatch.map((sportMatch, sportMatchIndex) => {
                    return (
                      <SportMatchItem 
                        key={sportMatchIndex}
                        sportMatch={sportMatch}
                        onChange={(newSportMatch) => {
                          this.setState({ sportEvent: {...this.state.sportEvent, sportMatch: this.state.sportEvent.sportMatch.map((item, index) => JSON.stringify(item) === JSON.stringify(sportMatch) ? newSportMatch : item)} })
                        }}
                        onDelete={() => {
                          this.setState({ sportEvent: {...this.state.sportEvent, sportMatch: this.state.sportEvent.sportMatch.filter(item => JSON.stringify(item) !== JSON.stringify(sportMatch))} })
                        }}
                      />
                    )
                  })
                }
                <Button
                  onClick={() => {
                    const lowestId = this.state.sportEvent.sportMatch.reduce((returnValue, item) => item.id < returnValue ? item.id : returnValue, 0)
                    this.setState({ sportEvent: {...this.state.sportEvent, sportMatch: [...this.state.sportEvent.sportMatch, {id: lowestId - 1, description: undefined, sportTeam: [], sportMatchSet: [] }] } })
                  }}
                >
                  Add Sport Match
                </Button>
              </div>
            }
            {
              this.state.tab === 3 &&
                <div>
                  {
                    JSON.stringify(this.state.sportEvent)
                  }
                </div>
            }
          </div>
        </div>
      </div>
    );
  }
}