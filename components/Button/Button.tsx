import { Component } from "react";
import styles from "./Button.module.css";

export interface ButtonState {

}

export interface ButtonProps {
  children: JSX.Element | string;
  href?: string;
  onClick?: (event: React.MouseEvent<any>) => void;
  width?: string;
  disabled?: boolean;
}

export class Button extends Component<ButtonProps, ButtonState> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <a 
        href={!this.props.disabled ? this.props.href : undefined} 
        className={`${styles.button} ${this.props.disabled && styles.disabled}`} 
        onClick={!this.props.disabled ? this.props.onClick : undefined} 
        style={{ width: this.props.width}}
      >
        <span>
          {this.props.children}
        </span>
      </a>
    );
  }
}