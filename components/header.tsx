import { Component } from 'react'
import styles from './Header.module.css'
import { FrontEndController } from '../controller/frontEndController'
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../public/favicon.ico'
import LogoName from '../public/favicon.ico'
import { LanguageSwitcher } from './LanguageSwitcher/LanguageSwitcher';
import { I18n, TFunction } from 'next-i18next';
import { WithRouterProps } from 'next/dist/client/with-router';
import { DarkmodeSwitcher } from './DarkmodeSwitcher/DarkmodeSwitcher';
import { ColorTheme } from '../enums/colorTheme';
import { DefaultButton } from '@fluentui/react';

export interface HeaderState {

}

export interface HeaderProps extends WithRouterProps {
  username: string;
  hideLogin: boolean;
  hideLogout: boolean;
  path: string;
  i18n: I18n;
  t: TFunction;
}

/** 
 * @class Header Component Class
 * @component
 * @category Components
 */
export class Header extends Component<HeaderProps, HeaderState> {
  isVisible = false;
  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    // Nav-Bar element for profile
    let username;

    if (this.props.hideLogout) {
      username = <div></div>
    } else {
      username = <Link href={'/profile'} passHref>
        <div className={styles.nav}>
          <span>
            {this.props.username}
          </span>
        </div>
      </Link>
    }

    // Nav-Bar element for login
    let loginButton;

    if (this.props.hideLogin) {
      loginButton = <></>
    } else {
      loginButton = <Link href={'/login'} passHref>
        <DefaultButton>
          {this.props.t('common:Login')}
        </DefaultButton>
        {/* <button>
          {this.props.t('common:Login')}
        </button> */}
      </Link>
    }

    // Nav-Bar element for logout
    let logoutButton;

    if (this.props.hideLogout) {
      logoutButton = <></>
    } else {
      logoutButton = <>
        <button
          onClick={() => {
            FrontEndController.logoutUser();
            location.reload();
          }
          }>
          {this.props.t('common:Logout')}
        </button>
      </>
    }

    return (
      <div>
        <nav>
          <div className={styles.navBar}>
            {/* Menu Icon for mobile device view */}
            <div
              className={`${styles.navElement} ${styles.menuIcon}`}
              id={styles.menuIcon}
              onClick={() => {
                if (this.isVisible) {
                  // slide side-nav to the left (hide)
                  document.getElementById("menu").classList.remove(`${styles.showHeader}`)
                  // rotate spans for menu icon (parallel lines)
                  document.getElementById("spanOne").classList.remove(`${styles.span}`)
                  document.getElementById("spanTwo").classList.remove(`${styles.span}`)
                  document.getElementById("spanTwo").classList.remove(`${styles.spanTwo}`)
                  document.getElementById("spanThree").classList.remove(`${styles.span}`)
                  document.getElementById("spanThree").classList.remove(`${styles.spanThree}`)
                  this.isVisible = false;
                } else {
                  // slide side-nav to the right (view)
                  document.getElementById("menu").classList.add(`${styles.showHeader}`)
                  // rotate spans for menu close icon (x)
                  document.getElementById("spanOne").classList.add(`${styles.span}`)
                  document.getElementById("spanTwo").classList.add(`${styles.span}`)
                  document.getElementById("spanTwo").classList.add(`${styles.spanTwo}`)
                  document.getElementById("spanThree").classList.add(`${styles.span}`)
                  document.getElementById("spanThree").classList.add(`${styles.spanThree}`)
                  this.isVisible = true;
                }
              }}>
              {/* Three bars that make up the menu-icon */}
              <span id="spanOne"></span>
              <span id="spanTwo"></span>
              <span id="spanThree"></span>
            </div>
            {/* Logo for Top-Nav-Bar in mobile view */}
            <Link href={'/'} passHref>
              <div className={styles.logoName}>
                <Image
                  src={LogoName}
                  alt='Logo_Schrift_Weiss.png missing.'
                  objectFit='contain'
                  sizes='fitContent'
                  layout="fill">
                </Image>
              </div>
            </Link>
            {/* Nav-Bar elements (top and left-side) */}
            <div
              className={styles.menu}
              id="menu">
              <Link href={'/'} passHref>
                <div className={styles.navLogo}>
                  <Image
                    src={Logo}
                    alt='Logo_Schrift_Weiss.png missing.'
                    objectFit='contain'
                    sizes='fitContent'
                    layout="fill">
                  </Image>
                </div>
              </Link>
              <Link href={'/'} passHref>
                <div className={styles.navLogoName}>
                  <Image
                    src={LogoName}
                    alt='Logo_Schrift_Weiss.png missing.'
                    objectFit='contain'
                    sizes='fitContent'
                    layout="fill">
                  </Image>
                </div>
              </Link>
              <Link href={'/'} passHref>
                <div className={styles.nav}>
                  <span>
                    {this.props.t('common:Home')}
                  </span>
                </div>
              </Link>
              <Link href={'/studies'} passHref>
                <div className={styles.nav}>
                  <span className={styles.navContent}>
                    {this.props.t('common:Studies')}
                  </span>
                </div>
              </Link>
              <Link href={'/impressum'} passHref>
                <div className={styles.nav}>
                  <span>
                    {this.props.t('common:Impressum')}
                  </span>
                </div>
              </Link>
              <div className={styles.pcSpacing}>
                {/* Spacing for PC (top bar) View */}
              </div>
              <div className={`${styles.nav} ${styles.languageSwitcher}`}>
                <LanguageSwitcher
                  path={this.props.path}
                  i18n={this.props.i18n}
                  router={this.props.router}
                />
              </div>
              <div className={`${styles.nav} ${styles.languageSwitcher}`}>
                <DarkmodeSwitcher />
              </div>
              {username}
              <div className={styles.mobileSpacing}>
                {/* Spacing for Mobile (side bar) View */}
              </div>
              <div className={`${styles.nav} ${styles.languageSwitcher}`}>
                {loginButton}
                {logoutButton}
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}