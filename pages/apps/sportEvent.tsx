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
import { SportEventVisibility } from '../../enums/sportEventVisibility'
import { Icon } from '@fluentui/react'

export interface SportEventState {
  sync: boolean;
  sportEvents: ISportEvent[];
  newSportEvents: ISportEvent[];
  updating: boolean;
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
      sportEvents: [],
      newSportEvents: [],
      updating: false,
    }
  }

  static contextType = PWPAuthContext;

  async componentDidMount() {
    this.setState({ updating: true })
    this.setState({ sportEvents: await FrontEndController.getSportEvents(FrontEndController.getUserToken()), updating: false });
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
                    {/* Item for adding new sport events */}
                    <div 
                      className={styles.addSportEvent}
                      onClick={() => {
                        this.setState({ newSportEvents: [...this.state.newSportEvents, {
                          id: undefined,
                          startTime: undefined,
                          endTime: undefined,
                          description: "",
                          visibility: SportEventVisibility.public,
                          creator: this.context.user,
                          sport: undefined,
                          sportLocation: undefined,
                          sportEventType: undefined,
                          sportClubs: [],
                          sportMatch: [],
                        }] });
                      }}
                    >
                      <Icon 
                        iconName="Add"
                        style={{ fontSize: "30px" }}
                        className={styles.addSportEventIcon}
                      />
                    </div>
                    {
                      this.state.newSportEvents.map((sportEvent, index) => {
                        return (
                          <SportEventItem 
                            key={index}
                            sportEvent={sportEvent}
                            isCreator={true}
                            onChange={async () => {
                              this.setState({ updating: true });
                              this.setState({ 
                                newSportEvents: [ ...this.state.newSportEvents.slice(0, index), ...this.state.newSportEvents.slice(index + 1) ],
                                sportEvents: await FrontEndController.getSportEvents(FrontEndController.getUserToken()),
                                updating: false,
                              });
                            }}
                          />
                        )
                      })
                    }
                    {
                      this.state.updating &&
                        <div style={{ position: "absolute", top: "0", left: "0", bottom: "0", right: "0", zIndex: "50000", backgroundColor: "rgba(0,0,0,0.6)" }}>
                          <PageLoadingScreen />
                        </div>
                    }
                    {
                      // list existing sport events sorted by start time
                      this.state.sportEvents.sort((a, b) => a.startTime < b.startTime ? 1 : -1).map((sportEvent, index) => {
                        return(
                          <SportEventItem 
                            key={index} 
                            sportEvent={sportEvent} 
                            isCreator={sportEvent.creator.id === this.context.user?.id}
                            onChange={async () => {
                              this.setState({ updating: true });
                              this.setState({ sportEvents: await FrontEndController.getSportEvents(FrontEndController.getUserToken()), updating: false });
                            }}
                          />
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
