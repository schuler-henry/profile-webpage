import Head from 'next/head'
import { withRouter } from 'next/router'
import { WithRouterProps } from 'next/dist/client/with-router'
import { Component } from 'react'
import styles from '../styles/Header.module.css'
import { WebPageController } from '../controller'

export interface HeaderState {

}

export interface HeaderProps extends WithRouterProps {
  username: string,
  hideLogin: boolean,
  hideLogout: boolean,
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

    let username;

    if (this.props.hideLogout) {
      username = <></>
    } else {
      username = <td className={styles.td_right && styles.nav}>
                  {this.props.username}
                </td>
    }

    let loginButton;

    if (this.props.hideLogin) {
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

    let logoutButton;

    if (this.props.hideLogout) {
      logoutButton = <></>
    } else {
      logoutButton = <td className={styles.td_right}>
                      <button
                        onClick={() => {
                          WebPageController.logoutUser();
                          location.reload();
                        }
                      }>
                        Logout
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
                  <td 
                    className={styles.td_left && styles.nav} 
                    onClick={() => router.push("/")
                  }>
                    Home
                  </td>
                  <td className={styles.td_space}></td>
                  { username }
                  { loginButton }
                  { logoutButton }
              </tr>
            </tbody>
          </table>
        </main>

      </div>
    )
  }
}

export default withRouter(Header)