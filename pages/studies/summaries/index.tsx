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

export interface SummariesState {
  isLoggedIn: boolean;
  currentToken: string;
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
        <div>
          <Head>
            <title>{this.props.t('common:Summaries')}</title>
            <meta name="description" content="Summaries" />
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
            <title>{this.props.t('common:Summaries')}</title>
            <meta name="description" content="Summaries" />
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
              <h1>
                {this.props.t('common:Summaries')}
              </h1>
              <div className={styles.container}>
                <div>
                  {this.listItems.map((summary, i) => (
                    <Summary key={i} summary={summary} />
                  ))}
                </div>
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

export default withRouter(withTranslation()(Summaries))