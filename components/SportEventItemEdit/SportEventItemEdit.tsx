import React, { Component } from "react";
import sportEventItemStyles from "../SportEventItem/SportEventItem.module.css";
import styles from "./SportEventItemEdit.module.css";
import { ISport, ISportClub, ISportEvent, ISportEventType } from '../../interfaces/database'
import { dateStringToFormattedDateString } from "../../shared/dateStringToFormattedDateString";
import { dateStringToFormattedTimeString } from "../../shared/dateStringToFormattedTimeString";
import { Icon } from "@fluentui/react";
import { SportMatchItem } from "../SportMatchItem/SportMatchItem";
import { FrontEndController } from "../../controller/frontEndController";
import { Dropdown, DropdownOption } from "../Dropdown/Dropdown";
import { SportEventVisibility } from "../../enums/sportEventVisibility";
import { TagPicker } from "../TagPicker/TagPicker";
// TODO: Replace all fileds with inputs

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
  sportEvent: ISportEvent;
  tab: number;
}

export interface SportEventItemEditProps {
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
    }
  }

  async componentDidMount() {
    this.setState({ 
      availableSports: await FrontEndController.getAllSports(FrontEndController.getUserToken()), 
      availableSportEventTypes: await FrontEndController.getAllSportEventTypes(FrontEndController.getUserToken()),
      availableSportClubs: await FrontEndController.getSportClubs(FrontEndController.getUserToken()),
    });
  }

  tabs = ["Left", "Right", "Content", "JSON"]

  selectTab(id: number) {
    this.setState({ tab: id });
  }

  render() {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column"}}>
        <div className={sportEventItemStyles.preview}>
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
                // TODO: Add selector for sport clubs
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
          </div>
        </div>
        <div className={styles.content}>
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
                    onChange={(event) => {
                      this.setState({ sportEvent: {...this.state.sportEvent, startTime: new Date(event.target.value)} })
                    }}
                  />
                  <h2 className={styles.sport}>
                    End Time
                  </h2>
                  <input 
                    type="datetime-local" 
                    className={styles.timeInput}
                    onChange={(event) => {
                      this.setState({ sportEvent: {...this.state.sportEvent, endTime: new Date(event.target.value)} })
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
                {
                  this.state.sportEvent.sportClubs.length > 0 &&
                    <>
                      <h2>
                        Sport Location
                      </h2>
                      <Dropdown
                        options={
                          this.state.sportEvent.sportClubs[0].sportClub.sportLocation.reduce((returnValue: [], item, index) => returnValue.concat(Object.assign({ key: item.id.toString(), text: item.name + " " + item.address })), []) || []
                        }
                        placeholder={{ key: "", text: "sport location" }}
                        onRenderOption={onRenderOption}
                        onRenderCaretDown={onRenderCaretDown}
                        selectedKey={this.state.sportEvent.sportLocation?.id.toString()}
                        onChange={(event, option) => {
                          this.setState({ sportEvent: {...this.state.sportEvent, sportLocation: this.state.sportEvent.sportClubs[0].sportClub.sportLocation.find(item => item.id.toString() === option.key)} })
                        }}
                        width="100%"
                      />
                    </>
                }
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