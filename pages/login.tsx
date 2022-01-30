import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { WebPageController } from '../controller'
import styles from '../styles/Login.module.css'
import Header from './header'

export interface LoginState {
  username: string,
  password: string,
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
      username: "Admin",
      password: "admin",
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
              value={this.state.username} />
            <input 
              type="password" 
              placeholder="Password..."
              onChange={(e) => this.setState({password: e.target.value})}
              value={this.state.password} />
            <button onClick={async () => {
              if (await WebPageController.verifyUser(this.state.username, this.state.password)) {
              router.push("/");
            }}}>
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
