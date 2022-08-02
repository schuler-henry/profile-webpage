import Head from 'next/head';
import { Component } from 'react'
import { FrontEndController } from '../../controller/frontEndController';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import styles from '../../styles/Studies.module.css'
import Link from 'next/link';
import Image from 'next/image'
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { I18n, withTranslation, WithTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PageLoadingScreen } from '../../components/PageLoadingScreen/PageLoadingScreen';
import { PWPLanguageProvider } from '../../components/PWPLanguageProvider/PWPLanguageProvider';
import DHBWLogo from '../../public/DHBW_logo.jpg';
import NotebookPen from '../../public/notebook-pen.svg';
import CodeIcon from '../../public/web-page-source-code.svg';

export interface StudiesState {
  isLoggedIn: boolean;
  currentToken: string;
}

export interface StudiesProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'studies'])),
    }
  }
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
      this.setState({ isLoggedIn: true, currentToken: currentToken })
      return
    }
    this.setState({ isLoggedIn: false })
  }

  render() {
    const { router } = this.props
    if (this.state.isLoggedIn === undefined) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:Studies')}</title>
              <meta name="description" content="Studies" />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
              <Header 
                username={FrontEndController.getUsernameFromToken(this.state.currentToken)} 
                hideLogin={this.state.isLoggedIn} 
                hideLogout={!this.state.isLoggedIn} 
                path={router.pathname} 
                router={this.props.router}
              />
            </header>

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
              <title>{this.props.t('common:Studies')}</title>
              <meta name="description" content="Studies" />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
              <Header 
                username={FrontEndController.getUsernameFromToken(this.state.currentToken)} 
                hideLogin={this.state.isLoggedIn} 
                hideLogout={!this.state.isLoggedIn} 
                path={router.pathname} 
                router={this.props.router}
              />
            </header>

            <div className='scrollBody'>
              <main>
                <div className={styles.content}>
                  <span className={styles.header}>
                    <h1>
                      {this.props.t('common:Studies')}
                    </h1>
                    <Link
                      href={'https://www.ravensburg.dhbw.de/startseite'}
                      passHref>
                      <div className={styles.dhbw}>
                        <Image
                          title='DHBW Logo'
                          src={DHBWLogo}
                          objectFit='contain'
                          alt='DHBW Logo'
                        />
                      </div>
                    </Link>
                  </span>
                  <span className={styles.element}>
                    <div className={styles.icon}>
                      <Image
                        title='Notebook'
                        src={NotebookPen}
                        objectFit='contain'
                        height={40}
                        width={40}
                        alt='Notebook Icon'
                      />
                    </div>
                    <p className={styles.elementHeader}>
                      {this.props.t('studies:Get_to_the')} <Link href="/studies/summaries">{this.props.t('studies:summaries')}</Link>!
                    </p>
                  </span>
                  <span className={styles.element}>
                    <div className={styles.icon}>
                      <Image
                        title='Code'
                        src={CodeIcon}
                        objectFit='contain'
                        height={40}
                        width={40}
                        alt='Code Icon'
                      />
                    </div>
                    <p className={styles.elementHeader}>
                      {this.props.t('studies:Get_to_the')} <Link href="/studies/projects">{this.props.t('studies:projects')}</Link>!
                    </p>
                  </span>
                </div>
              </main>

              <footer>
                <Footer isLoggedIn={this.state.isLoggedIn} />
              </footer>
            </div>
          </div>
        </PWPLanguageProvider>
      )
    }
  }
}

export default withRouter(withTranslation()(Studies))