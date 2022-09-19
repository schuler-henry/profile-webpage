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
import { Button } from '../components/Button/Button'
import { PWPAuthContext } from '../components/PWPAuthProvider/PWPAuthProvider'

export interface LoginState {
  username: string;
  password: string;
  credentialsInfo: boolean;
  readOnlyInput: boolean;
}

export interface LoginProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'login'])),
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
      username: "",
      password: "",
      credentialsInfo: false,
      readOnlyInput: false,
    }
  }

  static contextType = PWPAuthContext;

  componentDidMount() {
  }

  componentWillUnmount() {
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

    if (this.context.user) {
      router.push('/', '/', { shallow: true })
    }

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
      const login = await FrontEndController.loginUser(this.state.username, this.state.password)
      if (login === "") {
        this.setState({ username: "", password: "", credentialsInfo: true })
        document.getElementById("userInput")?.focus()
        this.setState({ readOnlyInput: false });
      } else if (login === "inactive") {
        // TODO: PopUp / Message that account is inactive and needs to be activated
        router.push("/activate", "/activate", { shallow: true })
      } else {
        localStorage.setItem(FrontEndController.userTokenName, login)
        FrontEndController.updateLoginStatus();
        router.push("/", "/", { shallow: true });
      }
    }

    if (this.context.user === null) {
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
                  <Button width="100%" onClick={loginVerification}>
                    {this.props.t('common:Login')}
                  </Button>
                  <div className={styles.flexBox}>
                    <p className={styles.loginInstead}>
                      {this.props.t('login:Or') + " "}
                      <a onClick={() => { router.push("/register") }}>
                        {this.props.t('login:register')}
                      </a>
                      {this.props.t('login:instead')}.
                    </p>
                    <p className={styles.activateInstead}>
                      {this.props.t('login:Or') + " "}
                      <a onClick={() => { router.push("/activate") }}>
                        {this.props.t('login:activate')}
                      </a>
                      {this.props.t('login:instead')}.
                    </p>
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
