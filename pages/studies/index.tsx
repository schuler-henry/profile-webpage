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
import DHBWLogo from '../../public/logos/DHBW_logo.jpg';
import NotebookPen from '../../public/logos/notebook-pen.svg';
import CodeIcon from '../../public/logos/web-page-source-code.svg';
import { PWPAuthContext } from '../../components/PWPAuthProvider/PWPAuthProvider';

export interface StudiesState {
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
    }
  }

  static contextType = PWPAuthContext;

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { router } = this.props
    if (this.context.user === undefined) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:Studies')}</title>
              <meta name="description" content="Studies" />
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
              <title>{this.props.t('common:Studies')}</title>
              <meta name="description" content="Studies" />
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
                <Footer isLoggedIn={this.context.user} />
              </footer>
            </div>
          </div>
        </PWPLanguageProvider>
      )
    }
  }
}

export default withRouter(withTranslation()(Studies))