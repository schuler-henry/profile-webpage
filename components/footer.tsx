import { Component } from 'react'
import Image from 'next/image'
import styles from './Footer.module.css'
import { FrontEndController } from '../controller/frontEndController'
import InstagramIcon from '../public/Instagram.png'
import YoutubeIcon from '../public/Youtube.png'
import GitHubIcon from '../public/GitHub.png'
import WebNotesIcon from '../public/WebNotes.png'
import DevChatIcon from '../public/Dev-Chat.png'
import Link from 'next/link'

export interface FooterState {

}

export interface FooterProps {
  isLoggedIn: boolean,
}

/** 
 * @class Footer Component Class
 * @component
 */
export class Footer extends Component<FooterProps, FooterState> {
  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
   render() {
    return (
      <div>
        <div className={styles.footer}>
          <div className={styles.footerElement}>
            <h4>
              Quellcode
            </h4>
            <div className={styles.code}>
              <Link
                href={'https://github.com/schuler-henry'}
                passHref>
                <div className={styles.icon}>
                  <Image
                    src={GitHubIcon}
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
              Projekte
            </h4>
            <div className={styles.projects}>
              <Link
                href={'https://web-notes.me'}
                passHref>
                <div className={styles.icon}>
                  <Image
                    src={WebNotesIcon}
                    objectFit='contain'
                    height={40}
                    width={40}
                    alt='WebNotes Icon'
                  />
                </div>
              </Link>
              <Link
                href={'https://dev-chat.me'}
                passHref>
                <div className={styles.icon}>
                  <Image
                    src={DevChatIcon}
                    objectFit='contain'
                    height={40}
                    width={40}
                    alt='DEV-CHAT Icon'
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.footerElement}>
            <h4>
              Kontakt
            </h4>
            <div className={styles.contact}>
              <Link
                href={"/impressum"}>
                Impressum
              </Link>
            </div>
          </div>
          <div className={styles.footerElement}>
            <h4>
              Account
            </h4>
            <div className={styles.account}>
              <div hidden={this.props.isLoggedIn}>
                <Link
                  href={"/login"}>
                  Login
                </Link>
              </div>
              <div hidden={this.props.isLoggedIn}>
                <Link
                  href={"/register"}>
                  Registrieren
                </Link>
              </div>
              <div hidden={!this.props.isLoggedIn}>
                <Link
                  href={"/profile"}>
                  Passwort ändern
                </Link>
              </div>
              <div hidden={!this.props.isLoggedIn} onClick={() => {
                FrontEndController.logoutUser()
                location.reload()
              }}>
                <p className="link">
                  Ausloggen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
