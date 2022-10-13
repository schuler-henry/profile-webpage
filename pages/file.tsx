import Head from 'next/head';
import { Component } from "react";
import { FrontEndController } from '../controller/frontEndController';
import { I18n, withTranslation, WithTranslation } from 'next-i18next';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PageLoadingScreen } from '../components/PageLoadingScreen/PageLoadingScreen';
import { PWPLanguageProvider } from '../components/PWPLanguageProvider/PWPLanguageProvider';
import PDFObject from 'pdfobject';
import { Button } from '../components/Button/Button';

export interface SummaryState {
  isLoggedIn: boolean;
  currentToken: string;
  summary: Blob;
  fileURL: string;
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
      fileURL: undefined,
    }
  }

  async componentDidMount() {
    await this.getFile();
  }

  async getFile() {
    this.setState({ fileURL: undefined })
    const { bucketId, filePath } = this.props.router.query;
    const summaryBlob = await FrontEndController.getFileFromDatabase(bucketId + "", filePath + ".pdf")
    if (summaryBlob !== undefined && summaryBlob !== null && summaryBlob.type === "application/pdf") {
      let fileURL = window.URL.createObjectURL(summaryBlob);
      this.setState({ fileURL: fileURL.toString() });
    } else {
      this.setState({ fileURL: null });
    }
  }

  componentWillUnmount() {
  }

  render() {
    if (this.state.fileURL) {
      const url = structuredClone(this.state.fileURL);
      PDFObject.embed(url)
      return (
        <div>
        </div>
      )
    } else if (this.state.fileURL === null) {
      return (
        <div>
          {/* Option to select file from list */}
          PDF not found
          <Button
            onClick={async () => {
              await this.getFile();
            }}
          >
            reload file
          </Button>
        </div>
      )
    } else {
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
    } 
  }
}

export default withRouter(withTranslation()(Summary))