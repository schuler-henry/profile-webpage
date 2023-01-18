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
import Link from 'next/link'

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
                    {this.props.t('impressum:Phone')}: &#43;49 163 7292914 <br />
                    E-Mail: contact&#64;henryschuler.de <br />
                  </p>
                </div>
                <div className={styles.content}>
                  <h2>{this.props.t('impressum:LegalInformation')}</h2>
                    <ul className={styles.list}>
                      <li>
                        <Link href={"/terms"}>
                          {this.props.t('common:Terms')}
                        </Link>
                      </li>
                      <li>
                        <Link href={"/dsgvo"}>
                          {this.props.t('common:DSGVO')}
                        </Link>
                      </li>
                    </ul>
                  <h3>{this.props.t('impressum:UsedIcons')}</h3>
                    <ul className={styles.list}>
                      <li>
                        <a href="https://www.flaticon.com/free-icons/badminton" title="badminton icons">Badminton icons created by rismaars - Flaticon</a>
                      </li>
                      <li>
                        <a href="https://www.flaticon.com/free-icons/ball" title="ball icons">Ball icons created by Freepik - Flaticon</a>
                      </li>
                    </ul>
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
