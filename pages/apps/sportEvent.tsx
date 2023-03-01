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
import { compareSportEvents } from '../../shared/compareSportEvents'
import { ClickableIcon } from '../../components/ClickableIcon/ClickableIcon'
import { ConfirmPopUp } from '../../components/ConfirmPopUp/ConfirmPopUp'

export interface SportEventState {
  sync: boolean;
  sportEvents: ISportEvent[];
  newSportEvents: ISportEvent[];
  confirmPull: boolean;
  confirmSync: boolean;
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
  private sportEventCache: ISportEvent[] = [];
  private newSportEventCache: ISportEvent[] = [];
  constructor(props: SportEventProps) {
    super(props)
    this.state = {
      sync: false,
      sportEvents: [],
      newSportEvents: [],
      confirmPull: false,
      confirmSync: false,
      updating: false,
    }
  }

  static contextType = PWPAuthContext;

  async componentDidMount() {
    await this.pullDataFromServer();
  }

  componentWillUnmount() {
  }

  private addNewSportEvent() {
    const newSportEvent = {
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
    }
    this.newSportEventCache.push(newSportEvent);
    this.setState({ newSportEvents: [...this.state.newSportEvents, newSportEvent] });
  }

  private async pullDataFromServer() {
    this.setState({ updating: true })
    this.sportEventCache = await FrontEndController.getSportEvents(FrontEndController.getUserToken());
    this.setState({ sportEvents: this.sportEventCache, updating: false });
  }

  private async syncDataFromServer() {
    this.setState({ updating: true })

    const remoteSportEvents = await FrontEndController.getSportEvents(FrontEndController.getUserToken());

    this.sportEventCache.slice().map((sportEvent, index) => {
      const hasChanged = !compareSportEvents(sportEvent, this.state.sportEvents[this.getSportEventStateIndex(sportEvent.id)]);
      const correspondingRemoteSportEvent = remoteSportEvents.find((remoteSportEvent) => remoteSportEvent.id === sportEvent.id);

      if (hasChanged) {
        if (correspondingRemoteSportEvent !== undefined) {
          this.sportEventCache[this.getSportEventCacheIndex(sportEvent.id)] = correspondingRemoteSportEvent;
        } else {
          // remove sportEvent from sportEventCache
          this.sportEventCache.splice(this.getSportEventCacheIndex(sportEvent.id), 1);
          // add empty sport event to newSportEventCache
          this.addNewSportEvent();
          const changedSportEvent = this.state.sportEvents[this.getSportEventStateIndex(sportEvent.id)];
          // remove changedSportEvent from sportEvents and set to newSportEvents
          this.setState({ 
            sportEvents: [ ...this.state.sportEvents.slice(0, this.getSportEventStateIndex(sportEvent.id)), ...this.state.sportEvents.slice(this.getSportEventStateIndex(sportEvent.id) + 1)], 
            newSportEvents: [ ...this.state.newSportEvents.slice(0, this.state.newSportEvents.length - 1), changedSportEvent ]
          })
        }
      } else {
        if (correspondingRemoteSportEvent !== undefined) {
          this.sportEventCache[this.getSportEventCacheIndex(sportEvent.id)] = correspondingRemoteSportEvent;
          this.setState({ sportEvents: [ ...this.state.sportEvents.slice(0, this.getSportEventStateIndex(sportEvent.id)), correspondingRemoteSportEvent, ...this.state.sportEvents.slice(this.getSportEventStateIndex(sportEvent.id) + 1) ] })
        } else {
          this.sportEventCache.splice(this.getSportEventCacheIndex(sportEvent.id), 1);
          this.setState({ sportEvents: [ ...this.state.sportEvents.slice(0, this.getSportEventStateIndex(sportEvent.id)), ...this.state.sportEvents.slice(this.getSportEventStateIndex(sportEvent.id) + 1)] })
        }
      }

      remoteSportEvents.splice(remoteSportEvents.indexOf(correspondingRemoteSportEvent), 1);
    })

    remoteSportEvents.map((sportEvent: ISportEvent) => {
      this.sportEventCache.push(sportEvent);
      this.setState({ sportEvents: [ ...this.state.sportEvents, sportEvent ] })
    })

    this.setState({ updating: false });
  }

  private getSportEventFromCache(id: number): ISportEvent {
    return this.sportEventCache.find((sportEvent) => sportEvent.id === id);
  }

  private getSportEventCacheIndex(id: number): number {
    return this.sportEventCache.findIndex((sportEvent) => sportEvent.id === id);
  }

