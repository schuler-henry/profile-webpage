import Head from 'next/head';
import { Component } from 'react'
import matter from 'gray-matter';
import { Summary } from '../../../components/SummaryItem/SummaryItem';
import styles from '../../../styles/studies/Summaries.module.css'
import { FrontEndController } from '../../../controller/frontEndController';
import { Header } from '../../../components/header'
import { Footer } from '../../../components/footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { I18n, withTranslation, WithTranslation } from 'next-i18next';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';
import { PageLoadingScreen } from '../../../components/PageLoadingScreen/PageLoadingScreen';
import { PWPLanguageProvider } from '../../../components/PWPLanguageProvider/PWPLanguageProvider';
import { PWPAuthContext } from '../../../components/PWPAuthProvider/PWPAuthProvider';

export interface SummariesState {
  listItems: { [key: string]: any }[];
  loadingItems: boolean;
}

export interface SummariesProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'summaries'])),
    }
  }
}

class Summaries extends Component<SummariesProps, SummariesState> {
  constructor(props: SummariesProps) {
    super(props)
    this.state = {
      listItems: [],
      loadingItems: true,
    }
  }

  static contextType = PWPAuthContext;

  async componentDidMount() {
    const summaries: string[] = await FrontEndController.getAllSummaries();
    const realData = summaries.map(summary => matter(summary));
    const listItems = realData.map(listItem => listItem.data);
    this.setState({ listItems: listItems, loadingItems: false });
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
              <title>{this.props.t('common:Summaries')}</title>
              <meta name="description" content="Summaries" />
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
              <title>{this.props.t('common:Summaries')}</title>
              <meta name="description" content="Summaries" />
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
                  <h1>
                    {this.props.t('common:Summaries')}
                  </h1>
                  {
                    this.state.loadingItems &&
                    <PageLoadingScreen />
                  }
                  <div className={styles.container}>
                    {this.state.listItems.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime()).map((summary, i) => (
                      <div key={i} className={styles.summary}>
                        <Summary summary={summary} />
                      </div>
                    ))}
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

export default withRouter(withTranslation()(Summaries))