import { Component } from "react";
import styles from './Timer.module.css'
import { ITimer } from "../../interfaces/database";
import { secondsToFormattedTimeString } from "../../shared/secondsToFormattedTimeString";
import { FrontEndController } from "../../controller/frontEndController";
import { getTheme, Icon } from "@fluentui/react";
import { ConfirmPopUp } from "../ConfirmPopUp/ConfirmPopUp";
import { PWPLanguageContext } from "../PWPLanguageProvider/PWPLanguageProvider";
import { ClickableIcon } from "../ClickableIcon/ClickableIcon";

export interface TimerState {
  timer: ITimer | undefined;
  timerValue: number;
  sync: boolean;
  update: boolean;
  showDeleteConfirmation: boolean;
  showDiscardCurrentTimerConfirmation: boolean;
  addTime: boolean;
  addHours: number;
  addMinutes: number;
  addSeconds: number;
}

export interface TimerProps {
  timer: ITimer;
}

export class Timer extends Component<TimerProps, TimerState> {
  constructor(props: TimerProps) {
    super(props)
    this.state = {
      timer: this.props.timer,
      timerValue: 0,
      sync: false,
      update: false,
      showDeleteConfirmation: false,
      showDiscardCurrentTimerConfirmation: false,
      addTime: false,
      addHours: 0,
      addMinutes: 0,
      addSeconds: 0,
    }
  }

  private interval;
  private changeFocus = () => {
    this.syncTimer();
  };

  componentDidMount() {
    if (this.state.timer.startTime !== null) {
      this.setState({ timerValue: Math.floor((new Date().getTime() - new Date(this.state.timer.startTime).getTime()) / 1000) })
      this.interval = setInterval(() => {
        this.setState({ timerValue: this.state.timerValue + 1 })
      }, 1000)
    }
    window.addEventListener('focus', this.changeFocus)
  }

