import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import { User } from '../interfaces'
import styles from '../styles/Profile.module.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { I18n, withTranslation, WithTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export interface ProfileState {
  isLoggedIn: boolean | undefined;
  currentToken: string;
  currentUser: User | undefined;
}

export interface ProfileProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'profile'])),
    }
  }
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
    this.setState({ currentUser: await FrontEndController.getUserFromToken(FrontEndController.getUserToken()) });
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
    let currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken)) {
      this.setState({ isLoggedIn: true, currentToken: currentToken })
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
    const { router } = this.props
    if (this.state.isLoggedIn === undefined) {
      return (
        <div>
          <Head>
            <title>{this.props.t('common:Profile')}</title>
            <meta name="description" content="Profile page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header 
              username={""} 
              hideLogin={true} 
              hideLogout={true} 
              path={router.pathname} 
              i18n={this.props.i18n} 
              router={this.props.router}
              t={this.props.t}
            />
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
            <title>{this.props.t('common:Profile')}</title>
            <meta name="description" content="Profile page." />
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
                <h1>{this.props.t('profile:User')}: {FrontEndController.getUsernameFromToken(FrontEndController.getUserToken())}</h1>
                <h2>{this.props.t('profile:Information')}</h2>
                <table>
                  <thead>
                    <tr>
                      <td>ID:</td>
                      <td>{this.state.currentUser?.id || "unavailable"}</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{this.props.t('profile:AccessLevel')}:</td>
                      <td>{getAccessString(this.state.currentUser?.accessLevel)}</td>
                    </tr>
                  </tbody>
                </table>
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

export default withRouter(withTranslation()(Profile))
