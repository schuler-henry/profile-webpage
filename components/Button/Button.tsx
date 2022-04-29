import { Component, createRef, forwardRef, RefObject } from "react";
import styles from "./Button.module.css";

export interface ButtonState {

}

export interface ButtonProps {
  children: JSX.Element | string;
  href?: string;
  onClick?: (event: React.MouseEvent<any>) => void;
}

export class Button extends Component<ButtonProps, ButtonState> {
  newRef;
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <a href={this.props.href} className={styles.button} onClick={this.props.onClick}>
        <span>
          {this.props.children}
        </span>
      </a>
    );
  }
}