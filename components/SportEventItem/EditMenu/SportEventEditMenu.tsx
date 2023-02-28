import { Component } from "react";
import styles from "./SportEventEditMenu.module.css";
import { ISport, ISportClub, ISportEvent, ISportEventType, ISportLocation } from "../../../interfaces/database";
import { PWPLanguageContext, PWPLanguageContextType } from "../../PWPLanguageProvider/PWPLanguageProvider";
import React from "react";
import { Dropdown, DropdownOption } from "../../Dropdown/Dropdown";
import { FrontEndController } from "../../../controller/frontEndController";
import { Icon } from "@fluentui/react";
import { TagPicker } from "../../TagPicker/TagPicker";
import { SportEventVisibility } from "../../../enums/sportEventVisibility";
import { ClickableIcon } from "../../ClickableIcon/ClickableIcon";
import { ConfirmPopUp } from "../../ConfirmPopUp/ConfirmPopUp";

const onRenderOption = (option: DropdownOption, LanguageContext?: PWPLanguageContextType): JSX.Element => {
  return(
    <div style={{ width: "100%", display: "flex"}}>
      {
        option?.data?.icon &&
        <span style={{ display: "flex", alignItems: "center" }}>
          <Icon style={{ display: "flex", marginRight: '8px', fontSize: "15px", height: "15px" }} iconName={option.data.icon} />
        </span>
      }
      <span>
        {
          LanguageContext ? 
            LanguageContext.t("sport:" + option?.text.replaceAll(" ", ""))
            :
            option?.text
        }
      </span>
    </div>
  )
}

const onRenderCaretDown = (): JSX.Element => {
  return(
    <Icon iconName="ChevronDown" style={{ display: "flex" }} />
  )
}

export interface SportEventEditMenuState {
  sportEvent: ISportEvent;
  availableSports: ISport[];
  availableSportEventTypes: ISportEventType[];
  availableSportClubs: ISportClub[];
  availableSportLocations: ISportLocation[];
  confirmCancel: boolean;
  confirmSave: boolean;
}

export interface SportEventEditMenuProps {
  sportEvent: ISportEvent;
  hidden?: boolean;
  className?: string;
  onSave?: (sportEvent: ISportEvent) => void;
  onChange?: (sportEvent: ISportEvent) => void;
  onCancel?: () => void;
}

export class SportEventEditMenu extends Component<SportEventEditMenuProps, SportEventEditMenuState> {
  constructor(props: SportEventEditMenuProps) {
    super(props);
    this.state = {
      sportEvent: this.props.sportEvent,
      availableSports: [],
      availableSportEventTypes: [],
      availableSportClubs: [],
      availableSportLocations: [],
      confirmCancel: false,
      confirmSave: false,
    };
  }

  async componentDidMount() {
    this.setState({ 
      availableSports: await FrontEndController.getAllSports(FrontEndController.getUserToken()),
      availableSportEventTypes: await FrontEndController.getAllSportEventTypes(FrontEndController.getUserToken()),
      availableSportClubs: await FrontEndController.getSportClubs(FrontEndController.getUserToken()),
      availableSportLocations: await FrontEndController.getAllSportLocations(FrontEndController.getUserToken()),
    });
  }

  componentDidUpdate(prevProps: Readonly<SportEventEditMenuProps>, prevState: Readonly<SportEventEditMenuState>, snapshot?: any): void {
    if (this.state.sportEvent !== prevState.sportEvent) {
      this.props.onChange(this.state.sportEvent);
    }
    if (this.props.hidden !== prevProps.hidden) {
      this.setState({ sportEvent: this.props.sportEvent });
    }
  }

  componentWillUnmount(): void {
  }

  private didSportEventChange(): boolean {
    return JSON.stringify(this.props.sportEvent) !== JSON.stringify(this.state.sportEvent);
  }

  private visibilityOptions: DropdownOption[] = [
    { key: SportEventVisibility.creatorOnly.toString(), text: "0 Creator (Private)"},
    { key: SportEventVisibility.creatorMembers.toString(), text: "1 Creator + Member"},
    { key: SportEventVisibility.creatorMemberClubSportMember.toString(), text: "2 Creator + Member + Sport Member (Club)"},
    { key: SportEventVisibility.creatorMemberClubMember.toString(), text: "3 Creator + Member + Club Member"},
    { key: SportEventVisibility.public.toString(), text: "4 Everyone (Public)"},
  ]

