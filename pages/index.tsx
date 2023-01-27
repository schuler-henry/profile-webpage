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
import KWYG from '../public/logos/KWYG.svg'
import FlightSchoolBlack from '../public/logos/flight_school_black.svg'
import FlightSchoolWhite from '../public/logos/flight_school_white.svg'
import FlightSimulatorDemo from '../public/images/flight_sim.png'
import { PWPThemeContext } from '../components/PWPThemeProvider/PWPThemeProvider'

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
        <PWPThemeContext.Consumer>
          { ThemeContext => (
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
                                  title='GitHub/TIT20'
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
                                  title='GitHub/schuler-henry'
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
                                title='Henry Schuler'
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
                        <a
                          href="https://know-where-you-go.de"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image 
                            title='Know Where You Go'
                            className="whiteImage"
                            src={KWYG}
                            objectFit='contain'
                            height={40}
                            width={300}
                            alt='KWYG Icon'
                          />
                        </a>
                      </h1>
                      <InView>
                        {({ inView, ref, entry }) => (
                          <div className={styles.references} ref={ref}>
                            <a 
                              className={`${styles.hidden} ${inView && styles.show}`}
                              href="https://github.com/DHBW-FN-TIT20/know-where-you-go"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                  src={`https://img.shields.io/badge/github-know--where--you--go-%23121011.svg?style=for-the-badge&logo=github&logoColor=white`}
                                  height={30}
                                  alt="GitHub KWYG"
                                />
                              }
                            </a>
                            <div>
                              {
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                  className={`${styles.hidden} ${inView && styles.show}`}
                                  src={`https://img.shields.io/github/release/dhbw-fn-tit20/know-where-you-go.svg?style=flat-square`}
                                  height={20}
                                  alt="GitHub KWYG Release"
                                />
                              }
                              {
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                  className={`${styles.hidden} ${inView && styles.show}`}
                                  src={`https://img.shields.io/github/downloads/dhbw-fn-tit20/know-where-you-go/total.svg?style=flat-square`}
                                  height={20}
                                  alt="GitHub KWYG Downloads"
                                />
                              }
                              </div>
                          </div>
                        )}
                      </InView>
                      <div className={styles.infoWrapper}>
                        <InView>
                          {({ inView, ref, entry }) => (
                            <div className={`${styles.text} ${styles.hidden} ${inView && styles.show}`} ref={ref}>
                              <h2>Wikipedia</h2>
                              <p>{this.props.t('home:KWYGWikipediaText1')}</p>
                              <h2>{this.props.t('home:KWYGCurrentPosition')}</h2>
                              <p>{this.props.t('home:KWYGCurrentPositionText1')}<a href="https://www.openstreetmap.de">OpenStreetMap</a></p>
                              <h2>{this.props.t('home:KWYGNavigation')}</h2>
                              <p>{this.props.t('home:KWYGNavigationText1')}<a href="https://www.google.com/maps">Google Maps</a>{this.props.t('home:KWYGNavigationText1_1')}</p>
                              <h2>{this.props.t('home:KWYGAppOffline')}</h2>
                              <p>{this.props.t('home:KWYGAppOfflineText1')}</p>
                              <p>{this.props.t('home:KWYGAppOfflineText2')}</p>
                              <h2>{this.props.t('home:KWYGOwnHosting')}</h2>
                              <p>{this.props.t('home:KWYGOwnHostingText1')}<b>{this.props.t('home:KWYGOwnHostingText1_1')}</b>{this.props.t('home:KWYGOwnHostingText1_2')}</p>
                            </div>
                          )}
                        </InView>
                        <InView>
                          {({ inView, ref, entry }) => (
                            <div ref={ref} className={`${styles.phoneWrapper} ${styles.hidden} ${inView && styles.show}`}>
                              <h2>{this.props.t('home:KWYGDemonstration')}</h2>
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
                      <InView>
                        {({ inView, ref, entry }) => (
                          <div 
                            className={`${styles.developers}`}
                            ref={ref}
                          >
                            <h2 className={`${styles.hidden} ${inView && styles.show}`}>
                              {this.props.t('home:Developer')}
                            </h2>
                            <div className={styles.developerShields}>
                              {
                                ["johannesbrandenburger", "lukasbraundev", "screetox", "Floskinner", "Floqueboque", "PhillippPatzelt", "schuler-henry", "baldur132"].map(name => (
                                  <a 
                                    key={"GitHubShield" + name}
                                    className={`${styles.hidden} ${inView && styles.show}`}
                                    href={"https://github.com/" + name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img 
                                        src={`https://img.shields.io/badge/${name.replaceAll("-", "--")}-%23121011.svg?style=flat-square&logo=github&logoColor=white`}
                                        height={30}
                                        alt={name}
                                      />
                                    }
                                  </a>
                                ))
                              }
                            </div>
                          </div>
                        )}
                      </InView>
                    </div>
                    <div className={styles.FlightSimulator}>
                      <h1>
                        <a 
                          href="https://flight-sim.brandenburger.dev"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image 
                            title='Flight Simulator'
                            src={ThemeContext.theme === "light" ? FlightSchoolBlack : FlightSchoolWhite}
                            objectFit='contain'
                            height={30}
                            width={300}
                            alt='Flight Simulator Logo'
                          />
                        </a>
                      </h1>
                      <InView>
                        {({ inView, ref, entry }) => (
                          <div className={styles.references} ref={ref}>
                            <a
                              className={`${styles.hidden} ${inView && styles.show}`}
                              href="https://github.com/DHBW-FN-TIT20/flight-school"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                  src={`https://img.shields.io/badge/github-flight--school-%23121011.svg?style=for-the-badge&logo=github&logoColor=white`}
                                  height={30}
                                  alt="GitHub KWYG"
                                />
                              }
                            </a>
                          </div>
                        )}
                      </InView>
                      <div className={styles.infoWrapper}>
                        <InView>
                          {({ inView, ref, entry }) => (
                            <div className={`${styles.text} ${styles.hidden} ${inView && styles.show}`} ref={ref}>
                              <h2>{this.props.t('home:FS3DControls')}</h2>
                              <p>{this.props.t('home:FS3DControlsText1')}</p>
                              <p>{this.props.t('home:FS3DControlsText2')}</p>
                              <h2>{this.props.t('home:FSInstallable')}</h2>
                              <p>{this.props.t('home:FSInstallableText1')}</p>
                              <p>{this.props.t('home:FSInstallableText2')}</p>
                            </div>
                          )}
                        </InView>
                        <InView>
                          {({ inView, ref, entry }) => (
                            <div className={`${styles.imageWrapper} ${styles.hidden} ${inView && styles.show}`} ref={ref}>
                              <a 
                                href="https://flight-sim.brandenburger.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Image 
                                  alt="FlightSimulatorDemo"
                                  src={FlightSimulatorDemo}
                                  layout="fill"
                                  objectFit="contain"
                                />
                              </a>
                            </div>
                          )}
                        </InView>
                      </div>
                      <InView>
                        {({ inView, ref, entry }) => (
                          <div 
                            className={`${styles.developers}`}
                            ref={ref}
                          >
                            <h2 className={`${styles.hidden} ${inView && styles.show}`}>
                              {this.props.t('home:Developer')}
                            </h2>
                            <div className={styles.developerShields}>
                              {
                                ["johannesbrandenburger", "lukasbraundev", "schuler-henry"].map(name => (
                                  <a 
                                    key={"GitHubShieldFlightSchool" + name}
                                    className={`${styles.hidden} ${inView && styles.show}`}
                                    href={"https://github.com/" + name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  > 
                                    {
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img 
                                        src={`https://img.shields.io/badge/${name.replaceAll("-", "--")}-%23121011.svg?style=flat-square&logo=github&logoColor=white`}
                                        height={30}
                                        alt={name}
                                      />
                                    }
                                  </a>
                                ))
                              }
                            </div>
                          </div>
                        )}
                      </InView>
                    </div>
                  </main>

                  <footer>
                    <Footer isLoggedIn={this.context.user} />
                  </footer>
                </div>
              </div>
            </PWPLanguageProvider>
          )}
        </PWPThemeContext.Consumer>
      )
    }
  }
}

export default withRouter(withTranslation()(Home))
