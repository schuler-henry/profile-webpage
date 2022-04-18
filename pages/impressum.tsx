import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Impressum.module.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { I18n, withTranslation, WithTranslation } from 'next-i18next'
import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import { PageLoadingScreen } from '../components/PageLoadingScreen/PageLoadingScreen'

export interface ImpressumState {
  isLoggedIn: boolean | undefined;
  currentToken: string;
}

export interface ImpressumProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'impressum'])),
    }
  }
}

/**
 * @class Home Component Class
 * @component
 */
class Impressum extends Component<ImpressumProps, ImpressumState> {
  constructor(props: ImpressumProps) {
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
      this.setState({ isLoggedIn: true, currentToken: currentToken })
      return
    }
    this.setState({ isLoggedIn: false })
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
            <title>{this.props.t('common:Impressum')}</title>
            <meta name="description" content="Impressum page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main>
            <PageLoadingScreen t={this.props.t} />
          </main>
        </div>
      )
    } else {
      return (
        <div>
          <Head>
            <title>{this.props.t('common:Impressum')}</title>
            <meta name="description" content="Impressum page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header 
              username={FrontEndController.getUsernameFromToken(this.state.currentToken)} 
              hideLogin={this.state.isLoggedIn} 
              hideLogout={!this.state.isLoggedIn} 
              path={router.pathname} 
              i18n={this.props.i18n} 
              router={this.props.router}
              t={this.props.t}
            />
          </header>

          <div className='scrollBody'>
            <main>
              <div className={styles.content}>
                <h1>{this.props.t('common:Impressum')}</h1>
                <h2>{this.props.t('impressum:Responsible')}</h2>
                <p>Henry Schuler</p>
                <h2>{this.props.t('impressum:Contact')}</h2>
                <p>
                  Henry Schuler <br />
                  Kastellstra&#223;e 69/1 <br />
                  88316 Isny im Allg&auml;u <br />
                  <br />
                  {this.props.t('impressum:Phone')}: &#43;49 1590 8481493 <br />
                  E-Mail: henryschuler&#64;outlook.de <br />
                </p>
              </div>
            </main>

            <footer>
              <Footer isLoggedIn={this.state.isLoggedIn} />
            </footer>
          </div>
        </div>
      )
    }
  }
}

export default withRouter(withTranslation()(Impressum))
