import { withRouter } from 'next/router'
import { WithRouterProps } from 'next/dist/client/with-router'
import { Component } from 'react'
import Image from 'next/image'
import styles from '../styles/Footer.module.css'
import { WebPageController } from '../controller'
import InstagramIcon from '../public/Instagram.png'
import YoutubeIcon from '../public/Youtube.png'
import GitHubIcon from '../public/GitHub.png'

export interface FooterState {

}

export interface FooterProps extends WithRouterProps {
}

/** 
 * @class Footer Component Class
 * @component
 */
class Footer extends Component<FooterProps, FooterState> {
  constructor(props: FooterProps) {
    super(props)
    this.state = {

    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    /** 
     * Initialize Router to navigate to other pages
     */
    const { router } = this.props

    return (
      <div>
        <div className={styles.footer}>
          <div className={styles.footerElement}>
            <h4>
              Social Media
            </h4>
            <div className={styles.socialMedia}>
              <a href="https://www.instagram.com/schuler.henry/">
                <Image 
                  src={InstagramIcon} 
                  objectFit='contain'
                  height={40}
                  width={40}
                  alt='Instagram Icon'
                />
              </a>
              <a href={'https://www.youtube.com/channel/UCDIOz_qU-ojgULaA8mBA1zw'}>
                <Image 
                  src={YoutubeIcon} 
                  objectFit='contain'
                  height={40}
                  width={40}
                  alt='Youtube Icon'
                />
              </a>
              <a href={'https://github.com/schuler-henry'}>
                <Image 
                  src={GitHubIcon} 
                  objectFit='contain'
                  height={40}
                  width={40}
                  alt='Youtube Icon'
                />
              </a>
            </div>
          </div>
          <div className={styles.footerElement}>
            <h4>
              Contact
            </h4>
            <a href="/impressum">Impressum</a>
          </div>
          <div className={styles.footerElement}>
            <h4>
              Account
            </h4>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Footer)