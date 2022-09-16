import { Component, FormEvent, createRef, RefObject } from "react";
import styles from "./Dropdown.module.css";

export interface DropdownOption<T = any> {
  key: string;
  text: string;
  data?: T;
}

export interface DropdownState {
  showDropDown: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  selectedKey?: string;
  onChange: (event: FormEvent<HTMLDivElement>, option?: DropdownOption<any>, index?: number) => void;
  onRenderOption: (option: DropdownOption) => JSX.Element;
  onRenderCaretDown: () => JSX.Element;
  width?: string;
}

export class Dropdown extends Component<DropdownProps, DropdownState> {
  constructor(props: DropdownProps) {
    super(props);
    this.DROPDOWN = createRef();
    this.state = {
      showDropDown: false,
    };
  }

  private DROPDOWN: RefObject<HTMLDivElement>

  componentDidMount() {
    window.addEventListener("click", this.hideDropdown);
  }

  componentWillUnmount(): void {
    window.removeEventListener("click", this.hideDropdown)
  }

  hideDropdown = (event) => {
    if (this.state.showDropDown && this.DROPDOWN.current && !this.DROPDOWN.current.contains(event.target)) {
      this.setState({showDropDown: false});
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
      <div className={styles.dropdownContainer} style={{width: this.props.width}}>
        <div 
          className={styles.dropdown}
          style={{width: this.props.width}}
          ref={this.DROPDOWN}
          onClick={() => {
            this.setState({showDropDown: !this.state.showDropDown})
          }}>
          <span className={styles.content}>
            {this.props.onRenderOption(selectedOption)}
          </span>
          <span className={styles.arrow}>
            {/* <Icon iconName="ChevronDown" /> */}
            {this.props.onRenderCaretDown()}
          </span>
        </div>
        {
          this.state.showDropDown &&
            <div className={styles.optionList}>
              {optionDivs}
            </div>
        }
      </div>
    )
  }
}