import { Component } from "react";
import { Button } from "../Button/Button";
import styles from "./ConfirmPopUp.module.css";

export interface ConfirmPopUpState {

}

export interface ConfirmPopUpProps {
  title: string;
  message?: string;
  warning?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export class ConfirmPopUp extends Component<ConfirmPopUpProps, ConfirmPopUpState> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.popUp}>
        <div className={styles.popUpWindow}>
          <h1>
            {this.props.title}
          </h1>
          <p id={styles.message}>
            {this.props.message}
          </p>
          <p id={styles.warning}>
            {this.props.warning}
          </p>
          <div className={styles.buttonContainer}>
            <Button onClick={this.props.onConfirm}>
              Confirm
            </Button>
            <Button onClick={this.props.onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}