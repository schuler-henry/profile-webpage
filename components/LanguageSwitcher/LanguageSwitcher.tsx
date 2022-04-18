import { Component } from "react";
import { Dropdown, IDropdownOption, IDropdownStyles } from '@fluentui/react'
import { WithRouterProps } from "next/dist/client/with-router";
import { I18n } from "next-i18next";
import { Icon } from '@fluentui/react/lib/Icon'

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    width: 80
  }
}

const dropdownControlledLanguageOptions: IDropdownOption[] = [
  { key: 'en', text: 'EN', data: { icon: 'US' } },
  { key: 'de', text: 'DE', data: { icon: 'Germany' } },
]

const iconStyles = { marginRight: '8px' };

const onRenderOption = (option: IDropdownOption): JSX.Element => {
  return (
    <div>
      {option.data && option.data.icon && (
        <Icon style={iconStyles} iconName={option.data.icon} aria-hidden="true" title={option.data.icon} />
      )}
      <span>{option.text}</span>
    </div>
  );
};

const onRenderTitle = (options: IDropdownOption[]): JSX.Element => {
  const option = options[0];

  return (
    <div>
      {option.data && option.data.icon && (
        <Icon style={iconStyles} iconName={option.data.icon} aria-hidden="true" title={option.data.icon} />
      )}
      <span>{option.text}</span>
    </div>
  );
};

const onRenderCaretDown = (): JSX.Element => {
  return (
    <Icon iconName="ChevronDown" />
  );
};

export interface LanguageSwitcherState {
  selectedItem: IDropdownOption;
}

export interface LanguageSwitcherProps extends WithRouterProps {
  path: string;
  i18n: I18n;
}

export class LanguageSwitcher extends Component<LanguageSwitcherProps, LanguageSwitcherState> {
  constructor(props: LanguageSwitcherProps) {
    super(props)
    this.state = {
      selectedItem: dropdownControlledLanguageOptions.find(element => element.key === this.props.i18n.language),
    }
  }


  private onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    if (this.state.selectedItem.key !== item.key) {
      const { router } = this.props;
      router.push(this.props.path, this.props.path, { locale: item.key.toString() })
      this.setState({ selectedItem: item });
    }
  };

  render() {
    return (
      <div>
        <Dropdown
          selectedKey={this.state.selectedItem ? this.state.selectedItem.key : undefined}
          onChange={this.onChange}
          onRenderTitle={onRenderTitle}
          onRenderOption={onRenderOption}
          onRenderCaretDown={onRenderCaretDown}
          styles={dropdownStyles}
          options={dropdownControlledLanguageOptions}
        />
      </div>
    )
  }
}
