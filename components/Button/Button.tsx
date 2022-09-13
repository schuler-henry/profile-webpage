import { Component } from "react";
import styles from "./Button.module.css";

export interface ButtonState {

}

export interface ButtonProps {
  children: JSX.Element | string;
  href?: string;
  onClick?: (event: React.MouseEvent<any>) => void;
  width?: string;
}

export class Button extends Component<ButtonProps, ButtonState> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <a href={this.props.href} className={styles.button} onClick={this.props.onClick} style={{ width: this.props.width}}>
        <span>
          {this.props.children}
        </span>
      </a>
    );
  }
}