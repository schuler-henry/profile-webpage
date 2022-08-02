import { I18n, withTranslation, WithTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import Head from "next/head";
import { Component } from "react";
import { Footer } from "../../../components/footer";
import { Header } from "../../../components/header";
import styles from '../../../styles/studies/Projects.module.css'
import { PageLoadingScreen } from "../../../components/PageLoadingScreen/PageLoadingScreen";
import { PWPLanguageProvider } from "../../../components/PWPLanguageProvider/PWPLanguageProvider";
import { FrontEndController } from "../../../controller/frontEndController";
import { Repository } from "../../../interfaces/Github";
import { GitHubRepository } from "../../../components/GitHubRepository/GitHubRepository";

export interface ProjectsState {
  isLoggedIn: boolean;
  currentToken: string;
  repoData: Repository;
}

export interface ProjectsProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'projects', 'gitHub'])),
    }
  }
}

class Projects extends Component<ProjectsProps, ProjectsState> {
  constructor(props: ProjectsProps) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      repoData: undefined,
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
              <title>{this.props.t('common:Projects')}</title>
              <meta name="description" content="Projects" />
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
              <title>{this.props.t('common:Projects')}</title>
              <meta name="description" content="Projects" />
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
                  <h1>
                    {this.props.t('common:Projects')}
                  </h1>
                  <div className={styles.elements}>
                    <GitHubRepository username="dhbw-fn-tit20" reponame="web-notes" heading="WEB NOTES" />
                    <GitHubRepository username="dhbw-fn-tit20" reponame="dev-chat" heading="DEV CHAT" />
                    <GitHubRepository username="schuler-henry" reponame="snp-timediff" heading="Time difference calculator" />
                  </div>
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

export default withRouter(withTranslation()(Projects))