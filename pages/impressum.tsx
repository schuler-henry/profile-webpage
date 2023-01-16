import Head from 'next/head'
import React, { Component } from 'react'
import styles from '../styles/Impressum.module.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { I18n, withTranslation, WithTranslation } from 'next-i18next'
import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import { PWPLanguageProvider } from '../components/PWPLanguageProvider/PWPLanguageProvider'
import { PageLoadingScreen } from '../components/PageLoadingScreen/PageLoadingScreen'
import { PWPAuthContext } from '../components/PWPAuthProvider/PWPAuthProvider'

export interface ImpressumState {
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
 * @class Impressum Component Class
 * @component
 */
class Impressum extends Component<ImpressumProps, ImpressumState> {
  constructor(props: ImpressumProps) {
    super(props)
    this.state = {
    }
  }

  static contextType = PWPAuthContext;

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    const { router } = this.props
    if (this.context.user === undefined) {
      // console.log("UNDEFINED")
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:Impressum')}</title>
              <meta name="description" content="Impressum page." />
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
              <title>{this.props.t('common:Impressum')}</title>
              <meta name="description" content="Impressum page." />
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
                    E-Mail: contact&#64;henryschuler.de <br />
                  </p>
                </div>
                <div className={styles.content}>
                  <h2>Legal information</h2>
                  <h3>Used Icons</h3>
                  <p style={{ display: "flex", flexDirection: "column" }}>
                    <a href="https://www.flaticon.com/free-icons/badminton" title="badminton icons">Badminton icons created by rismaars - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/ball" title="ball icons">Ball icons created by Freepik - Flaticon</a>
                  </p>
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

export default withRouter(withTranslation()(Impressum))
