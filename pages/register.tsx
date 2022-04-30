import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Register.module.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { I18n, withTranslation, WithTranslation } from 'next-i18next'
import { PageLoadingScreen } from '../components/PageLoadingScreen/PageLoadingScreen'
import { PWPLanguageProvider } from '../components/PWPLanguageProvider/PWPLanguageProvider'

export interface RegisterState {
  isNotLoggedIn: boolean,
  username: string,
  password: string,
  confirmPassword: string,
  usernameReqMessage: string,
  passwordReqMessage: string,
  doesUserExist: boolean,
  feedbackMessage: string,
  showRequirements: boolean,
}

export interface RegisterProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'register'])),
    }
  }
}

/**
 * @class Register Component Class
 * @component
 */
class Register extends Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props)
    this.state = {
      isNotLoggedIn: false,
      username: "",
      password: "",
      confirmPassword: "",
      usernameReqMessage: "",
      passwordReqMessage: "",
      doesUserExist: false,
      feedbackMessage: "",
      showRequirements: false,
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
     * This method checks for enter key press in event and calls the registerVerification method.
     * @param {any} event Button-Press event
     */
    const registerEnter = async (event: any) => {
      if (event.key.toLowerCase() === "enter") {
        event.preventDefault();
        registerVerification();
      }
    }

    /**
     * This method registers the user with the currently entered credentials. If the registration was successfull, it routes to root, else all fields are cleared.
     */
    const registerVerification = async () => {
      if (this.state.password === this.state.confirmPassword && this.state.usernameReqMessage === "" && this.state.passwordReqMessage === "") {
        if (await FrontEndController.registerUser(this.state.username, this.state.password)) {
          router.push("/");
        }
        this.setState({ username: "", password: "", confirmPassword: "" });
        document.getElementById("userInput")?.focus();
      }
    }

    /**
     * This method checks whether the entered username meets the needed requirements and sets the usernameReqMessage state accordingly.
     */
    const updateUsernameValid = async () => {
      if (await FrontEndController.isUsernameValid(this.state.username)) {
        this.setState({ usernameReqMessage: "" })
      } else {
        this.setState({ usernameReqMessage: "check username requirements" })
      }
    }

    /**
     * This method checks whether the entered password meets the needed requirements and sets the passwordReqMessage state accordingly.
     */
    const updatePasswordValid = async () => {
      if (await FrontEndController.isPasswordValid(this.state.password)) {
        this.setState({ passwordReqMessage: "" })
      } else {
        this.setState({ passwordReqMessage: "check password requirements" })
      }
    }

    /**
     * This method updates the feedback message for the entered username and password.
     */
    const updateFeedbackMessage = async () => {
      if (this.state.doesUserExist) {
        this.setState({ feedbackMessage: "Username not available." })
      } else if (this.state.password !== this.state.confirmPassword) {
        this.setState({ feedbackMessage: "Passwords do not match." })
      } else if (this.state.username === "" || this.state.password === "" || this.state.confirmPassword === "") {
        this.setState({ feedbackMessage: "" })
      } else {
        this.setState({ feedbackMessage: "" })
      }
    }

    if (this.state.isNotLoggedIn) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:Register')}</title>
              <meta name="description" content="Register page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
              <Header 
                username={""} 
                hideLogin={false} 
                hideLogout={true} 
                path={router.pathname} 
                router={this.props.router}
              />
            </header>
            <div className='scrollBody'>
              <main className={styles.field}>
                <div className={styles.fieldDiv}>
                  <h1>{this.props.t('common:Register')}</h1>
                  <input
                    type="text"
                    placeholder={this.props.t('register:Username') + "..."}
                    id='userInput'
                    autoFocus
                    onChange={async (e) => {
                      this.setState({ username: e.target.value });
                      this.setState({ doesUserExist: await FrontEndController.doesUserExist(e.target.value) });
                      updateFeedbackMessage();
                      updateUsernameValid();
                    }}
                    value={this.state.username}
                    onKeyDown={registerEnter} />
                  <div hidden={this.state.usernameReqMessage === ""} className={styles.inputRequirements}>
                    {this.state.usernameReqMessage}
                  </div>
                  <input
                    type="password"
                    placeholder={this.props.t('register:Password') + "..."}
                    onChange={async (e) => {
                      await this.setState({ password: e.target.value });
                      updateFeedbackMessage();
                      updatePasswordValid();
                    }}
                    value={this.state.password}
                    onKeyDown={registerEnter} />
                  <div hidden={this.state.passwordReqMessage === ""} className={styles.inputRequirements}>
                    {this.state.passwordReqMessage}
                  </div>
                  <input
                    type="password"
                    placeholder={this.props.t('register:ConfirmPassword') + "..."}
                    onChange={async (e) => {
                      await this.setState({ confirmPassword: e.target.value });
                      updateFeedbackMessage();
                    }}
                    value={this.state.confirmPassword}
                    onKeyDown={registerEnter} />
                  <div hidden={this.state.feedbackMessage === ""} className={styles.error} >
                    {this.state.feedbackMessage}
                  </div>
                  <button onClick={async () => {
                    registerVerification()
                  }}>
                    {this.props.t('common:Register')}
                  </button>
                  <div className={styles.flexBox}>
                    <p className={styles.loginInstead}>
                      {this.props.t('register:Or') + " "}
                      <a onClick={() => { router.push("/login") }}>
                        {this.props.t('register:login')}
                      </a>
                      {this.props.t('register:instead')}.
                    </p>
                    <p className={styles.showReq}>
                      <a onClick={() => { this.setState({ showRequirements: !this.state.showRequirements }) }}>
                        {this.props.t('register:showRequirements')}
                      </a>
                    </p>
                  </div>
                </div>
                <div hidden={!this.state.showRequirements} className={styles.requirementsDiv}>
                  <h2>{this.props.t('register:Username')}</h2>
                  <ul>
                    <li>4-16 {this.props.t('register:characters')}</li>
                    <li>{this.props.t('register:onlyNumbersCharacters')}</li>
                    <li>{this.props.t('register:keywordAdmin')}</li>
                  </ul>
                  <h2>{this.props.t('register:Password')}</h2>
                  <ul>
                    <li>min. 8 {this.props.t('register:characters')}</li>
                    <li>min. 1 {this.props.t('register:number')}, 1 {this.props.t('register:lowercase')}, 1 {this.props.t('register:uppercase')}</li>
                    <li>min. 1 {this.props.t('register:of')}: ! * # , ; ? + - _ . = ~ ^ % ( ) &#123; &#125; | : &ldquo; /</li>
                    <li>{this.props.t('register:onlyNumbersCharactersSpecial')}</li>
                  </ul>
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
              <title>{this.props.t('common:Register')}</title>
              <meta name="description" content="Register page." />
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

export default withRouter(withTranslation()(Register))
