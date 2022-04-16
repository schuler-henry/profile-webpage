import Head from 'next/head';
import { Component } from "react";
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import { toHtml } from 'hast-util-to-html'
import fs from 'fs'
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

export interface SummaryState {
  isLoggedIn: boolean;
  currentToken: string;
}

export interface SummaryProps extends WithTranslation, WithRouterProps {
  content: string;
  i18n: I18n;
}

export const getServerSideProps = async (context) => {
  const { summary } = context.params;

  let content: string;

  try {
    content = fs.readFileSync(`${process.cwd()}/content/studies/summaries/${summary}.md`, 'utf-8');
  } catch (error) {
    content = "# This file does not exist!"
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'summary'])),
      content,
    }
  }
}

class Summary extends Component<SummaryProps, SummaryState> {
  private summary = matter(this.props.content);
  constructor(props: SummaryProps) {
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
            <title>{this.summary.data.title}</title>
            <meta name="description" content="Summary" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header 
              username={""} 
              hideLogin={true} 
              hideLogout={true} 
              path={router.asPath} 
              i18n={this.props.i18n} 
              router={this.props.router}
              t={this.props.t}
            />
          </header>
        </div>
      )
    } else {
      return (
        <div>
          <Head>
            <title>{this.summary.data.title}</title>
            <meta name="description" content="Summary" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header 
              username={FrontEndController.getUsernameFromToken(this.state.currentToken)} 
              hideLogin={this.state.isLoggedIn} 
              hideLogout={!this.state.isLoggedIn} 
              path={router.asPath} 
              i18n={this.props.i18n} 
              router={this.props.router}
              t={this.props.t}
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
                  {this.summary.content}
                </ReactMarkdown>
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

export default withRouter(withTranslation()(Summary))