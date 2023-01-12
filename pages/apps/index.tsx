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
import { PWPAuthContext } from '../../components/PWPAuthProvider/PWPAuthProvider'

interface AppInformation {
  name: string;
  description: string;
  icon: string;
  url: string;
}

export interface AppsState {
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
    }
  }

  static contextType = PWPAuthContext;

  private appList: AppInformation[] = [
    {
      name: "Timer/Stopwatch", 
      description: "A simple timer app.", 
      icon: "Timer",
      url: "/apps/timer"
    },
    {
      name: "SportEvent",
      description: "Manage the sport events of your clubs.",
      icon: "MoreSports",
      url: "/apps/sportEvent"
    }
  ];

  async componentDidMount() {
  }

  componentWillUnmount() {
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    const { router } = this.props

    if (this.context.user === null) {
      router.push("/login", "/login", { shallow: true })
    }

    if (this.context.user === undefined) {
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
                username={this.context.user?.username} 
                hideLogin={this.context.user} 
                hideLogout={!this.context.user} 
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
                <Footer isLoggedIn={this.context.user} />
              </footer>
            </div>
          </div>
        </PWPLanguageProvider>
      )
    }
  }
}

export default withRouter(withTranslation()(Apps))
