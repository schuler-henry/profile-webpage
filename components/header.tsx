import { Component } from 'react'
import styles from './Header.module.css'
import { FrontEndController } from '../controller/frontEndController'
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../public/logos/logo_circle_black.png'
import LogoNameBlack from '../public/logos/logo_name_black.png'
import LogoNameWhite from '../public/logos/logo_name_white.png'
import { LanguageSwitcher } from './LanguageSwitcher/LanguageSwitcher';
import { WithRouterProps } from 'next/dist/client/with-router';
import { DarkmodeSwitcher } from './DarkmodeSwitcher/DarkmodeSwitcher';
import { Button } from './Button/Button';
import { PWPLanguageContext } from './PWPLanguageProvider/PWPLanguageProvider';
import { PWPThemeContext } from './PWPThemeProvider/PWPThemeProvider';
import { Icon } from '@fluentui/react/lib/Icon';

export interface HeaderState {

}

export interface HeaderProps extends WithRouterProps {
  username: string;
  hideLogin: boolean;
  hideLogout: boolean;
  path: string;
}

/** 
 * @class Header Component Class
 * @component
 * @category Components
 */
export class Header extends Component<HeaderProps, HeaderState> {
  isVisible = false;

  componentDidMount(): void {
    let studiesElement = document.getElementById('NavBarStudies');
    let appsElement = document.getElementById('NavBarApps');
    studiesElement.addEventListener('mouseenter', () => {document.getElementById("SubContentStudies").classList.toggle(`${styles.active}`)});
    studiesElement.addEventListener('mouseleave', () => {document.getElementById("SubContentStudies").classList.remove(`${styles.active}`)});
    appsElement?.addEventListener('mouseenter', () => {document.getElementById("SubContentApps").classList.toggle(`${styles.active}`)});
    appsElement?.addEventListener('mouseleave', () => {document.getElementById("SubContentApps").classList.remove(`${styles.active}`)});
  }

  componentDidUpdate(prevProps: Readonly<HeaderProps>, prevState: Readonly<HeaderState>, snapshot?: any): void {
    if (this.props.hideLogout !== prevProps.hideLogout) {
      let appsElement = document.getElementById('NavBarApps');
      appsElement?.addEventListener('mouseenter', () => {document.getElementById("SubContentApps").classList.toggle(`${styles.active}`)});
      appsElement?.addEventListener('mouseleave', () => {document.getElementById("SubContentApps").classList.remove(`${styles.active}`)});  
    }
  }

  private toggleVisibility() {
    if (this.isVisible) {
      // remove close-field next to the menu
      document.getElementById('closeNavField').classList.remove(`${styles.closeNavField}`);
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
      // show close-field next to the menu
      document.getElementById('closeNavField').classList.add(`${styles.closeNavField}`);
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
  }

  private closeNav(event) {
    if (this.isVisible && event.target === event.currentTarget) {
      // remove close-field next to the menu
      document.getElementById('closeNavField').classList.remove(`${styles.closeNavField}`);
      // slide side-nav to the left (hide)
      document.getElementById("menu").classList.remove(`${styles.showHeader}`)
      // rotate spans for menu icon (parallel lines)
      document.getElementById("spanOne").classList.remove(`${styles.span}`)
      document.getElementById("spanTwo").classList.remove(`${styles.span}`)
      document.getElementById("spanTwo").classList.remove(`${styles.spanTwo}`)
      document.getElementById("spanThree").classList.remove(`${styles.span}`)
      document.getElementById("spanThree").classList.remove(`${styles.spanThree}`)
      this.isVisible = false;
    }
  }

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
          <span className={styles.navContent}>
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
      loginButton = <PWPLanguageContext.Consumer>
        { LanguageContext  => (
          <Link href={'/login'} passHref>
            <Button>
              {LanguageContext.t('common:Login')}
            </Button>
          </Link>
        )}
        </PWPLanguageContext.Consumer>
    }

    // Nav-Bar element for logout
    let logoutButton;

    if (this.props.hideLogout) {
      logoutButton = <></>
    } else {
      logoutButton = <PWPLanguageContext.Consumer>
        { LanguageContext  => (
          <Button
            onClick={() => {
              FrontEndController.logoutUser();
            }
            }>
            {LanguageContext.t('common:Logout')}
          </Button>
        )}
        </PWPLanguageContext.Consumer>
    }

