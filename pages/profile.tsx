import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { WebPageController } from '../controller'
import { IUser } from '../interfaces'
import styles from '../styles/Profile.module.css'
import Header from '../components/header'
import Footer from '../components/footer'

export interface ProfileState {
  isLoggedIn: boolean | undefined,
  currentToken: string,
  currentUser: IUser | undefined,
}

export interface ProfileProps extends WithRouterProps {

}

/**
 * @class Home Component Class
 * @component
 */
class Profile extends Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      currentUser: undefined,
    }
  }

  async componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
    this.setState({ currentUser: await WebPageController.getIUserFromToken(WebPageController.getUserToken()) });
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener)
  }

  /**
   * This method checks whether the event contains a change in the user-token. If it does, it updates the login state.
   * @param {any} event Event triggered by an EventListener
   */
  storageTokenListener = async (event: any) => {
    if (event.key === WebPageController.userTokenName) {
      this.updateLoginState();
    }
  }

  /**
   * This method updates the isLoggedIn state and currentToken state according to the current token in local storage.
   * @returns Nothing
   */
  async updateLoginState() {
    let currentToken = WebPageController.getUserToken();
    if (await WebPageController.verifyUserByToken(currentToken)) {
      this.setState({isLoggedIn: true, currentToken: currentToken})
    } else {
      const { router } = this.props
      router.push("/login")
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    if (this.state.isLoggedIn === undefined) {
      return (
        <div>
          <Head>
          <title>Profile</title>
          <meta name="description" content="Profile page." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

          <header>
            <Header username={""} hideLogin={true} hideLogout={true} />
          </header>
        </div>
      )
    } else {

      let getAccessString = (accessLevel: number | undefined): string => {
        switch (accessLevel) {
          case 0:
            return "User";
          case 1:
            return "Admin";
          default:
            return "unavailable";
        }
      }

      return (
        <div>
          <Head>
            <title>Profile</title>
            <meta name="description" content="Profile page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={WebPageController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <main>
            <div className={styles.content}>
              <h1>User: {WebPageController.getUsernameFromToken(WebPageController.getUserToken())}</h1>
              <h2>Information</h2>
              <table>
                <thead>
                  <tr>
                    <td>ID:</td> 
                    <td>{this.state.currentUser?.id || "unavailable"}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Access Level:</td>
                    <td>{getAccessString(this.state.currentUser?.accessLevel)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>

          <footer>
            <Footer />
          </footer>
        </div>
      )
    }
  }
}

export default withRouter(Profile)
