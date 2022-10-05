import { Icon } from "@fluentui/react";
import { Component } from "react";
import { Button } from "../Button/Button";
import { PWPLanguageContext } from "../PWPLanguageProvider/PWPLanguageProvider";
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
  sync?: boolean;
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
      <PWPLanguageContext.Consumer>
        { LanguageContext => (
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
                  this.props.sync ?
                    <div className={styles.iconWrapper}>
                      <Icon
                        iconName="Sync"
                        className={`${styles.spinnerAnimation} ${styles.icon}`}
                      />
                    </div>
                    :
                    this.props.children && 
                    <div className={styles.wrapperItem} id={styles.children}>
                      {this.props.children}
                    </div>
                }
              </div>
              <div className={styles.buttonContainer}>
                {
                  this.props.onConfirm &&
                    <Button onClick={this.props.onConfirm}>
                      {LanguageContext.t('common:Confirm')}
                    </Button>
                }
                {
                  this.props.onCancel &&
                    <Button onClick={this.props.onCancel}>
                      {LanguageContext.t('common:Cancel')}
                    </Button>
                }
              </div>
            </div>
          </div>
        )}
      </PWPLanguageContext.Consumer>
    );
  }
}