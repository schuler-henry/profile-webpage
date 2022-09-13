import { Component } from "react";
import { Button } from "../Button/Button";
import styles from "./ConfirmPopUp.module.css";

export interface ConfirmPopUpState {

}

export interface ConfirmPopUpProps {
  title: string;
  message?: string;
  warning?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: JSX.Element | string;
}

export class ConfirmPopUp extends Component<ConfirmPopUpProps, ConfirmPopUpState> {
  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    (document.activeElement as HTMLInputElement).blur();
  }

  render() {
    return (
      <div className={styles.popUp}>
        <div className={styles.popUpWindow}>
          <h1>
            {this.props.title}
          </h1>
          <div className={styles.messageWrapper}>
            {
              this.props.message &&
              <p id={styles.message} className={styles.wrapperItem}>
                {this.props.message}
              </p>
            }
            {
              this.props.warning &&
              <p id={styles.warning} className={styles.wrapperItem}>
                {this.props.warning}
              </p>
            }
            {
              this.props.children && 
              <div className={styles.wrapperItem}>
                {this.props.children}
              </div>
            }
          </div>
          <div className={styles.buttonContainer}>
            {
              this.props.onConfirm &&
                <Button onClick={this.props.onConfirm}>
                  Confirm
                </Button>
            }
            {
              this.props.onCancel &&
                <Button onClick={this.props.onCancel}>
                  Cancel
                </Button>
            }
          </div>
        </div>
      </div>
    );
  }
}