import { Component } from 'react'
import Image from 'next/image'
import styles from './Footer.module.css'
import { FrontEndController } from '../controller/frontEndController'
import InstagramIcon from '../public/Instagram.png'
import YoutubeIcon from '../public/Youtube.png'
import GitHubIcon from '../public/GitHub.png'
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
              Social Media
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
                    title='WebNotes'
                    src={'https://web-notes.me/Logo.png'}
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
                    title='DEV-CHAT'
                    src={'https://dev-chat.me/logo.png'}
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
              <div>
                <Link
                  href={"/impressum"}>
                  Impressum
                </Link>
              </div>
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
      </div>
    )
  }
}
