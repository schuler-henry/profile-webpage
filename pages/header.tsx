import Head from 'next/head'
import { withRouter } from 'next/router'
import { WithRouterProps } from 'next/dist/client/with-router'
import { Component } from 'react'
import styles from '../styles/Header.module.css'

export interface HeaderState {

}

export interface HeaderProps extends WithRouterProps {
  isLoggedIn: boolean,
}

/** 
 * @class Header Component Class
 * @component
 */
class Header extends Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
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

    let loginButton;

    if (this.props.isLoggedIn) {
      loginButton = <></>
    } else {
      loginButton = <td className={styles.td_right}>
                      <button 
                        onClick={() => router.push("/login")
                      }>
                        Login
                      </button>
                    </td>
    }

    return (
      <div>
        <Head>
          <title>Header</title>
          <meta name="description" content="Header." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <table className={styles.table}>
            <tbody>
              <tr>
                  <td className={styles.td_left && styles.nav} 
                    onClick={() => router.push("/")
                  }>
                    Home
                  </td>
                  <td className={styles.td_space}></td>
                  { loginButton }
              </tr>
            </tbody>
          </table>
        </main>

      </div>
    )
  }
}

export default withRouter(Header)