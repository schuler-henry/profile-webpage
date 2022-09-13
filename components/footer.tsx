import { Component } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'
import { FrontEndController } from '../controller/frontEndController'
import InstagramIcon from '../public/logos/Instagram.png'
import YoutubeIcon from '../public/logos/Youtube.png'
import GitHubIcon from '../public/logos/GitHub.png'
import { PWPLanguageContext } from './PWPLanguageProvider/PWPLanguageProvider'

export interface FooterState {
  showWebNotes: boolean;
  showDevChat: boolean;
}

export interface FooterProps {
  isLoggedIn: boolean,
}

/** 
 * @class Footer Component Class
 * @component
 */
export class Footer extends Component<FooterProps, FooterState> {
  constructor(props: FooterProps) {
    super(props);
    this.state = {
      showWebNotes: true,
      showDevChat: true,
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    return (
      <div>
        <PWPLanguageContext.Consumer>
          { LanguageContext  => (
            <div className={styles.footer}>
              <div className={styles.footerElement}>
                <h4>
                  {LanguageContext.t('common:SocialMedia')}
                </h4>
                <div className={styles.social}>
                  <Link
                    href={'https://www.instagram.com/schuler.henry'}
                    passHref>
                    <div className={styles.icon}>
                      <Image
                        title='Instagram'
                        src={InstagramIcon}
                        objectFit='contain'
                        height={40}
                        width={40}
                        alt='Instagram Icon'
                      />
                    </div>
                  </Link>
                  <Link
                    href={'https://www.youtube.com/channel/UCDIOz_qU-ojgULaA8mBA1zw'}
                    passHref>
                    <div className={styles.icon}>
                      <Image
                        title='Youtube'
                        src={YoutubeIcon}
                        objectFit='contain'
                        height={40}
                        width={40}
                        alt='Youtube Icon'
                      />
                    </div>
                  </Link>
                  <Link
                    href={'https://github.com/schuler-henry'}
                    passHref>
                    <div className={styles.icon}>
                      <Image
                        title='github/schuler-henry'
                        src={GitHubIcon}
                        className="whiteImage"
                        objectFit='contain'
                        height={40}
                        width={40}
                        alt='GitHub Icon'
                      />
                    </div>
                  </Link>
                  <Link
                    href={'https://github.com/DHBW-FN-TIT20'}
                    passHref>
                    <div className={styles.icon}>
                      <Image
                        title='github/DHBW-FN-TIT20'
                        src={GitHubIcon}
                        className="whiteImage"
                        objectFit='contain'
                        height={40}
                        width={40}
                        alt='GitHub Icon'
                      />
                    </div>
                  </Link>
                </div>
              </div>
              <div className={styles.footerElement}>
                <h4>
                  {LanguageContext.t('common:Projects')}
                </h4>
                <div className={styles.projects}>
                  {
                    this.state.showWebNotes &&
                      <Link
                        href={'https://web-notes.me'}
                        passHref>
                        <div className={styles.icon}>
                          <Image
                            title='WebNotes'
                            src={'https://web-notes.me/Logo.png'}
                            objectFit='contain'
                            height={40}
                            width={40}
                            alt='WebNotes Icon'
                            onError={() => this.setState({ showWebNotes: false })}
                          />
                        </div>
                      </Link>
                  }
                  {/* {
                    this.state.showDevChat &&
                      <Link
                        href={'https://dev-chat.me'}
                        passHref>
                        <div className={styles.icon}>
                          <Image
                            title='DEV-CHAT'
                            src={'https://dev-chat.me/logo.png'}
                            objectFit='contain'
                            height={40}
                            width={40}
                            alt='DEV-CHAT Icon'
                            onError={() => {this.setState({ showDevChat: false })}}
                          />
                        </div>
                      </Link>
                  } */}
                </div>
              </div>
              <div className={styles.footerElement}>
                <h4>
                  {LanguageContext.t('common:Contact')}
                </h4>
                <div className={styles.contact}>
                  <div>
                    <Link
                      href={"/impressum"}>
                      {LanguageContext.t('common:Impressum')}
                    </Link>
                  </div>
                </div>
              </div>
              <div className={styles.footerElement}>
                <h4>
                  {LanguageContext.t('common:Account')}
                </h4>
                <div className={styles.account}>
                  <div hidden={this.props.isLoggedIn}>
                    <Link
                      href={"/login"}>
                      {LanguageContext.t('common:Login')}
                    </Link>
                  </div>
                  <div hidden={this.props.isLoggedIn}>
                    <Link
                      href={"/register"}>
                      {LanguageContext.t('common:Register')}
                    </Link>
                  </div>
                  <div hidden={this.props.isLoggedIn}>
                    <Link
                      href={"/activate"}>
                      {LanguageContext.t('common:Activate')}
                    </Link>
                  </div>
                  <div hidden={!this.props.isLoggedIn}>
                    <Link
                      href={"/profile"}>
                      {/* TODO: Option zum Passwort ändern */}
                      Passwort ändern
                    </Link>
                  </div>
                  <div hidden={!this.props.isLoggedIn}>
                    <p className="link" onClick={() => {
                      FrontEndController.logoutUser()
                      location.reload()
                    }}>
                      Ausloggen
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PWPLanguageContext.Consumer>
      </div>
    )
  }
}
