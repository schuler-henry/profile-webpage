import Head from 'next/head'
import { Component } from 'react'
import styles from '../styles/Home.module.css'
import Header from './header'

export interface HomeState {

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

    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    return (
      <div>
        <Head>
          <title>Welcome</title>
          <meta name="description" content="Welcome page." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          <Header isLoggedIn={false} />
        </header>

        <main>
          <div className={styles.content}>
            <h1>Hallo</h1>
            <p>Hier passiert noch garnichts.</p>
          </div>
        </main>

        <footer>
        </footer>
      </div>
    )
  }
}

export default Home
