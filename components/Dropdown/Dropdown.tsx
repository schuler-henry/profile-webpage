import { Component, FormEvent } from "react";
import styles from "./Dropdown.module.css";

export interface DropdownOption<T = any> {
  key: string;
  text: string;
  data?: T;
}

export interface DropdownState {

}

export interface DropdownProps {
  id: string;
  options: DropdownOption[];
  selectedKey?: string;
  onChange: (event: FormEvent<HTMLDivElement>, option?: DropdownOption<any>, index?: number) => void;
  onRenderOption: (option: DropdownOption) => JSX.Element;
  onRenderCaretDown: () => JSX.Element;
}

export class Dropdown extends Component<DropdownProps, DropdownState> {
  componentDidMount() {
    window.onclick = (event) => {
      event.preventDefault();
      // console.log(event.path.find(element => element.id?.toString().includes("PWPDropdown"))?.id);
      // Search for dropdown in click path -> get ID
      let dropdownID: string = event.path.find(element => element.id?.toString().includes("PWPDropdown"))?.id;
      // If dropdown was clicked -> ID could be returned, evaluate ID of dropdown list
      let dropdownItemID: string = undefined;
      if (dropdownID) dropdownItemID = dropdownID.substring(0, 11) + "List" + dropdownID.substring(11);
      // Select every optionList element except the one that was potentially clicked
      document.querySelectorAll(`.${styles.optionList}:not(#${dropdownItemID})`).forEach((dropdown,i) => {
        // console.log(dropdown.classList);
        // console.log(dropdownItemID)
        // Check for all elements if they are currently shown, if true -> hide them
        if(dropdown.classList.contains(`${styles.show}`)) {
          dropdown.classList.remove(`${styles.show}`);
        }
      });
    }
  }
  render() {

    const optionDivs = this.props.options.map((option: DropdownOption, idx) => {
      return(
        <div 
          key={option.key} 
          className={`${styles.option} ${this.props.selectedKey === option.key ? styles.selected : null}`}
          onClick={(event) => this.props?.onChange(event, option, idx)}
        >
          <div className={styles.content}>
            {this.props.onRenderOption(option)}
          </div>
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
          id={"PWPDropdown" + this.props.id}
          onClick={() => {
            document.getElementById("PWPDropdownList" + this.props.id).classList.toggle(`${styles.show}`);
          }}>
          <span className={styles.content}>
            {this.props.onRenderOption(selectedOption)}
          </span>
          <span className={styles.arrow}>
            {/* <Icon iconName="ChevronDown" /> */}
            {this.props.onRenderCaretDown()}
          </span>
        </div>
        <div className={styles.optionList} id={"PWPDropdownList" + this.props.id}>
          {optionDivs}
        </div>
      </div>
    )
  }
}