import { Icon, optionProperties } from "@fluentui/react";
import { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import { Component } from "react";
import styles from "./Dropdown.module.css";

export interface DropdownOption<T = any> {
  key: string;
  text: string;
  data?: T;
}

export interface DropdownState {

}

export interface DropdownProps extends WithRouterProps {
  i18n: any;
  options: DropdownOption[];
  selectedKey?: string;
}

export class Dropdown extends Component<DropdownProps, DropdownState> {
  componentDidMount() {
    window.onclick = (event) => {
      event.preventDefault();
      if (event.path.find(element => element.classList?.contains(`${styles.dropdown}`)) === undefined) {
        let dropdown = document.getElementById(`${styles.dropdown}`);
        if(dropdown.classList.contains(`${styles.show}`)) {
          dropdown.classList.remove(`${styles.show}`);
        }
      }
    }
  }
  render() {

    const optionDivs = this.props.options.map((option: DropdownOption) => {
      return(
        <div key={option.key} className={styles.option}>
          <span className={styles.content}>
            <span className={styles.icon}>
              <Icon iconName={option.data.icon} />
            </span>
            <span>
              {option.text}
            </span>
          </span>
        </div>
      )
    });

    let selectedOption: DropdownOption = this.props.options.find(option => option.key === this.props.selectedKey);
    if (selectedOption === undefined) {
      selectedOption = this.props.options[0];
    }

    return (
      <div className={styles.dropdownContainer}>
        <div 
          className={styles.dropdown}
          onClick={() => {
            document.getElementById(`${styles.dropdown}`).classList.toggle(`${styles.show}`);
          }}>
          <span className={styles.content}>
            <span className={styles.icon}>
              <Icon iconName={selectedOption.data.icon} />
            </span>
            <span>
              {selectedOption.text}
            </span>
          </span>
          <span className={styles.arrow}>
            <Icon iconName="ChevronDown" />
          </span>
        </div>
        <div className={styles.optionList} id={styles.dropdown}>
          {optionDivs}
        </div>
      </div>
    )
  }
}