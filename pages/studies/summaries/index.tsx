import Head from 'next/head';
import { Component } from 'react'
import fs from 'fs'
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
}

export interface SummariesProps extends WithTranslation, WithRouterProps {
  data: string[];
  i18n: I18n;
}

export const getStaticProps = async ({ locale }) => {
  const directory = fs.readdirSync(`${process.cwd()}/content/studies/summaries`, 'utf-8');
  const files = directory.filter(fn => fn.endsWith(".md"));
  const data = files.map(file => {
    const path = `${process.cwd()}/content/studies/summaries/${file}`;
    const rawContent = fs.readFileSync(path, {
      encoding: "utf-8"
    });
    // console.log(rawContent);
    return rawContent
  });

  return {
    props: {
      data,
      ...(await serverSideTranslations(locale, ['common', 'summaries'])),
    }
  }
}

class Summaries extends Component<SummariesProps, SummariesState> {
  private realData = this.props.data.map(summary => matter(summary));
  private listItems = this.realData.map(listItem => listItem.data);
  constructor(props: SummariesProps) {
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
                  <div className={styles.container}>
                    {this.listItems.map((summary, i) => (
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