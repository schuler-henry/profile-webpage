import Head from 'next/head'
import { Component } from 'react'
import { WebPageController } from '../controller'
import styles from '../styles/Home.module.css'
import Header from './header'

export interface HomeState {
  isLoggedIn: boolean | undefined,
  currentToken: string,
}

export interface HomeProps {

}

/**
 * @class Home Component Class
 * @component
 */
class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
    }
  }

  componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
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
      return
    }
    this.setState({isLoggedIn: false})
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
            <title>Welcome</title>
            <meta name="description" content="Welcome page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={""} hideLogin={true} hideLogout={true} />
          </header>
        </div>
      )
    } else {
      return (
        <div>
          <Head>
            <title>Welcome</title>
            <meta name="description" content="Welcome page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={WebPageController.getUserFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <main>
            <div className={styles.content}>
              <h1>Willkommen!</h1>
              <p>Hier passiert noch garnichts.</p>
            </div>
          </main>

          <footer>
          </footer>
        </div>
      )
    }
  }
}

export default Home
