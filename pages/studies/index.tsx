import Head from 'next/head';
import { Component } from 'react'
import { FrontEndController } from '../../controller/frontEndController';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';

export interface StudiesState {
  isLoggedIn: boolean;
  currentToken: string;
}

export interface StudiesProps {

}

class Studies extends Component<StudiesProps, StudiesState> {
  constructor(props: StudiesProps) {
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
    if (event.key === FrontEndController.userTokenName) {
      this.updateLoginState();
    }
  }

  /**
   * This method updates the isLoggedIn state and currentToken state according to the current token in local storage.
   * @returns Nothing
   */
  async updateLoginState() {
    const currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken)) {
      this.setState({isLoggedIn: true, currentToken: currentToken})
      return
    }
    this.setState({isLoggedIn: false})
  }

  render() {
    if (this.state.isLoggedIn === undefined) {
      return (
        <div>
          <Head>
            <title>Studies</title>
            <meta name="description" content="Studies" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={""} hideLogin={true} hideLogout={true} />
          </header>
        </div>
      )
    } else {
      return(
        <div>
          <Head>
            <title>Studies</title>
            <meta name="description" content="Studies" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <main>
            Hallo <br/>
            Get to the <a href="/studies/summaries">summaries</a>!
          </main>

          <footer>
            <Footer isLoggedIn={this.state.isLoggedIn} />
          </footer>
        </div>
      )
    }
  }
}

export default Studies