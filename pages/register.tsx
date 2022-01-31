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
      if (await WebPageController.registerUser(this.state.username, this.state.password)) {
        router.push("/");
      }
      this.setState({username: "", password: "", confirmPassword: ""});
      document.getElementById("userInput")?.focus();
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
              onChange={(e) => this.setState({username: e.target.value})}
              value={this.state.username}
              onKeyDown={registerEnter} />
            <input 
              type="password" 
              placeholder="Password..."
              onChange={(e) => this.setState({password: e.target.value})}
              value={this.state.password}
              onKeyDown={registerEnter} />
            <input 
              type="password" 
              placeholder="Confirm password..."
              onChange={(e) => this.setState({confirmPassword: e.target.value})}
              value={this.state.confirmPassword}
              onKeyDown={registerEnter} />
            <button onClick={async () => {
              if (await WebPageController.registerUser(this.state.username, this.state.password)) {
                router.push("/");
              }
              this.setState({username: "", password: "", confirmPassword: ""})
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
