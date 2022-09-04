import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../../controller/frontEndController'
import { ITimer } from '../../interfaces'
import styles from '../../styles/apps/Timer.module.css'
import { Header } from '../../components/header'
import { Footer } from '../../components/footer'
import { I18n, withTranslation, WithTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageLoadingScreen } from '../../components/PageLoadingScreen/PageLoadingScreen'
import { PWPLanguageProvider } from '../../components/PWPLanguageProvider/PWPLanguageProvider'
import { Timer as TimerComponent } from '../../components/Timer/Timer'
import { Icon } from '@fluentui/react'

export interface TimerState {
  isLoggedIn: boolean | undefined;
  currentToken: string;
  timers: ITimer[];
  sync: boolean;
}

export interface TimerProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'timer'])),
    }
  }
}

/**
 * @class Timer-App Component Class
 * @component
 */
class Timer extends Component<TimerProps, TimerState> {
  constructor(props: TimerProps) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      timers: [],
      sync: false,
    }
  }

  async componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
    this.setState({ timers: await FrontEndController.getTimers(FrontEndController.getUserToken()) });
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

  async addTimer() {
    const inputElement = (document.getElementById("addTimerInput") as HTMLInputElement);
    const inputText = inputElement.value.trim();
    if (inputText !== "") {
      inputElement.disabled = true;
      await FrontEndController.addTimer(FrontEndController.getUserToken(), inputText);
      this.setState({ timers: await FrontEndController.getTimers(FrontEndController.getUserToken()) });
      inputElement.value = "";
      inputElement.disabled = false;
    } else {
      inputElement.value = "";
      inputElement.focus();
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
              <title>{this.props.t('common:Timer')}</title>
              <meta name="description" content="Timer page." />
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
              <title>{this.props.t('common:Timer')}</title>
              <meta name="description" content="Timer page." />
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
                  <span className={styles.timerHeader}>
                    <h1>
                      {this.props.t('timer:Timer')}
                    </h1>
                    <span 
                      id={styles.syncTimer}
                      onClick={async () => {
                        this.setState({ sync: true });
                        this.setState({ timers: await FrontEndController.getTimers(FrontEndController.getUserToken()) });
                        this.setState({ sync: false });
                      }}
                    >
                      <Icon 
                        iconName="Sync" 
                        id={styles.syncTimerIcon}
                        className={this.state.sync ? styles.spinnerAnimation : ""}
                      />
                    </span>
                    <span id={styles.addTimer}>
                      <Icon 
                        iconName="Add"
                        id={styles.addTimerIcon}
                        onClick={() => {
                          (document.getElementById("addTimerInput") as HTMLInputElement).focus();
                        }}
                        />
                      <input 
                        type="text" 
                        className={styles.addTimerInput}
                        id="addTimerInput"
                        placeholder={this.props.t('timer:timerName')}
                        onKeyDown={async (event) => {
                          if (event.key === "Enter") {
                            await this.addTimer();
                          }
                        }}
                        />
                      <Icon 
                        iconName="Send"
                        id={styles.submitAddTimerIcon}
                        onClick={async () => {
                          await this.addTimer();
                        }}
                      />
                    </span>
                  </span>
                  <div className={styles.timerGrid}>
                    {
                      this.state.timers?.map((timer: ITimer, id) => {
                        return (
                          <TimerComponent timer={timer} key={"Timer" + id} />
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

export default withRouter(withTranslation()(Timer))
