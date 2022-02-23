import Head from 'next/head'
import { Component } from 'react'
import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import { WebPageController } from '../controller'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../components/header'
import Footer from '../components/footer'
import DevChatLogo from '../public/Dev-Chat.png'
import GitHubIcon from '../public/GitHub.png'

export interface HomeState {
  isLoggedIn: boolean | undefined,
  currentToken: string,
  cursorClass: any,
  headerText: string,
}

export interface HomeProps extends WithRouterProps {

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
      cursorClass: null,
      headerText: "",
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
      this.setState({isLoggedIn: true, currentToken: currentToken});
    } else {
      this.setState({isLoggedIn: false})
    }
    this.typeWriter("Coding Musik Freizeit");
  }

  /**
   * This mehtods types the header to the main page.
   * @param {string} text String to display as header.
   */
  typeWriter(text: string) {
    let letterWait: number = 80;
    if (this.state.cursorClass == null) {
      this.setState({cursorClass: styles.cursor})
      setTimeout(() => {
        this.typeWriter(text)
      }, 1000)
    } else if (this.state.headerText != text) {
      let index: number = this.state.headerText.length;
      this.setState({headerText: this.state.headerText + text.charAt(index)})
      if (text.charAt(index + 1) == ' ') {
        letterWait = 880;
      }
      setTimeout(() => {
        this.typeWriter(text)
      }, letterWait)
    } else {
      setTimeout(() => {
        this.setState({cursorClass: null})
      }, 1000)
    }    
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {

    const { router } = this.props

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
            <Header username={WebPageController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <main>
            <div className={styles.contentOne}>
              <div>
                <h1 className={this.state.cursorClass}>{this.state.headerText}</h1>
              </div>
              <div className={styles.slideWrapper}>
                <div className={`${styles.slide} ${styles.slideOne}`}>
                  Hallo
                </div>
                <div className={`${styles.slide} ${styles.slideTwo}`}>
                  <div className={styles.slideIcon}>
                    <Image 
                      src={GitHubIcon} 
                      objectFit='contain'
                      sizes='fitContent'
                      layout='fill'
                      alt='GitHub Icon'
                    />
                  </div>
                </div>
                <div className={`${styles.slide} ${styles.slideThree}`}>
                  <Image 
                    src={DevChatLogo} 
                    objectFit='contain'
                    sizes='fitContent'
                    layout='fill'
                    alt='Dev-Chat Logo'
                  />
                </div>
              </div>
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

export default withRouter(Home)
