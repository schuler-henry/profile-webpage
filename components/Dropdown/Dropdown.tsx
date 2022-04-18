import { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import { Component } from "react";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import styles from "./Dropdown.module.css";

export interface DropdownState {

}

export interface DropdownProps extends WithRouterProps {
  i18n: any;
}

export class Dropdown extends Component<DropdownProps, DropdownState> {
  render() {
    return (
      <div className={styles.dropdown}>
        <button>DROPDOWN_BUTTON_TEXT</button>
        <div className={styles.dropdownContent}>
          <Link href={""}>Hallo</Link>
          <Link href={""}>Test</Link>
          <Link href={""}>hallo</Link>
        </div>
        <LanguageSwitcher path={"/"} i18n={this.props.i18n} router={this.props.router}></LanguageSwitcher>
      </div>
    )
  }
}