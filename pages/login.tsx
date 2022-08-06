import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Login.module.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { I18n, WithTranslation, withTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageLoadingScreen } from '../components/PageLoadingScreen/PageLoadingScreen'
import { PWPLanguageProvider } from '../components/PWPLanguageProvider/PWPLanguageProvider'

export interface LoginState {
  isNotLoggedIn: boolean;
  username: string;
  password: string;
  credentialsInfo: boolean;
  readOnlyInput: boolean;
}

export interface LoginProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'login'])),
    }
  }
}

/**
 * @class Login Component Class
 * @component
 */
class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)
    this.state = {
      isNotLoggedIn: false,
      username: "",
      password: "",
      credentialsInfo: false,
      readOnlyInput: false,
    }
  }

  componentDidMount() {
    this.checkLoginState();
    window.addEventListener('storage', this.storageTokenListener)
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener)
  }

  /**
   * This method checks whether the event contains a change in the user-token. If it does, it verifys the token and routes to root on success.
   * @param {any} event Event triggered by an EventListener
   */
  storageTokenListener = async (event: any) => {
    if (event.key === FrontEndController.userTokenName) {
      this.checkLoginState();
    }
  }

  /**
   * This method checks and verifys the current user-token. If valid, it routes to root, if not, the isNotLoggedIn state is set to true.
   */
  async checkLoginState() {
    let currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken)) {
      const { router } = this.props
      router.push("/")
    } else {
      this.setState({ isNotLoggedIn: true })
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    /**
     * Initialize Router to navigate to other pages
     */
    const { router } = this.props

    /**
     * This method checks for enter key press in event and calls the loginVerification method.
     * @param {any} event Button-Press event
     */
    const loginEnter = async (event: any) => {
      if (event.key.toLowerCase() === "enter") {
        event.preventDefault();
        loginVerification();
      }
    }

    /**
     * This method logs the user in with the currently entered credentials. If the login was successfull, it routes to root, else all fields are cleared.
     */
    const loginVerification = async () => {
      this.setState({ readOnlyInput: true });
      if (await FrontEndController.loginUser(this.state.username, this.state.password)) {
        router.push("/");
      } else {
        this.setState({ username: "", password: "", credentialsInfo: true })
        document.getElementById("userInput")?.focus()
        this.setState({ readOnlyInput: false });
      }
    }

    if (this.state.isNotLoggedIn) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:Login')}</title>
              <meta name="description" content="Login page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
              <Header 
                username={""} 
                hideLogin={true} 
                hideLogout={true} 
                path={router.pathname} 
                router={this.props.router}
              />
            </header>

            <div className='scrollBody'>
              <main className={styles.field}>
                <div className={styles.fieldDiv}>
                  <h1>{this.props.t('common:Login')}</h1>
                  <input
                    type="text"
                    placeholder={this.props.t('login:Username') + "..."}
                    id='userInput'
                    autoFocus
                    onChange={(e) => this.setState({ username: e.target.value })}
                    value={this.state.username}
                    onKeyDown={loginEnter}
                    readOnly={this.state.readOnlyInput} />
                  <input
                    type="password"
                    placeholder={this.props.t('login:Password') + "..."}
                    onChange={(e) => this.setState({ password: e.target.value })}
                    value={this.state.password}
                    onKeyDown={loginEnter}
                    readOnly={this.state.readOnlyInput} />
                  <div hidden={!this.state.credentialsInfo} className={styles.error} >
                    {this.props.t('login:errorMessage')}!
                  </div>
                  <button onClick={loginVerification}>
                    {this.props.t('common:Login')}
                  </button>
                  <p>
                    {this.props.t('login:Or') + " "}
                    <a onClick={() => router.push("/register")}>
                      {this.props.t('login:register')}
                    </a>
                    {this.props.t('login:instead')}.
                  </p>
                </div>
              </main>

              <footer>
                <Footer isLoggedIn={!this.state.isNotLoggedIn} />
              </footer>
            </div>
          </div>
        </PWPLanguageProvider>
      )
    } else {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:Login')}</title>
              <meta name="description" content="Login page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
              <PageLoadingScreen />
            </main>
          </div>
        </PWPLanguageProvider>
      )
    }
  }
}

export default withRouter(withTranslation()(Login))
