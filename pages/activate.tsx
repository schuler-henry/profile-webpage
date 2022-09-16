import Head from 'next/head'
import React, { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Activate.module.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { I18n, withTranslation, WithTranslation } from 'next-i18next'
import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import { PWPLanguageProvider } from '../components/PWPLanguageProvider/PWPLanguageProvider'
import { PageLoadingScreen } from '../components/PageLoadingScreen/PageLoadingScreen'
import { Icon } from '@fluentui/react/lib/Icon'
import { Button } from '../components/Button/Button'
import { ConfirmPopUp } from '../components/ConfirmPopUp/ConfirmPopUp'

export interface ActivateState {
  isLoggedIn: boolean | undefined;
  currentToken: string;
  activationProcess: boolean;
  activated: boolean;
  username: string;
  activationCode: string;
  showActivateConfirmation: boolean;
}

export interface ActivateProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'activate'])),
    }
  }
}

/**
 * @class Activate Component Class
 * @component
 */
class Activate extends Component<ActivateProps, ActivateState> {
  constructor(props: ActivateProps) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      activationProcess: false,
      activated: undefined,
      username: "",
      activationCode: "",
      showActivateConfirmation: false,
    }
  }
  
  componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
  }
  
  queryActivation = false;

  async componentDidUpdate(prevProps: Readonly<ActivateProps>, prevState: Readonly<ActivateState>, snapshot?: any) {
    if (this.props.router.query["username"] && !this.state.activated && !this.queryActivation) {
      this.queryActivation = true
      this.setState({ username: this.props.router.query["username"].toString() })
      if (this.props.router.query["activationCode"]) {
        this.setState({ activationCode: this.props.router.query["activationCode"].toString() })
        this.activateUser(this.props.router.query["username"].toString(), this.props.router.query["activationCode"].toString())
      } else {
        document.getElementById("activationCodeInput")?.focus()
      }
    }
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
    const currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken)) {
      this.setState({ isLoggedIn: true, currentToken: currentToken })
    } else {
      this.setState({ isLoggedIn: false })
    }
  }

  async activateUser(username: string, activationCode: string) {
    this.setState({ activated: undefined, activationProcess: true, showActivateConfirmation: true })
    const isActivated = await FrontEndController.activateUser(username, activationCode);
    this.setState({ activated: isActivated, activationProcess: false })
  }

  /**
     * This method checks for enter key press in event and calls the activateUser method.
     * @param {any} event Button-Press event
     */
   activateEnter = async (event: any) => {
    if (event.key.toLowerCase() === "enter") {
      event.preventDefault();
      this.activateUser(this.state.username, this.state.activationCode);
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
              <title>{this.props.t('common:Activate')}</title>
              <meta name="description" content="Activate page." />
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
              <title>{this.props.t('common:Activate')}</title>
              <meta name="description" content="Activate page." />
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
                  <div className={styles.activateWrapper}>
                    <div className={styles.inputWrapper}>
                      <h1>{this.props.t('common:Activate')}</h1>
                      <input 
                        type="text"
                        placeholder={this.props.t('activate:Username') + "..."}
                        onChange={(e) => this.setState({ username: e.target.value })}
                        value={this.state.username}
                        onKeyDown={this.activateEnter}
                        autoFocus
                      />
                      <input 
                        type="text"
                        id="activationCodeInput"
                        placeholder={this.props.t('activate:ActivationCode') + "..."}
                        onChange={(e) => this.setState({ activationCode: e.target.value })}
                        value={this.state.activationCode}
                        onKeyDown={this.activateEnter}
                      />
                      <Button width="100%" onClick={() => {this.activateUser(this.state.username, this.state.activationCode)}}>
                        {this.props.t('activate:Activate')}
                      </Button>
                      <p>
                        {this.props.t('activate:Or') + " "}
                        <a onClick={() => router.push("/login")}>
                          {this.props.t('activate:login')}
                        </a>
                        {this.props.t('activate:instead')}.
                      </p>
                    </div>

                    {
                      this.state.showActivateConfirmation &&
                      <ConfirmPopUp 
                        title={this.state.activationProcess ? this.props.t('activate:Activating') + "..." : this.state.activated ? this.props.t('common:Success') : this.props.t('common:Error')}
                        message={`${this.props.t('activate:Username')}: ${this.state.username || "undefined"}\n ${this.props.t('activate:ActivationCode')}: ${this.state.activationCode || "undefined"}\n ${this.state.activated ? "\n" + this.props.t('activate:SuccessText') : ""}`}
                        warning={this.state.activated === false && this.props.t('activate:ErrorText')}
                        onConfirm={
                          !this.state.activationProcess ?
                          async () => {
                            (this.state.activated ? 
                              router.push("/login")
                              :
                              router.push("/activate"))
                            this.setState({ showActivateConfirmation: false, activationCode: "" })
                            document.getElementById("activationCodeInput")?.focus()
                          }
                          :
                          undefined
                        }
                      >
                        <div>
                          {
                            this.state.activationProcess &&
                              <div className={styles.iconWrapper}>
                                <Icon
                                  iconName="Sync"
                                  className={`${styles.spinnerAnimation} ${styles.icon}`}
                                />
                              </div>
                          }
                        </div>
                      </ConfirmPopUp>
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

export default withRouter(withTranslation()(Activate))
