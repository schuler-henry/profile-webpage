import { Component } from "react";
import styles from './Timer.module.css'
import { ITimer } from "../../interfaces";
import { Button } from "../Button/Button";
import { secondsToFormattedTimeString } from "../../shared/secondsToFormattedTimeString";
import { FrontEndController } from "../../controller/frontEndController";
import { Icon } from "@fluentui/react";
import { ConfirmPopUp } from "../ConfirmPopUp/ConfirmPopUp";

export interface TimerState {
  timer: ITimer | undefined;
  timerValue: number;
  update: boolean;
  showDeleteConfirmation: boolean;
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
      update: false,
      showDeleteConfirmation: false,
    }
  }

  private interval;

  componentDidMount() {
    if (this.state.timer.startTime !== null) {
      this.setState({ timerValue: Math.floor((new Date().getTime() - new Date(this.state.timer.startTime).getTime()) / 1000) })
      this.interval = setInterval(() => {
        this.setState({ timerValue: this.state.timerValue + 1 })
      }, 1000)
    }
  }

  private async syncTimer() {
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

  render() {
    if (this.state.timer !== undefined) {
      return(
        <div className={styles.timerItem}>
          <div className={styles.header}>
            <h3>
              Timer: {this.state.timer.name}
            </h3>
            <div className={styles.fetchButton}>
              <Button onClick={async () => {this.syncTimer()}}>
                sync
              </Button>
            </div>
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
                title="Confirm delete" 
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
          </div>
          <div className={styles.elapsedTime}>
            <p>
              Total workload:&nbsp; 
              <span>
                {secondsToFormattedTimeString(this.state.timer.elapsedSeconds)}
              </span>
            </p>
          </div>
          <div className={styles.currentWorkTime}>
            <p>
              Current working for:&nbsp;
              <span>
                {secondsToFormattedTimeString(this.state.timerValue)}
              </span>
            </p>
            <div className={styles.control}>
              <Button onClick={() => {this.state.update ? null : this.updateTimer()}}>
                <>
                  <div className={styles.buttonSize}>Start</div>
                  {this.state.update ? "..." : this.state.timer.startTime === null ? "Start" : "Stop"}
                </>
              </Button>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <>
        </>
      )
    }
  }
}