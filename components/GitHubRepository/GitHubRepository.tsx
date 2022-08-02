import Link from "next/link";
import Image from "next/image";
import { Component } from "react";
import styles from "./GitHubRepository.module.css";
import GitHubLogo from "../../public/GitHub.png";
import { FrontEndController } from "../../controller/frontEndController";
import { GitHubUser, Repository } from "../../interfaces/Github";
import { PWPLanguageContext } from "../PWPLanguageProvider/PWPLanguageProvider";
import { Button } from "../Button/Button";
import {UIDReset, UIDConsumer} from 'react-uid';

export interface GitHubRepositoryState {
  repoData: Repository;
  contributors: GitHubUser[];
  windowWidth: number;
}

export interface GitHubRepositoryProps {
  username: string;
  reponame: string;
  heading: string;
}

export class GitHubRepository extends Component<GitHubRepositoryProps, GitHubRepositoryState> {
  constructor(props) {
    super(props);
    this.state = {
      repoData: undefined,
      contributors: [],
      windowWidth: 0,
    }
  }

  async componentDidMount() {
    this.setState({repoData: await FrontEndController.getRepoInformation(this.props.username, this.props.reponame)})
    this.setState({contributors: await FrontEndController.getRepoSubItem(this.props.username, this.props.reponame, "contributors")})
    window.addEventListener('resize', () => {
      this.setState({windowWidth: window.innerWidth})
    })
  }

  

  render() {
    let contributorsLength: number = this.state.contributors.length > 1 ? this.state.contributors.reduce((a: GitHubUser, b: GitHubUser) => (a.login.length > b.login.length ? a : b)).login.length : this.state.contributors[0]?.login.length
    let test:string
    return (
      <>
        <UIDReset>
          <UIDConsumer>
            {(id, uid) => (
              <PWPLanguageContext.Consumer>
                { LanguageContext => (
                  <div className={styles.gitHubItem}>
                    <div className={styles.gitHubHeader}>
                      <Link href={`https://github.com/${this.props.username}/${this.props.reponame}`} passHref>
                        <div className={styles.logo}>
                          <Image
                            title={this.props.username + "/" + this.props.reponame}
                            src={this.state.repoData?.owner.avatar_url || GitHubLogo}
                            objectFit='contain'
                            height={40}
                            width={40}
                            alt='GitHub Logo missing.'
                          />
                        </div>
                      </Link>
                      <div className={styles.gitHubHeaderText}>
                        <p className={styles.repositoryHeaderName}>
                          <a href={`https://github.com/${this.props.username}/${this.props.reponame}`} onClick={() => { document.location.href = `https://github.com/${this.props.username}/${this.props.reponame}` }}>
                            {this.props.heading}
                          </a>
                        </p>
                        <p className={styles.repositoryHeaderInfo}>
                          <div className={this.state.windowWidth || this.state.repoData ? document.getElementById(uid(this.props.reponame))?.scrollWidth > document.getElementById(uid(this.props.reponame))?.clientWidth ? styles.scrollText : null : null} id={uid(this.props.reponame)}>
                            {this.state.repoData ? `${LanguageContext.t('gitHub:Language')}: ${this.state.repoData.language} - ${LanguageContext.t('gitHub:CreatedOn')}: ${new Date(this.state.repoData.created_at).toLocaleDateString("de-DE")}${this.state.repoData.license ? ` - ${LanguageContext.t('gitHub:License')}: ${this.state.repoData.license.name}` : ""}` : "Test"}
                          </div>
                        </p>
                      </div>
                      <Button 
                        onClick={() => {navigator.clipboard.writeText(`git clone ${this.state.repoData.clone_url}`)}}
                      >
                        clone
                      </Button>
                    </div>
                    <div className={styles.gitHubContent}>
                      <p className={styles.gitHubElement}>
                        <p className={styles.elementHead}>
                          Description:
                        </p>
                        <p>
                          {this.state.repoData ? this.state.repoData.description : "Loading..."}
                        </p>
                      </p>
                      <p className={styles.gitHubElement}>
                        <p className={styles.elementHead}>
                          Contributors:
                        </p>
                        <ul>
                          {this.state.contributors.map((user: GitHubUser, i) => (
                            <li key={i}>
                              <Image 
                                title={this.props.username + "/" + this.props.reponame}
                                src={user.avatar_url}
                                objectFit='contain'
                                height={10}
                                width={10}
                                alt='GitHub Logo missing.'
                              />
                              {" "}
                              <a href={user.html_url} onClick={() => {document.location.href = user.html_url}}>
                                {user.login}
                              </a>
                              {`${"".padEnd(contributorsLength - user.login.length, "\u00A0")} - ${LanguageContext.t('gitHub:Contributions')}: ${user.contributions}`}
                            </li>
                          ))}
                        </ul>
                      </p>
                    </div>
                  </div>
                )}
              </PWPLanguageContext.Consumer>
            )}
          </UIDConsumer>
        </UIDReset>
      </>
    );
  }
}

