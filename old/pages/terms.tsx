/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import React, { Component } from 'react';
import styles from '../styles/Terms.module.css';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { I18n, withTranslation, WithTranslation } from 'next-i18next';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';
import { PWPLanguageProvider } from '../components/PWPLanguageProvider/PWPLanguageProvider';
import { PageLoadingScreen } from '../components/PageLoadingScreen/PageLoadingScreen';
import { PWPAuthContext } from '../components/PWPAuthProvider/PWPAuthProvider';

export interface TermsState {

}

export interface TermsProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  }
}

/**
 * @class Terms Component Class
 * @component
 */
class Terms extends Component<TermsProps, TermsState> {
  constructor(props: TermsProps) {
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
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:Terms')}</title>
              <meta name="description" content="Terms page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
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
              <title>{this.props.t('common:Terms')}</title>
              <meta name="description" content="Terms page." />
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
              <main className={styles.main}>
                <div className={styles.box}>
                  <h1>
                    {this.props.t('common:Terms')}
                  </h1>
                </div>
              </main>

              <footer>
                <Footer
                  isLoggedIn={this.context.user}
                />
              </footer>
            </div>
          </div>
        </PWPLanguageProvider>
      )
    }
  }
}

export default withRouter(withTranslation()(Terms))