  render() {
    return (
      <PWPLanguageContext.Consumer>
        { LanguageContext => (
          <div
            className={`${styles.wrapper} ${this.props.className}`}
            style={{ display: this.props.hidden && "none", borderColor: this.didSportEventChange() ? "var(--color-border-changed)" : "var(--color-border-approved)" }}
            hidden={this.props.hidden}
          >
            <h2>
              {LanguageContext.t("sport:Sport")}
            </h2>
            <Dropdown 
              options={
                this.state.availableSports?.reduce((returnValue: [], item, index) => returnValue.concat(Object.assign({ key: item.id.toString(), text: LanguageContext.t("sport:" + item.name) })), []) || []
              }
              placeholder={{ key: "", text: "undefined" }}
              onRenderOption={onRenderOption}
              onRenderCaretDown={onRenderCaretDown}
              selectedKey={this.state.sportEvent?.sport?.id?.toString()}
              onChange={(event, option) => {
                this.setState({ sportEvent: { ...this.state.sportEvent, sport: this.state.availableSports.find(item => item.id.toString() === option.key)} });
              }}
              width="100%"
            />
            
            <h2>
              {LanguageContext.t("sport:SportEventType")}
            </h2>
            <Dropdown 
              options={
                this.state.availableSportEventTypes?.reduce((returnValue: [], item, index) => returnValue.concat(Object.assign({ key: item.id.toString(), text: LanguageContext.t("sport:" + item.name) })), []) || []
              }
              placeholder={{ key: "", text: LanguageContext.t("sport:SportEventType") }}
              onRenderOption={onRenderOption}
              onRenderCaretDown={onRenderCaretDown}
              selectedKey={this.state.sportEvent?.sportEventType?.id?.toString()}
              onChange={(event, option) => {
                this.setState({ sportEvent: {...this.state.sportEvent, sportEventType: this.state.availableSportEventTypes?.find(item => item.id.toString() === option.key)} })
              }}
              width="100%"
            />

            <h2>
              {LanguageContext.t("sport:StartTime")}
            </h2>
            <input 
              type="datetime-local"  
              className={styles.timeInput}
              value={this.state.sportEvent.startTime && new Date(new Date(this.state.sportEvent.startTime).getTime() - new Date(this.state.sportEvent.startTime).getTimezoneOffset() * 60000).toISOString().slice(0, -8)}
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

            <h2>
              {LanguageContext.t("sport:EndTime")}
            </h2>
            <input 
              type="datetime-local" 
              className={styles.timeInput}
              value={this.state.sportEvent.endTime && new Date(new Date(this.state.sportEvent.endTime).getTime() - new Date(this.state.sportEvent.endTime).getTimezoneOffset() * 60000).toISOString().slice(0, -8)}
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

            <h2>
              {LanguageContext.t("sport:SportClubs")}
            </h2>
            <TagPicker
              selectedKeys={this.state.sportEvent?.sportClubs?.reduce((returnValue: [], item, index) => returnValue.concat(Object.assign({ key: item.sportClub.id.toString(), text: item.sportClub?.name })), []) || []}
              onChange={(event, options) => {
                this.setState({ sportEvent: {...this.state.sportEvent, sportClubs: options.map((option, index) => ({ sportClub: this.state.availableSportClubs.find(item => item.id.toString() === option.key), host: index === 0 }))} })
              }}
              options={
                this.state.availableSportClubs.reduce((returnValue: [], item, index) => returnValue.concat(Object.assign({ key: item.id.toString(), text: item.name })), []) || []
              }
              contains         
            />

            <h2>
              {LanguageContext.t("sport:Description")}
            </h2>
            <textarea 
              className={styles.description}
              value={this.state.sportEvent?.description}
              onChange={(event) => {
                this.setState({ sportEvent: {...this.state.sportEvent, description: event.target.value} })
              }}
            />

            <h2>
              {LanguageContext.t("sport:SportLocation")}
            </h2>
            <Dropdown
              options={
                this.state.availableSportLocations?.sort(
                  (a) => { 
                    // if a is in this.state.sportEvent.sportClubs[0].sportClub.sportLocation then set a to top
                    return this.state.sportEvent?.sportClubs[0]?.sportClub?.sportLocation?.find(item => item.id === a.id) ? -1 : 1
                    }
                ).reduce(
                  (returnValue: [], item, index) => returnValue.concat(Object.assign({ key: item.id.toString(), text: item?.name + " " + item?.address })), []
                ) || []
              }
              placeholder={{ key: "", text: LanguageContext.t("sport:SportLocation") }}
              onRenderOption={onRenderOption}
              onRenderCaretDown={onRenderCaretDown}
              selectedKey={this.state.sportEvent?.sportLocation?.id?.toString()}
              onChange={(event, option) => {
                this.setState({ sportEvent: {...this.state.sportEvent, sportLocation: this.state.availableSportLocations.find(item => item.id.toString() === option.key)} })
              }}
              width="100%"
            />

            <h2>
              {LanguageContext.t("sport:Visibility")}
            </h2>
            <Dropdown 
              options={ this.visibilityOptions }
              onRenderOption={option => onRenderOption(option, LanguageContext)}
              onRenderCaretDown={onRenderCaretDown}
              selectedKey={this.state.sportEvent.visibility.toString()}
              onChange={(event, option) => {
                this.setState({ sportEvent: {...this.state.sportEvent, visibility: parseInt(option.key)} })
              }}
              width="100%"
            />

            <div className={styles.controlButtonWrapper}>
              <ClickableIcon
                iconName="Cancel"
                onClick={() => {
                  this.didSportEventChange() ? this.setState({ confirmCancel: true }) : this.props.onCancel();
                }}
              />
              {
                this.didSportEventChange() &&
                <ClickableIcon
                  iconName="Save"
                  onClick={() => {
                    this.setState({ confirmSave: true })
                  }}
                />
              }
            </div>
            {
              this.state.confirmSave &&
              <ConfirmPopUp 
                title={LanguageContext.t("sport:SaveSportEvent")}
                message={LanguageContext.t("sport:SaveSportEventMessage")}
                onConfirm={() => {
                  this.props.onSave(this.state.sportEvent);
                  this.setState({ confirmSave: false });
                }}
                onCancel={() => {
                  this.setState({ confirmSave: false });
                }}
              />
            }
            {
              this.state.confirmCancel &&
              <ConfirmPopUp
                title={LanguageContext.t("sport:CancelSportEvent")}
                message={LanguageContext.t("sport:CancelSportEventMessage")}
                onConfirm={() => {
                  this.props.onCancel();
                  this.setState({ confirmCancel: false });
                }}
                onCancel={() => {
                  this.setState({ confirmCancel: false });
                }}
              />
            }
          </div>
        )}
        </PWPLanguageContext.Consumer>
      );
    }
}