  componentDidUpdate(prevProps: Readonly<TimerProps>, prevState: Readonly<TimerState>, snapshot?: any): void {
    if (prevProps.timer !== this.props.timer) {
      this.setState({ timer: this.props.timer })
      this.syncTimer();
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('focus', this.changeFocus)
    clearInterval(this.interval)
  }

  private async syncTimer() {
    this.setState({ sync: true })
    this.setState({ timer: (await FrontEndController.getTimers(FrontEndController.getUserToken())).find(timer => timer.id === this.state.timer.id) });
    clearInterval(this.interval)
    if (this.state.timer !== undefined && this.state.timer.startTime !== null) {
      this.setState({ timerValue: Math.floor((new Date().getTime() - new Date(this.state.timer.startTime).getTime()) / 1000) })
      this.interval = setInterval(() => {
        this.setState({ timerValue: this.state.timerValue + 1 })
      }, 1000)
    } else {
      this.setState({ timerValue: 0 })
    }
    this.setState({ sync: false })
  }

  private async updateTimer() {
    this.setState({ update: true });
    await this.syncTimer();
    if (this.state.timer !== undefined) {
      if (this.state.timer.startTime === null) {
        // No timer running -> start timer
        this.interval = setInterval(() => {
          this.setState({ timerValue: this.state.timerValue + 1 })
        }, 1000)
        this.state.timer.startTime = new Date();
      } else {
        // Timer running -> stop timer
        clearInterval(this.interval)
        this.state.timer.elapsedSeconds += this.state.timerValue;
        this.setState({ timerValue: 0 })
        this.state.timer.startTime = null
      }
  
      await FrontEndController.updateTimer(FrontEndController.getUserToken(), this.state.timer);
    }
    this.setState({ update: false })
  }

  private async manualAddTime() {
    await this.syncTimer();
    if (this.state.timer !== undefined) {
      const timer = structuredClone(this.state.timer)
      timer.elapsedSeconds += this.state.addHours * 3600 + this.state.addMinutes * 60 + this.state.addSeconds;
      await FrontEndController.updateTimer(FrontEndController.getUserToken(), timer);
      await this.syncTimer();
    }
  }

  private async discardCurrentTimer() {
    this.setState({ update: true })
    await this.syncTimer();
    if (this.state.timer !== undefined) {
      if (this.state.timer.startTime !== null) {
        clearInterval(this.interval)
        this.setState({ timerValue: 0 })
        this.state.timer.startTime = null;
        await FrontEndController.updateTimer(FrontEndController.getUserToken(), this.state.timer);
      }
    }
    this.setState({ update: false })
  }

  render() {
    if (this.state.timer !== undefined) {
      return(
        <PWPLanguageContext.Consumer>
          { LanguageContext => (
            <div className={styles.timerItem}>
              <div className={styles.header}>
                <h3>
                  {this.state.timer.name}
                </h3>
                <div className={styles.deleteButton} onClick={() => {
                  this.setState({ showDeleteConfirmation: true })
                }}>
                  <Icon
                    iconName="Delete"
                    className={styles.deleteIcon}
                  />
                </div>
                {
                  this.state.showDeleteConfirmation && <ConfirmPopUp 
                    title="Confirm Delete" 
                    message={`Do you really want to delete timer \"${this.state.timer.name}\" with time ${secondsToFormattedTimeString(this.state.timer.elapsedSeconds)}?`}
                    warning="This action cannot be undone!" 
                    onCancel={() => { 
                      this.setState({ showDeleteConfirmation: false }) 
                    }} 
                    onConfirm={async () => {
                      await FrontEndController.deleteTimer(FrontEndController.getUserToken(), this.state.timer.id);
                      this.setState({ showDeleteConfirmation: false, timer: undefined })
                    }} 
                  />
                }
                <div className={styles.syncButton} onClick={() => {
                  this.syncTimer()
                }}>
                  <Icon 
                    iconName="Sync"
                    className={`${styles.syncIcon} ${this.state.sync ? styles.spinnerAnimation : ""}`}
                  />
                </div>
              </div>
              <div className={styles.elapsedTime}>
                <p>
                  { LanguageContext.t('timer:totalTime') }:&nbsp; 
                  <span>
                    {secondsToFormattedTimeString(this.state.timer.elapsedSeconds)}
                  </span>
                </p>
                <div className={styles.addButton}>
                  <ClickableIcon 
                    iconName="Add"
                    onClick={() => {
                      this.setState({ addTime: true })
                    }}
                  />
                </div>
              </div>
              <div className={styles.currentWorkTime}>
                <p>
                  { LanguageContext.t('timer:currentTime') }:&nbsp;
                  <span>
                    {secondsToFormattedTimeString(this.state.timerValue)}
                  </span>
                </p>
                <div className={styles.control}>
                  <div className={this.state.timer.startTime === null ? "invisible" : styles.startButton} onClick={() => {
                    this.setState({ showDiscardCurrentTimerConfirmation: true })
                  }}>
                    <Icon
                      iconName="Delete"
                      className={styles.startIcon}
                    />
                  </div>
                  {
                    this.state.showDiscardCurrentTimerConfirmation && <ConfirmPopUp 
                    title="Confirm Discard" 
                    message={`Do you really want to discard the running timer of \"${this.state.timer.name}\" with time ${secondsToFormattedTimeString(this.state.timerValue)}?`}
                    warning="This action cannot be undone!" 
                    onCancel={() => { 
                      this.setState({ showDiscardCurrentTimerConfirmation: false }) 
                    }} 
                    onConfirm={async () => {
                      await this.discardCurrentTimer()
                      this.setState({ showDiscardCurrentTimerConfirmation: false })
                    }} 
                  />
                  }
                  <div className={styles.startButton} onClick={() => {
                    this.state.update ? null : this.updateTimer()
                  }}>
                    {
                      this.state.update ?
                        <Icon
                          iconName="Sync"
                          className={`${styles.startIcon} ${styles.spinnerAnimation}`}
                        />
                        :
                        this.state.timer.startTime === null ?
                          <Icon 
                            iconName="Play"
                            className={styles.startIcon}
                          />
                          :
                          <Icon
                            iconName="Stop"
                            className={styles.startIcon}
                          />
                    }
                  </div>
                </div>
              </div>
              {
                this.state.addTime &&
                  <ConfirmPopUp
                    title={"Add Time"}
                    onConfirm={async () => {
                      this.setState({ update: true })
                      await this.manualAddTime();
                      this.setState({ addTime: false, addHours: 0, addMinutes: 0, addSeconds: 0, update: false })
                    }}
                    onCancel={() => {
                      this.setState({ addTime: false, addHours: 0, addMinutes: 0, addSeconds: 0 })
                    }}
                    sync={this.state.update}
                  >
                    <div>
                      <div className={styles.addTime}>
                        <div className={styles.inputWrapper}>
                          <h1>{LanguageContext.t('common:Hours')}</h1>
                          <input 
                            type="number"
                            min={0}
                            value={this.state.addHours}
                            onChange={(e) => { this.setState({ addHours: Number(e.target.value) }) }}
                          />
                        </div>
                        <div className={styles.inputWrapper}>
                          <h1>{LanguageContext.t('common:Minutes')}</h1>
                          <input 
                            type="number"
                            min={0}
                            max={60}
                            value={this.state.addMinutes}
                            onChange={(e) => { this.setState({ addMinutes: Number(e.target.value) > 60 ? 60 : Number(e.target.value) }) }}
                          />
                        </div>
                        <div className={styles.inputWrapper}>
                          <h1>{LanguageContext.t('common:Seconds')}</h1>
                          <input 
                            type="number"
                            min={0}
                            max={60}
                            value={this.state.addSeconds}
                            onChange={(e) => { this.setState({ addSeconds: Number(e.target.value) > 60 ? 60 : Number(e.target.value) }) }}
                          />
                        </div>
                      </div>
                      <p className={styles.addTimeChanges}>
                        {secondsToFormattedTimeString(this.state.timer.elapsedSeconds)} &rarr; {secondsToFormattedTimeString(this.state.timer.elapsedSeconds + this.state.addHours * 3600 + this.state.addMinutes * 60 + this.state.addSeconds)}
                      </p>
                    </div>
                  </ConfirmPopUp>
              }
            </div>
          )}
        </PWPLanguageContext.Consumer>
      )
    } else {
      return (
        <>
        </>
      )
    }
  }
}