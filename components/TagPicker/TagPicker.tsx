import { Component, FormEvent, createRef, RefObject } from "react";
import { ClickableIcon } from "../ClickableIcon/ClickableIcon";
import styles from "./TagPicker.module.css";

export interface TagPickerOption<T = any> {
  key: string;
  text: string;
  data?: T;
}

export interface TagPickerState {
  pickerValue: string;
  previewSelection: number;
}

export interface TagPickerProps {
  options: TagPickerOption[];
  selectedKeys: TagPickerOption[];
  onChange: (event: any, options?: TagPickerOption<any>[], index?: number) => void;
  width?: string;
}

export class TagPicker extends Component<TagPickerProps, TagPickerState> {
  constructor(props: TagPickerProps) {
    super(props);
    this.state = {
      pickerValue: "",
      previewSelection: 0,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount(): void {
  }

  render() {
    const getAvailableOptions = this.props.options.filter(
      (option) => !this.props.selectedKeys.find((element) => element.key === option.key)
    ).filter(
      // check if part of option.text is this.state.pickerValue
      (option) => option.text.toLowerCase().startsWith(this.state.pickerValue.toLowerCase())
    )

    return (
      <div className={styles.container} style={{width: this.props.width}}>
        {
          this.props.selectedKeys.map((element) => {
            return (
              <div className={styles.selectedElement} key={element.text}>
                <div className={styles.elementText}>
                  {element.text}
                </div>
                <div>
                  <ClickableIcon
                    iconName="Cancel"
                    fontSize="14px"
                    buttonSize="14px"
                    onClick={(event) => {
                      this.props.onChange(event, this.props.selectedKeys.filter((selectedElement) => {
                        return selectedElement.key !== element.key;
                      }))
                    }}
                  />
                </div>
              </div>
            )
          })
        }
        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            className={styles.input}
            value={this.state.pickerValue}
            onChange={(event) => { this.setState({ pickerValue: event.target.value }) }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const optionElement = this.props.options.find((option) => option.text.toLowerCase() === this.state.pickerValue.toLowerCase());
                if (optionElement && !this.props.selectedKeys.find((selectedElement) => selectedElement.key === optionElement.key)) {
                  this.props.onChange(event, [...this.props.selectedKeys, optionElement]);
                  this.setState({
                    pickerValue: "",
                    previewSelection: 0,
                  });
                } else {
                  this.setState({
                    pickerValue: "",
                    previewSelection: 0,
                  });
                }
              } else if (event.key === "Backspace" && this.state.pickerValue === "") {
                this.props.onChange(event, this.props.selectedKeys.slice(0, -1));
                this.setState({
                  previewSelection: 0
                });
              } else if (event.key === "Tab") {
                event.preventDefault();
                const options = getAvailableOptions;
                if (options.length > 0) {
                  // add first element
                  if (this.state.pickerValue !== "" && options.length >= this.state.previewSelection) {
                    this.props.onChange(event, [...this.props.selectedKeys, options[this.state.previewSelection]]);
                    this.setState({ pickerValue: "", previewSelection: 0 })
                  } else {
                    this.props.onChange(event, [...this.props.selectedKeys, options[0]]);
                    this.setState({ pickerValue: "", previewSelection: 0 })
                  }
                }
              } else if (event.key === "ArrowDown") {
                event.preventDefault();
                this.setState({ previewSelection: (this.state.previewSelection + 1) % 3 })
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                this.setState({ previewSelection: (this.state.previewSelection + 2) % 3 })
              }
            }}
          />
          {
            this.state.pickerValue !== "" &&
            <div className={styles.completion}>
              {
                // get first three elements of getAvailableOptions
                getAvailableOptions.slice(0, 3).map((option, index) => {
                  return(
                    <div 
                      key={option.text}
                      className={styles.previewItem}
                      style={index === this.state.previewSelection ? { backgroundColor: "var(--color-bg-selected)"} : {}}
                      onClick={(event) => {
                        this.props.onChange(event, [...this.props.selectedKeys, option]);
                        this.setState({
                          pickerValue: "",
                          previewSelection: 0,
                        });
                      }}
                    >
                      {option.text}
                    </div>
                  )
                })
              }
            </div>
          }
        </div>
      </div>
    )
  }
}