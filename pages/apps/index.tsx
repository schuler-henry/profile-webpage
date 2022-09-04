import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../../controller/frontEndController'
import styles from '../../styles/Apps.module.css'
import { Header } from '../../components/header'
import { Footer } from '../../components/footer'
import { I18n, withTranslation, WithTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageLoadingScreen } from '../../components/PageLoadingScreen/PageLoadingScreen'
import { PWPLanguageProvider } from '../../components/PWPLanguageProvider/PWPLanguageProvider'
import { Icon } from '@fluentui/react'

interface AppInformation {
  name: string;
  description: string;
  icon: string;
  url: string;
}

export interface AppsState {
  isLoggedIn: boolean | undefined;
  currentToken: string;
}

export interface AppsProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'apps'])),
    }
  }
}

/**
 * @class Apps Component Class
 * @component
 */
class Apps extends Component<AppsProps, AppsState> {
  constructor(props: AppsProps) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
    }
  }

  private appList: AppInformation[] = [
    {
      name: "Timer/Stopwatch", 
      description: "A simple timer app.", 
      icon: "Timer",
      url: "/apps/timer"
    },
  ];

  async componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener)
  }

  /**
   * This method checks whether the event contains a change in the user-token. If it does, it updates the login state.
   * @param {any} event Event triggered by an EventListener
   */
  storageTokenListener = async (event: any) => {
    if (event.key === FrontEndController.userTokenName) {
      this.updateLoginState();
    }
  }

  /**
   * This method updates the isLoggedIn state and currentToken state according to the current token in local storage.
   * @returns Nothing
   */
  async updateLoginState() {
    let currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken)) {
      this.setState({ isLoggedIn: true, currentToken: currentToken })
    } else {
      const { router } = this.props
      router.push("/login")
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    const { router } = this.props
    if (this.state.isLoggedIn === undefined) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:Apps')}</title>
              <meta name="description" content="Apps page." />
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
              <title>{this.props.t('common:Apps')}</title>
              <meta name="description" content="Apps page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
              <Header 
                username={FrontEndController.getUsernameFromToken(this.state.currentToken)} 
                hideLogin={this.state.isLoggedIn} 
                hideLogout={!this.state.isLoggedIn} 
                path={router.pathname} 
                router={this.props.router}
              />
            </header>

            <div className='scrollBody'>
              <main>
                <div className={styles.content}>
                  <h1>{this.props.t('common:Apps')}</h1>
                  <div className={styles.appGrid}>
                    {
                      this.appList.map((app, index) => {
                        return (
                          <div 
                            className={styles.app} 
                            onClick={() => {
                              router.push(app.url)
                            }}
                            key={index}
                          >
                            <Icon iconName={app.icon} className={styles.appIcon} />
                            <h2>{this.props.t('apps:' + app.name)}</h2>
                            <p className={styles.description}>
                              {app.description}
                            </p>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </main>

              <footer>
                <Footer isLoggedIn={this.state.isLoggedIn} />
              </footer>
            </div>
          </div>
        </PWPLanguageProvider>
      )
    }
  }
}

export default withRouter(withTranslation()(Apps))
