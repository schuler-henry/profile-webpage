import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../../controller/frontEndController'
import styles from '../../styles/apps/SportEvent.module.css'
import { Header } from '../../components/header'
import { Footer } from '../../components/footer'
import { I18n, withTranslation, WithTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageLoadingScreen } from '../../components/PageLoadingScreen/PageLoadingScreen'
import { PWPLanguageProvider } from '../../components/PWPLanguageProvider/PWPLanguageProvider'
import { PWPAuthContext } from '../../components/PWPAuthProvider/PWPAuthProvider'
import { ISportEvent } from '../../interfaces/database'
import { SportEventItem } from '../../components/SportEventItem/SportEventItem'

export interface SportEventState {
  sync: boolean;
  sportEvents: ISportEvent[];
}

export interface SportEventProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'sport'])),
    }
  }
}

/**
 * @class SportEvent-App Component Class
 * @component
 */
class SportEvent extends Component<SportEventProps, SportEventState> {
  constructor(props: SportEventProps) {
    super(props)
    this.state = {
      sync: false,
      sportEvents: [{ id : 0, description : "Erster Spieltag in der Runde 2022, Heimspieltag", startTime : new Date(), endTime : new Date(), visibility : 1, creator : undefined, sport : {id: 1, name: "Volleyball"}, sportLocation : undefined, sportEventType : {id: 1, name: "Spieltag"}, sportClubs : undefined, sportMatch : undefined }],
    }
  }

  static contextType = PWPAuthContext;

  async componentDidMount() {
    this.setState({ sportEvents: this.state.sportEvents.concat(await FrontEndController.getSportEvents(FrontEndController.getUserToken())) });
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
      router.push("/login", "/login", { shallow: true });
    }

    if (this.context.user === undefined) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:SportEvent')}</title>
              <meta name="description" content="Sport event page." />
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
              <title>{this.props.t('common:SportEvent')}</title>
              <meta name="description" content="Sport event page." />
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
                  <span className={styles.sportEventHeader}>
                    <h1>
                      {this.props.t('common:SportEvent')}
                    </h1>
                  </span>
                  <div className={styles.gridView}>
                    {
                      this.state.sportEvents.map((sportEvent, index) => {
                        return(
                          <SportEventItem key={index} sportEvent={sportEvent} />
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

export default withRouter(withTranslation()(SportEvent))
