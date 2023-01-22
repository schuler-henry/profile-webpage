import Head from 'next/head'
import { Component } from 'react'
import styles from '../styles/Home.module.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { I18n, WithTranslation, withTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import { PageLoadingScreen } from '../components/PageLoadingScreen/PageLoadingScreen'
import { PWPLanguageProvider } from '../components/PWPLanguageProvider/PWPLanguageProvider'
import { PWPAuthContext } from '../components/PWPAuthProvider/PWPAuthProvider'
import { InView } from 'react-intersection-observer'
import Image from 'next/image'
import { Icon } from '@fluentui/react'
import ProfilePicture from '../public/images/profile_picture.jpg'
import GithubProfilePicture from '../public/images/github_schuler_henry.jpg'
import TIT20 from '../public/logos/tit20.jpeg'

export interface HomeState {
  cursorClass: any;
  headerText: string;
}

export interface HomeProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'home'])),
    }
  }
}

/**
 * @class Home Component Class
 * @component
 */
class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props)
    this.state = {
      cursorClass: null,
      headerText: "",
    }
  }

  static contextType = PWPAuthContext;

  componentDidMount() {
    this.typeWriter(this.props.t('home:slogan'));
    window.addEventListener('resize', this.updatePhoneSize)
    const hiddenElements = document.querySelectorAll(styles.hidden);
    console.log(hiddenElements)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePhoneSize)
  }

  private updatePhoneSize() {
    let phoneDiv = document.getElementById('phone')
    let iosDiv = document.getElementById('ios')
    if (phoneDiv.clientHeight < iosDiv.clientHeight) {
      const offset = Math.floor((phoneDiv.clientHeight / iosDiv.clientHeight)*100)
      iosDiv.style.transform = `scale(${offset}%)`
    }
  }

  /**
   * This methods types the header to the main page.
   * @param {string} text String to display as header.
   */
  typeWriter(text: string) {
    let letterWait: number = 80;
    if (this.state.cursorClass == null) {
      this.setState({ cursorClass: styles.cursor })
      setTimeout(() => {
        this.typeWriter(text)
      }, 1000)
    } else if (this.state.headerText != text) {
      let index: number = this.state.headerText.length;
      this.setState({ headerText: this.state.headerText + text.charAt(index) })
      if (text.charAt(index + 1) == ' ') {
        letterWait = 880;
      }
      setTimeout(() => {
        this.typeWriter(text)
      }, letterWait)
    } else {
      setTimeout(() => {
        this.setState({ cursorClass: null })
      }, 1000)
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    const { router } = this.props
    // console.log(this.context.user)
    if (this.context.user === undefined) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('home:Welcome')}</title>
              <meta name="description" content="Welcome page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
              <PageLoadingScreen />
            </main>
          </div>
        </PWPLanguageProvider>
      )
    } else {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('home:Welcome')}</title>
              <meta name="description" content="Welcome page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
              <Header 
                username={this.context.user?.username} 
                hideLogin={this.context.user} 
                hideLogout={!this.context.user} 
                path={router.pathname} 
                router={this.props.router}
              />
            </header>
            <div className="scrollBody">
              <main>
                <div className={styles.contentOne}>
                  <div className={styles.heading}>
                    <h1 className={this.state.cursorClass}>{this.state.headerText}</h1>
                  </div>
                  <div className={styles.aboutMePictures}>
                    <InView>
                      {({ inView, ref, entry }) => (
                        <div className={`${styles.imageOne} ${styles.hidden} ${inView && styles.show}`} ref={ref}>
                          <a 
                            href="https://github.com/dhbw-fn-tit20" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Image 
                              title='Me'
                              src={TIT20}
                              objectFit='contain'
                              height={160}
                              width={160}
                              alt='Me Icon'
                            />
                          </a>
                        </div>
                      )}
                    </InView>
                    <InView>
                      {({ inView, ref, entry }) => (
                        <div className={`${styles.imageTwo} ${styles.hidden} ${inView && styles.show}`} ref={ref}>
                          <a 
                            href="https://github.com/schuler-henry" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Image 
                              title='Me'
                              src={GithubProfilePicture}
                              objectFit='contain'
                              height={180}
                              width={180}
                              alt='Me Icon'
                            />
                          </a>
                        </div>
                      )}
                    </InView>
                    <InView>
                      {({ inView, ref, entry }) => (
                        <div className={`${styles.imageThree} ${styles.hidden} ${inView && styles.show}`} ref={ref}>
                          <Image 
                            title='Me'
                            src={ProfilePicture}
                            objectFit='contain'
                            height={200}
                            width={200}
                            alt='Me Icon'
                          />
                        </div>
                      )}
                    </InView>
                  </div>
                  <div 
                    className={`${styles.chevDown} ${styles.hiddenDown} ${this.state.cursorClass === null && styles.show}`} 
                    onClick={() => {
                      document.getElementById('KWYG').scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <Icon 
                      iconName="ChevronDown"
                    />
                  </div>
                </div>
                <div className={styles.KWYG} id="KWYG">
                  <h1>
                    Know Where You Go
                  </h1>

                  <div className={styles.infoWrapper}>
                    <div className={`${styles.infoTextWrapper} `}>
                      <InView>
                        {({ inView, ref, entry }) => (
                          <a
                            href="https://know-where-you-go.de"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.hidden} ${inView && styles.show}`}
                            ref={ref}
                          >
                            <Image
                              title='KWYG'
                              src="https://github.com/DHBW-FN-TIT20/know-where-you-go/raw/main/design/kwyg-logo-background.svg"
                              objectFit='contain'
                              height={150}
                              width={150}
                              alt='KWYG Icon'
                            />
                          </a>
                        )}
                      </InView>
                      <InView>
                        {({ inView, ref, entry }) => (
                          <div className={`${styles.text} ${styles.hidden} ${inView && styles.show}`} ref={ref}>
                            <h2>Wikipedia</h2>
                            <p>Informationen zum ausgewählten Standort</p>
                            <h2>Aktuelle Position</h2>
                            <p>Aktueller Standort mit Hilfe von <a href="https://www.openstreetmap.de">OpenStreetMap</a></p>
                            <h2>Navigation</h2>
                            <p>Routen anzeigen und in <a href="https://www.google.com/maps">Google Maps</a> öffnen</p>
                            <h2>App + Offline Nutzung</h2>
                            <p>Kann auf jedem Endgerät installiert werden</p>
                            <p>Sieh deine letzten Inhalte auch offline</p>
                            <h2>Eigenes Hosting</h2>
                            <p>Hoste die Anwendung dank <b>open source</b> auf deinem eigenem Server mit Docker</p>
                          </div>
                        )}
                      </InView>
                    </div>
                    <InView>
                      {({ inView, ref, entry }) => (
                        <div ref={ref} className={`${styles.phoneWrapper} ${styles.hidden} ${inView && styles.show}`}>
                          <h2>Demonstration</h2>
                          <div className={`${styles.phone}`} id="phone">
                            <div className={styles.ios} id="ios" onLoad={this.updatePhoneSize}>
                              <div className={styles.border}>
                                <embed src="https://know-where-you-go.de" className={styles.website} ></embed>
                                <div className={styles.notch} />
                                <div className={styles.swipeBar} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </InView>
                  </div>
                </div>
              </main>

              <footer>
                <Footer isLoggedIn={this.context.user} />
              </footer>
            </div>
          </div>
        </PWPLanguageProvider>
      )
    }
  }
}

export default withRouter(withTranslation()(Home))
