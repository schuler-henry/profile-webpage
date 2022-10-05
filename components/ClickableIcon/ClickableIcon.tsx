import { Icon } from "@fluentui/react";
import { Component, MouseEventHandler } from "react";
import styles from "./ClickableIcon.module.css";

export interface ClickableIconState {

}

export interface ClickableIconProps {
  iconName: string;
  onClick?: MouseEventHandler | undefined;
  buttonSize?: string;
  fontSize?: string;
  color?: string;
  spin?: boolean;
}

export class ClickableIcon extends Component<ClickableIconProps, ClickableIconState> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div 
        className={styles.button} 
        onClick={this.props.onClick}
        style={{ width: this.props.buttonSize, height: this.props.buttonSize }}
      >
        <Icon
          className={`${styles.icon} ${this.props.spin ? styles.spinnerAnimation : null}`}
          iconName={this.props.iconName}
          style={{ fontSize: this.props.fontSize, color: this.props.color }}
        />
      </div>
    );
  }
}