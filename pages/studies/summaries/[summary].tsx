import Head from 'next/head';
import { Component } from "react";
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import { toHtml } from 'hast-util-to-html'
import styles from '../../../styles/studies/Summary.module.css'
import stylesDark from '../../../styles/studies/MarkdownDark.module.css'
import stylesLight from '../../../styles/studies/MarkdownLight.module.css'
import rehypeRaw from 'rehype-raw'
import { FrontEndController } from '../../../controller/frontEndController';
import { Header } from '../../../components/header'
import { Footer } from '../../../components/footer'
import { I18n, withTranslation, WithTranslation } from 'next-i18next';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ColorTheme } from '../../../enums/colorTheme';
import { PageLoadingScreen } from '../../../components/PageLoadingScreen/PageLoadingScreen';
import { PWPLanguageProvider } from '../../../components/PWPLanguageProvider/PWPLanguageProvider';

export interface SummaryState {
  isLoggedIn: boolean;
  currentToken: string;
  summary: matter.GrayMatterFile<any>;
}

export interface SummaryProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export const getServerSideProps = async (context) => {

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'summary'])),
    }
  }
}

class Summary extends Component<SummaryProps, SummaryState> {
  constructor(props: SummaryProps) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      summary: undefined,
    }
  }

  componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
    this.getMarkdownFileContent();
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

  async getMarkdownFileContent() {
    const { summary } = this.props.router.query
    this.setState({ summary: matter(await FrontEndController.getFileContent("content/studies/summaries/", summary + ".md")) });
  }

  render() {
    const { router } = this.props
    if (this.state.isLoggedIn === undefined || this.state.summary === undefined) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{"Loading"}</title>
              <meta name="description" content="Summary" />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
              <Header 
                username={FrontEndController.getUsernameFromToken(this.state.currentToken)} 
                hideLogin={this.state.isLoggedIn} 
                hideLogout={!this.state.isLoggedIn} 
                path={router.asPath} 
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
              <title>{this.state.summary.data.title}</title>
              <meta name="description" content="Summary" />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
              <Header 
                username={FrontEndController.getUsernameFromToken(this.state.currentToken)} 
                hideLogin={this.state.isLoggedIn} 
                hideLogout={!this.state.isLoggedIn} 
                path={router.asPath} 
                router={this.props.router}
              />
            </header>

            <div className='scrollBody'>
              <main>
                <div className={styles.content}>
                  <ReactMarkdown
                    components={{ table: ({ node }) => <div className={styles.tableScroll} dangerouslySetInnerHTML={{ __html: toHtml(node) }}></div> }}
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm]}
                    className={FrontEndController.getTheme() === ColorTheme.darkTheme ? stylesDark.markdown : stylesLight.markdown}>
                    {this.state.summary.content}
                  </ReactMarkdown>
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

export default withRouter(withTranslation()(Summary))