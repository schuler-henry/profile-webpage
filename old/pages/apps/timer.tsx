import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../../controller/frontEndController'
import { ITimer } from '../../interfaces/database'
import styles from '../../styles/apps/Timer.module.css'
import { Header } from '../../components/header'
import { Footer } from '../../components/footer'
import { I18n, withTranslation, WithTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageLoadingScreen } from '../../components/PageLoadingScreen/PageLoadingScreen'
import { PWPLanguageProvider } from '../../components/PWPLanguageProvider/PWPLanguageProvider'
import { Timer as TimerComponent } from '../../components/Timer/Timer'
import { Icon } from '@fluentui/react'
import { PWPAuthContext } from '../../components/PWPAuthProvider/PWPAuthProvider'

export interface TimerState {
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
      timers: [],
      sync: false,
    }
  }

  static contextType = PWPAuthContext;

  async componentDidMount() {
    this.setState({ timers: await FrontEndController.getTimers(FrontEndController.getUserToken()) });
  }

  componentWillUnmount() {
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

    if (this.context.user === null) {
      router.push("/login", "/login", { shallow: true });
    }

    if (this.context.user === undefined) {
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
                <Footer isLoggedIn={this.context.user} />
              </footer>
            </div>
          </div>
        </PWPLanguageProvider>
      )
    }
  }
}

export default withRouter(withTranslation()(Timer))
