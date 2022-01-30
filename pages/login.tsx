import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { WebPageController } from '../controller'
import styles from '../styles/Login.module.css'
import Header from './header'

export interface LoginState {
  username: string,
  password: string,
  credentialsInfo: boolean,
}

export interface LoginProps extends WithRouterProps {

}

/**
 * @class Login Component Class
 * @component
 */
class Login extends Component<LoginProps, LoginState> {
  constructor (props: LoginProps) {
    super(props)
    this.state = {
      username: "",
      password: "",
      credentialsInfo: false,
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

    const loginEnter = async (event: any) => {
      if (event.key.toLowerCase() === "enter") {
        event.preventDefault();
        if (await WebPageController.verifyUser(this.state.username, this.state.password)) {
          router.push("/");
        }
        this.setState({username: "", password: "", credentialsInfo: true})
      }
    }

    return (
      <div>
        <Head>
          <title>Login</title>
          <meta name="description" content="Login page." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          <Header isLoggedIn={true} />
        </header>

        <main>
          <div className={styles.fieldDiv}>
            <h1>Login</h1>
            <input 
              type="text" 
              placeholder="Username..." 
              onChange={(e) => this.setState({username: e.target.value})}
              value={this.state.username}
              onKeyDown={loginEnter} />
            <input 
              type="password" 
              placeholder="Password..."
              onChange={(e) => this.setState({password: e.target.value})}
              value={this.state.password}
              onKeyDown={loginEnter} />
            <div hidden={!this.state.credentialsInfo} className={styles.error} >
              Credentials incorrect!
            </div>
            <button onClick={async () => {
              if (await WebPageController.verifyUser(this.state.username, this.state.password)) {
                router.push("/");
              }
              this.setState({username: "", password: "", credentialsInfo: true})
            }}>
              Login
            </button>
            <p>
              Or&nbsp;
              <a onClick={() => router.push("/register")}>
                register
              </a>
              &nbsp;instead.
            </p>
          </div>
        </main>
      </div>
    )
  }
}

export default withRouter(Login)
