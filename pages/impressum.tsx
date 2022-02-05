import Head from 'next/head'
import { Component } from 'react'
import { WebPageController } from '../controller'
import styles from '../styles/Home.module.css'
import Header from './header'

export interface ImpressumState {
  isLoggedIn: boolean,
  currentToken: string,
}

export interface ImpressumProps {

}

/**
 * @class Home Component Class
 * @component
 */
class Impressum extends Component<ImpressumProps, ImpressumState> {
  constructor(props: ImpressumProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
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
    if (event.key === "pwp.auth.token") {
      this.updateLoginState();
    }
  }

  /**
   * This method updates the isLoggedIn state and currentToken state according to the current token in local storage.
   * @returns Nothing
   */
  async updateLoginState() {
    let currentToken = localStorage.getItem("pwp.auth.token");
    if (currentToken !== null) {
      if (await WebPageController.verifyUserByToken(currentToken)) {
        this.setState({isLoggedIn: true, currentToken: currentToken})
        return
      }
    }
    this.setState({isLoggedIn: false})
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    return (
      <div>
        <Head>
          <title>Impressum</title>
          <meta name="description" content="Impressum page." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          <Header username={WebPageController.getUserFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
        </header>

        <main>
          <div className={styles.content}>
            <h1>Impressum</h1>
            <h2>Verantwortlich</h2>
            <p>Henry Schuler</p>
            <h2>Kontakt</h2>
            <p>
              Kastellstra&#223;e 69/1 <br />
              88316 Isny im Allg&auml;u <br />
              <br />
              Telefon: &#43;49 1590 8481493 <br />
              E-Mail: henryschuler&#64;outlook.de <br />
            </p>
          </div>
        </main>

        <footer>
        </footer>
      </div>
    )
  }
}

export default Impressum
