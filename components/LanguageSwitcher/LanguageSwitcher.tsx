import { Component } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import { I18n } from "next-i18next";
import { Icon } from '@fluentui/react/lib/Icon'
import { Dropdown, DropdownOption } from "../Dropdown/Dropdown";

const options: DropdownOption[] = [
  {key: "de", text: "DE", data: {icon: "Germany"}},
  {key: "en", text: "EN", data: {icon: "US"}},
]

const onRenderOption = (option: DropdownOption): JSX.Element => {
  return(
    <div>
      <span>
        <Icon style={{ marginRight: '8px' }} iconName={option.data.icon} />
      </span>
      <span>
        {option.text}
      </span>
    </div>
  )
}

const onRenderCaretDown = (): JSX.Element => {
  return(
    <Icon iconName="ChevronDown" />
  )
}

export interface LanguageSwitcherState {
  // selectedItem: IDropdownOption;
  selectedKey: string;
}

export interface LanguageSwitcherProps extends WithRouterProps {
  path: string;
  i18n: I18n;
}

export class LanguageSwitcher extends Component<LanguageSwitcherProps, LanguageSwitcherState> {
  constructor(props: LanguageSwitcherProps) {
    super(props)
    this.state = {
      // selectedItem: dropdownControlledLanguageOptions.find(element => element.key === this.props.i18n.language),
      selectedKey: this.props.i18n.language,
    }
  }

  private onchange = (event: React.FormEvent<HTMLDivElement>, item: DropdownOption): void => {
    if (this.state.selectedKey !== item.key) {
      const { router } = this.props;
      router.push(router.pathname, router.pathname, { locale: item.key.toString() })
      this.setState({ selectedKey: item.key });
    }
  }

  render() {
    return (
      <div>
        <Dropdown 
          options={options} 
          selectedKey={this.state.selectedKey} 
          onChange={this.onchange}
          onRenderOption={onRenderOption}
          onRenderCaretDown={onRenderCaretDown}
        />
      </div>
    )
  }
}
