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
import { PWPAuthContext } from '../../../components/PWPAuthProvider/PWPAuthProvider';
import PDFObject from 'pdfobject';

export interface SummaryState {
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
      summary: undefined,
    }
  }

  static contextType = PWPAuthContext;

  componentDidMount() {
    this.getMarkdownFileContent();
  }

  componentWillUnmount() {
  }

  async getMarkdownFileContent() {
    const { summary } = this.props.router.query
    let summaryBlob = matter(await FrontEndController.getFileContent("content/studies/summaries/", summary + ".md"));
    summaryBlob.content = summaryBlob.content.replaceAll("class=\"pdfViewer\"", `class=\"${PDFObject.supportsPDFs ? styles.pdf : styles.noPdf}\"`)
    this.setState({ summary: summaryBlob });
  }

  render() {
    const { router } = this.props
    if (this.context.user === undefined || this.state.summary === undefined) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{"Loading"}</title>
              <meta name="description" content="Summary" />
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
              <title>{this.state.summary.data.title}</title>
              <meta name="description" content="Summary" />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
              <Header 
                username={this.context.user?.username} 
                hideLogin={this.context.user} 
                hideLogout={!this.context.user} 
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
                    className={`${FrontEndController.getTheme() === ColorTheme.darkTheme ? stylesDark.markdown : stylesLight.markdown}`}>
                    {this.state.summary.content}
                  </ReactMarkdown>
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

export default withRouter(withTranslation()(Summary))