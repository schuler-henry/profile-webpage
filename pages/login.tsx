import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import styles from '../styles/Login.module.css'
import Header from './header'

export interface LoginState {

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
            <input type="text" placeholder="Username..." />
            <input type="password" placeholder="Password..." />
            <button>
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
