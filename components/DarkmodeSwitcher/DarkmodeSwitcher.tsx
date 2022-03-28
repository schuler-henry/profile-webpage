import { Toggle } from "@fluentui/react";
import React, { Component } from "react";
import styles from "./DarkmodeSwitcher.module.css"
import { FrontEndController } from "../../controller/frontEndController";
import { ColorTheme } from "../../enums/colorTheme";
import { NextRouter, withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";

function _onChange(ev: React.MouseEvent<HTMLElement>, router: NextRouter, checked?: boolean) {
  FrontEndController.setTheme(checked ? ColorTheme.lightTheme : ColorTheme.darkTheme)
  router.replace(router.asPath)
}

export interface DarkmodeSwitcherState {
  isLightTheme: boolean;
}

export interface DarkmodeSwitcherProps extends WithRouterProps {
  
}

class DarkmodeSwitcherClass extends Component<DarkmodeSwitcherProps, DarkmodeSwitcherState> {
  constructor(props: DarkmodeSwitcherProps) {
    super(props)
    this.state = {
      isLightTheme: undefined
    }
  }

  componentDidMount(): void {
    this.setState({ isLightTheme: FrontEndController.getTheme() === ColorTheme.lightTheme })
  }

  render() {
    const { router } = this.props
    if (this.state.isLightTheme === undefined) {
      return (
        <div>

        </div>
      )
    } else {
      return (
        <div className={styles.toggle}>
          <Toggle defaultChecked={this.state.isLightTheme} inlineLabel onText="Light" offText="Dark" onChange={(event, clicked) => _onChange(event, router, clicked)} />
        </div>
      )
    }
  }
}

const DarkmodeSwitcher = withRouter(DarkmodeSwitcherClass)

export { DarkmodeSwitcher }