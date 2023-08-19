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
import { GitHubProject } from "../../../interfaces/database";
import { GitHubRepository } from "../../../components/GitHubRepository/GitHubRepository";
import { PWPAuthContext } from "../../../components/PWPAuthProvider/PWPAuthProvider";

export interface ProjectsState {
  projects: GitHubProject[];
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
      projects: []
    }
  }

  static contextType = PWPAuthContext;

  async componentDidMount() {
    this.setState({ projects: await FrontEndController.getGitHubProjects() })
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
              <title>{this.props.t('common:Projects')}</title>
              <meta name="description" content="Projects" />
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
              <title>{this.props.t('common:Projects')}</title>
              <meta name="description" content="Projects" />
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
                    {this.props.t('common:Projects')}
                  </h1>
                  <div className={styles.elements}>
                    {
                      this.state.projects.map((project) => {
                        return (
                          <GitHubRepository 
                            key={project.heading} 
                            username={project.username} 
                            reponame={project.reponame} 
                            heading={project.heading} 
                          />
                        )
                      })
                    }
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

export default withRouter(withTranslation()(Projects))