  private getSportEventStateIndex(id: number): number {
    return this.state.sportEvents.findIndex((sportEvent) => sportEvent.id === id);
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
                {
                  this.state.updating &&
                    <div style={{ position: "absolute", top: "0", left: "0", bottom: "0", right: "0", zIndex: "50000", backgroundColor: "rgba(0,0,0,0.6)" }}>
                      <PageLoadingScreen />
                    </div>
                }
                <div className={styles.content}>
                  <span className={styles.sportEventHeader}>
                    <h1>
                      {this.props.t('common:SportEvent')}
                    </h1>
                    <ClickableIcon 
                      style={{ marginLeft: "10px" }}
                      iconName="Download"
                      onClick={() => {
                        this.setState({ confirmPull: true })
                      }}
                    />
                    <ClickableIcon
                      style={{ marginLeft: "10px" }}
                      iconName="Sync"
                      onClick={() => {
                        this.setState({ confirmSync: true });
                      }}
                      spin={this.state.updating}
                    />
                    <ClickableIcon 
                      style={{ marginLeft: "10px" }}
                      iconName="Add"
                      onClick={() => {
                        this.addNewSportEvent();
                      }}
                    />
                    {
                      this.state.confirmPull &&
                      <ConfirmPopUp 
                        title={this.props.t('sport:ConfirmPull')}
                        message={this.props.t('sport:ConfirmPullMessage')}
                        warning={this.props.t('sport:ConfirmPullWarning')}
                        onConfirm={() => {
                          this.pullDataFromServer();
                          this.setState({ confirmPull: false });
                        }}
                        onCancel={() => {
                          this.setState({ confirmPull: false });
                        }}
                      />
                    }
                    {
                      this.state.confirmSync &&
                      <ConfirmPopUp 
                        title={this.props.t('sport:ConfirmSync')}
                        message={this.props.t('sport:ConfirmSyncMessage')}
                        onConfirm={async () => {
                          this.setState({ confirmSync: false });
                          await this.syncDataFromServer();
                        }}
                        onCancel={() => {
                          this.setState({ confirmSync: false });
                        }}
                      />
                    }
                  </span>
                  <div className={styles.gridView}>
                    {
                      this.state.newSportEvents.map((sportEvent, index) => {
                        return (
                          <SportEventItem 
                            key={index}
                            sportEvent={sportEvent}
                            changed={!compareSportEvents(sportEvent, this.newSportEventCache[index])}
                            isCreator={true}
                            onChange={(sportEvent: ISportEvent) => {
                              this.setState({ newSportEvents: [ ...this.state.newSportEvents.slice(0, index), sportEvent, ...this.state.newSportEvents.slice(index + 1) ] });
                            }}
                            onDelete={() => {
                              this.newSportEventCache = [ ...this.newSportEventCache.slice(0, index), ...this.newSportEventCache.slice(index + 1) ];
                              this.setState({ newSportEvents: [ ...this.state.newSportEvents.slice(0, index), ...this.state.newSportEvents.slice(index + 1) ] });
                            }}
                            onDiscard={() => {
                              this.setState({ newSportEvents: [ ...this.state.newSportEvents.slice(0, index), this.newSportEventCache[index], ...this.state.newSportEvents.slice(index + 1) ] });
                            }}
                            onSave={() => {
                              // TODO:
                              // create sportEvent -> fetch sport events -> update function that compares fetched sport events with cached sport events
                            }}
                          />
                        )
                      })
                    }
                    {
                      // list existing sport events sorted by start time
                      this.state.sportEvents.sort((a, b) => a.startTime < b.startTime ? 1 : -1).map((sportEvent, index) => {
                        return(
                          <SportEventItem 
                            key={index} 
                            sportEvent={sportEvent} 
                            changed={!compareSportEvents(sportEvent, this.getSportEventFromCache(sportEvent.id))}
                            isCreator={sportEvent.creator?.id === this.context.user?.id}
                            onChange={(sportEvent: ISportEvent) => {
                              // evaluate index (due to sorting)
                              const index = this.state.sportEvents.findIndex((stateSportEvent) => stateSportEvent.id === sportEvent.id);
                              this.setState({
                                sportEvents: [ ...this.state.sportEvents.slice(0, index), sportEvent, ...this.state.sportEvents.slice(index + 1) ]
                              })
                            }}
                            onDelete={() => {
                              // TODO: Delete in databank and update sport events
                            }}
                            onDiscard={() => {
                              // evaluate index (due to sorting)
                              const index = this.state.sportEvents.findIndex((stateSportEvent) => stateSportEvent.id === sportEvent.id);
                              // restore sport event from cache
                              this.setState({ sportEvents: [ ...this.state.sportEvents.slice(0, index), this.getSportEventFromCache(sportEvent.id), ...this.state.sportEvents.slice(index + 1) ] });
                            }}
                            onSave={() => {
                              // TODO: Save to databank and update sport events
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
