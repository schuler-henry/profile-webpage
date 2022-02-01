import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { WebPageController } from '../controller'
import styles from '../styles/Register.module.css'
import Header from './header'

export interface RegisterState {
  username: string,
  password: string,
  confirmPassword: string,
  doesUserExist: boolean,
  feedbackMessage: string,
}

export interface RegisterProps extends WithRouterProps {

}

/**
 * @class Register Component Class
 * @component
 */
class Register extends Component<RegisterProps, RegisterState> {
  constructor (props: RegisterProps) {
    super(props)
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      doesUserExist: false,
      feedbackMessage: "",
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

    const registerEnter = async (event: any) => {
      if (event.key.toLowerCase() === "enter") {
        event.preventDefault();
        registerVerification();
      }
    }

    const registerVerification = async () => {
      if (this.state.password === this.state.confirmPassword) {
        if (await WebPageController.registerUser(this.state.username, this.state.password)) {
          router.push("/");
        }
        this.setState({username: "", password: "", confirmPassword: ""});
        document.getElementById("userInput")?.focus();
      }
    }

    const updateFeedbackMessage = async () => {
      // Add check requirements!
      console.log("HI")
      console.log(this.state.doesUserExist)
      if (this.state.doesUserExist) {
        this.setState({feedbackMessage: "Username not available."})
      } else if (this.state.password !== this.state.confirmPassword) {
        this.setState({feedbackMessage: "Passwords do not match."})
      } else if (this.state.username === "" || this.state.password === "" || this.state.confirmPassword === "") {
        this.setState({feedbackMessage: ""})
      } else {
        this.setState({feedbackMessage: ""})
      }
    }

    return (
      <div>
        <Head>
          <title>Register</title>
          <meta name="description" content="Register page." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          <Header isLoggedIn={false} />
        </header>

        <main>
          <div className={styles.fieldDiv}>
            <h1>Register</h1>
            <input 
              type="text" 
              placeholder="Username..." 
              id='userInput'
              autoFocus
              onChange={async (e) => {
                this.setState({username: e.target.value});
                this.setState({doesUserExist: await WebPageController.doesUserExist({name: e.target.value})});
                updateFeedbackMessage();
              }}
              value={this.state.username}
              onKeyDown={registerEnter} />
            <input 
              type="password" 
              placeholder="Password..."
              onChange={async (e) => {
                await this.setState({password: e.target.value});
                updateFeedbackMessage();
              }}
              value={this.state.password}
              onKeyDown={registerEnter} />
            <input 
              type="password" 
              placeholder="Confirm password..."
              onChange={async (e) => {
                await this.setState({confirmPassword: e.target.value});
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
              Register
            </button>
            <p>
              Or&nbsp;
              <a onClick={() => router.push("/login")}>
                login
              </a>
              &nbsp;instead.
            </p>
          </div>
        </main>
      </div>
    )
  }
}

export default withRouter(Register)
