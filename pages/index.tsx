import Head from 'next/head'
import { Component } from 'react'
import styles from '../styles/Home.module.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { I18n, WithTranslation, withTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import { PageLoadingScreen } from '../components/PageLoadingScreen/PageLoadingScreen'
import { PWPLanguageProvider } from '../components/PWPLanguageProvider/PWPLanguageProvider'
import { PWPAuthContext } from '../components/PWPAuthProvider/PWPAuthProvider'

export interface HomeState {
  cursorClass: any;
  headerText: string;
}

export interface HomeProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'home'])),
    }
  }
}

/**
 * @class Home Component Class
 * @component
 */
class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props)
    this.state = {
      cursorClass: null,
      headerText: "",
    }
  }

  static contextType = PWPAuthContext;
  
  componentDidMount() {
    this.typeWriter(this.props.t('home:slogan'));
  }

  componentWillUnmount() {
  }

  /**
   * This methods types the header to the main page.
   * @param {string} text String to display as header.
   */
  typeWriter(text: string) {
    let letterWait: number = 80;
    if (this.state.cursorClass == null) {
      this.setState({ cursorClass: styles.cursor })
      setTimeout(() => {
        this.typeWriter(text)
      }, 1000)
    } else if (this.state.headerText != text) {
      let index: number = this.state.headerText.length;
      this.setState({ headerText: this.state.headerText + text.charAt(index) })
      if (text.charAt(index + 1) == ' ') {
        letterWait = 880;
      }
      setTimeout(() => {
        this.typeWriter(text)
      }, letterWait)
    } else {
      setTimeout(() => {
        this.setState({ cursorClass: null })
      }, 1000)
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    const { router } = this.props
    // console.log(this.context.user)
    if (this.context.user === undefined) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('home:Welcome')}</title>
              <meta name="description" content="Welcome page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
              <PageLoadingScreen />
            </main>
          </div>
        </PWPLanguageProvider>
      )
    } else {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('home:Welcome')}</title>
              <meta name="description" content="Welcome page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
              <Header 
                username={this.context.user?.username} 
                hideLogin={this.context.user} 
                hideLogout={!this.context.user} 
                path={router.pathname} 
                router={this.props.router}
              />
            </header>
            <div className="scrollBody">
              <main>
                <div className={styles.contentOne}>
                  <div>
                    <h1 className={this.state.cursorClass}>{this.state.headerText}</h1>
                  </div>
                </div>
              </main>

              <footer>
                <Footer isLoggedIn={this.context.user} />
              </footer>
            </div>
          </div>
        </PWPLanguageProvider>
      )
    }
  }
}

export default withRouter(withTranslation()(Home))
