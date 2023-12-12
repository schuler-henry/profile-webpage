import { Component, createRef, RefObject } from "react";
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
  inputFocus: boolean;
  containerOffsetTop: number;
  containerClientHeight: number;
}

export interface TagPickerProps {
  options: TagPickerOption[];
  selectedKeys: TagPickerOption[];
  onChange: (event: any, options?: TagPickerOption<any>[], index?: number) => void;
  width?: string;
  contains?: boolean;
}

export class TagPicker extends Component<TagPickerProps, TagPickerState> {
  constructor(props: TagPickerProps) {
    super(props);
    this.CONTAINER = createRef();
    this.INPUT = createRef();
    this.state = {
      pickerValue: "",
      previewSelection: 0,
      inputFocus: false,
      containerOffsetTop: 0,
      containerClientHeight: 0,
    };
  }

  private CONTAINER: RefObject<HTMLDivElement>
  private INPUT: RefObject<HTMLInputElement>

  componentDidMount() {
    // event listener with useCapture = true
    window.addEventListener("scroll", this.hideCompletion, true);
  }

  componentWillUnmount(): void {
    window.removeEventListener("scroll", this.hideCompletion, true);
  }

  componentDidUpdate(prevProps: Readonly<TagPickerProps>, prevState: Readonly<TagPickerState>, snapshot?: any): void {
    if ((prevState.inputFocus !== this.state.inputFocus || prevState.pickerValue !== this.state.pickerValue) && this.state.inputFocus) {
      let element: HTMLElement = this.CONTAINER.current;
      let scrollHeight = 0;
      while (element !== null) {
        scrollHeight += element.scrollTop;
        element = element.style.position === "absolute" ? null : element.parentElement;
      }
      this.setState({ containerOffsetTop: this.CONTAINER.current.offsetTop - scrollHeight, containerClientHeight: this.CONTAINER.current.clientHeight })
    }
  }

  // event listener for scrolling
  hideCompletion = (event) => {
    if (this.state.inputFocus) {
      this.setState({ inputFocus: false });
    }
  }

  render() {
    const getAvailableOptions = this.props.options.filter(
      (option) => !this.props.selectedKeys.find((element) => element.key === option.key)
    ).filter(
      // check if part of option.text is this.state.pickerValue
      (option) => (this.props.contains && option.text.toLowerCase().includes(this.state.pickerValue.toLowerCase())) || option.text.toLowerCase().startsWith(this.state.pickerValue.toLowerCase())
    )

    return (
      <div 
        className={styles.container} 
        style={{width: this.props.width}} 
        ref={this.CONTAINER}
        onFocus={() => { 
          this.setState({ inputFocus: true })
        }}
        onBlur={(event) => {
          // check if clicked element is not a child of this.CONTAINER
          if(!this.CONTAINER.current.contains(event.relatedTarget)) {
            this.setState({ inputFocus: false })
          }
        }}
        onClick={() => {
          this.setState({ inputFocus: true })
        }}
      >
        <div className={styles.elementWrapper}>
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
        </div>
        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            className={styles.input}
            ref={this.INPUT}
            value={this.state.pickerValue}
            onChange={(event) => { this.setState({ inputFocus: true, pickerValue: event.target.value }) }}
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
                const options = getAvailableOptions;
                const maxElements = options.length > 3 ? 3 : options.length;
                this.setState({ previewSelection: (this.state.previewSelection + 1) % maxElements })
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                const options = getAvailableOptions;
                const maxElements = options.length > 3 ? 3 : options.length;
                this.setState({ previewSelection: (this.state.previewSelection + maxElements - 1) % maxElements })
              }
            }}
          />
        </div>
        {
          this.state.pickerValue !== "" && this.state.inputFocus &&
          <div className={styles.completion} style={{ top: this.state.containerOffsetTop + this.state.containerClientHeight + 7, left: this.INPUT.current.offsetLeft}}>
            {
              // get first three elements of getAvailableOptions
              getAvailableOptions.slice(0, 3).map((option, index) => {
                return(
                  <div 
                    key={option.text}
                    className={styles.previewItem}
                    style={index === this.state.previewSelection ? { backgroundColor: "var(--color-bg-selected)"} : {}}
                    tabIndex={0}
                    onClick={(event) => {
                      this.props.onChange(event, [...this.props.selectedKeys, option]);
                      // set focus to input
                      this.INPUT.current.focus();
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
    )
  }
}