    return (
      <div>
        <PWPThemeContext.Consumer>
          { ThemeContext => (
            <PWPLanguageContext.Consumer>
              { LanguageContext  => (
                <nav>
                  <div className={styles.navBar}>
                    {/* Menu Icon for mobile device view */}
                    <div
                      className={`${styles.navElement} ${styles.menuIcon}`}
                      id={styles.menuIcon}
                      onClick={() => {
                        this.toggleVisibility();
                      }}>
                      {/* Three bars that make up the menu-icon */}
                      <span id="spanOne"></span>
                      <span id="spanTwo"></span>
                      <span id="spanThree"></span>
                    </div>
                    {/* Logo for Top-Nav-Bar in mobile view */}
                    <Link href={'/'} passHref>
                      <div className={styles.logo}>
                        <Image
                          src={Logo}
                          alt='Logo missing.'
                          objectFit='contain'
                          sizes='fitContent'
                          layout="fill">
                        </Image>
                      </div>
                    </Link>
                    <Link href={'/'} passHref>
                      <div className={styles.logoName}>
                        <Image
                          src={ThemeContext.theme === "light" ? LogoNameBlack : LogoNameWhite}
                          alt='Logo missing.'
                          objectFit='contain'
                          sizes='fitContent'
                          layout="fill">
                        </Image>
                      </div>
                    </Link>
                    {/* Nav-Bar elements (top and left-side) */}
                    <div 
                      className='invisible'
                      id="closeNavField"
                      onClick={(event) => { this.closeNav(event); }} />
                    <div
                      className={styles.menu}
                      id="menu">
                      <Link href={'/'} passHref>
                        <div className={styles.navLogo} onClick={(event) => { this.closeNav(event); }}>
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
                        <div className={styles.navLogoName} onClick={(event) => { this.closeNav(event); }}>
                          <Image
                            src={ThemeContext.theme === "light" ? LogoNameBlack : LogoNameWhite}
                            alt='Logo missing.'
                            objectFit='contain'
                            sizes='fitContent'
                            layout="fill"
                            onClick={(event) => { this.closeNav(event); }}>
                          </Image>
                        </div>
                      </Link>
                      <Link href={'/'} passHref>
                        <div className={styles.nav} onClick={(event) => { this.closeNav(event); }}>
                          <span className={styles.navContent} onClick={(event) => { this.closeNav(event); }}>
                            {LanguageContext.t('common:Home')}
                          </span>
                        </div>
                      </Link>
                      <div className={`${styles.relative}`} id="NavBarStudies">
                        <Link href={'/studies'} passHref>
                          <div className={styles.nav} onClick={(event) => { this.closeNav(event); }}>
                            <span className={styles.navContent} onClick={(event) => { this.closeNav(event); }}>
                              {LanguageContext.t('common:Studies')}
                            </span>
                            <div className={styles.navContentIcon}>
                              <Link href={''} passHref>
                                <Icon 
                                  iconName="ChevronRight" 
                                  className={styles.mobileMenuExtender}
                                  id="studiesChevron"
                                  onClick={() => {
                                    document.getElementById("SubContentStudies").classList.toggle(`${styles.activeMobile}`);
                                    document.getElementById("studiesChevron").classList.toggle(`${styles.rotate90}`);
                                  }}
                                />
                              </Link>
                            </div>
                          </div>
                        </Link>
                        <div className={styles.navSubContent} id="SubContentStudies">
                          <div className={styles.navSubContentItem}>
                            <Link href={'/studies/summaries'} passHref>
                              <div className={styles.nav} onClick={(event) => { this.closeNav(event); }}>
                                <span className={styles.navContent} onClick={(event) => { this.closeNav(event); }}>
                                  {LanguageContext.t('common:Summaries')}
                                </span>
                              </div>
                            </Link>
                          </div>
                          <div className={styles.navSubContentItem}>
                            <Link href={'/studies/projects'} passHref>
                              <div className={styles.nav} onClick={(event) => { this.closeNav(event); }}>
                                <span className={styles.navContent} onClick={(event) => { this.closeNav(event); }}>
                                  {LanguageContext.t('common:Projects')}
                                </span>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                      {
                        this.props.hideLogout ? 
                          <div></div> 
                        : 
                          <div className={`${styles.relative}`} id="NavBarApps">
                            <Link href={'/apps'} passHref>
                              <div className={styles.nav} onClick={(event) => { this.closeNav(event); }}>
                                <span className={styles.navContent} onClick={(event) => { this.closeNav(event); }}>
                                  {LanguageContext.t('common:Apps')}
                                </span>
                                <div className={styles.navContentIcon}>
                                  <Link href={''} passHref>
                                    <Icon 
                                      iconName="ChevronRight" 
                                      className={styles.mobileMenuExtender}
                                      id="appsChevron"
                                      onClick={() => {
                                        document.getElementById("SubContentApps").classList.toggle(`${styles.activeMobile}`);
                                        document.getElementById("appsChevron").classList.toggle(`${styles.rotate90}`);
                                      }}
                                    />
                                  </Link>
                                </div>
                              </div>
                            </Link>
                            <div className={styles.navSubContent} id="SubContentApps">
                              <div className={styles.navSubContentItem}>
                                <Link href={'/apps/timer'} passHref>
                                  <div className={styles.nav} onClick={(event) => { this.closeNav(event); }}>
                                    <span className={styles.navContent} onClick={(event) => { this.closeNav(event); }}>
                                      {LanguageContext.t('common:Timer')}
                                    </span>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        }
                      <Link href={'/impressum'} passHref>
                        <div className={styles.nav} onClick={(event) => { this.closeNav(event); }}>
                          <span className={styles.navContent} onClick={(event) => { this.closeNav(event); }}>
                            {LanguageContext.t('common:Impressum')}
                          </span>
                        </div>
                      </Link>
                      <div className={styles.pcSpacing}>
                        {/* Spacing for PC (top bar) View */}
                      </div>
                      {username}
                      <div className={`${styles.nav} ${styles.languageSwitcher}`}>
                        <LanguageSwitcher
                          path={this.props.path}
                          i18n={LanguageContext.i18n}
                          router={this.props.router}
                        />
                      </div>
                      <div className={`${styles.nav} ${styles.languageSwitcher}`}>
                        <DarkmodeSwitcher />
                      </div>
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
              )}
            </PWPLanguageContext.Consumer>
          )}
        </PWPThemeContext.Consumer>
      </div>
    )
  }
}