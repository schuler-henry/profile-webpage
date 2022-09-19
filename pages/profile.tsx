import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import { IUser } from '../interfaces/database'
import styles from '../styles/Profile.module.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { I18n, withTranslation, WithTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageLoadingScreen } from '../components/PageLoadingScreen/PageLoadingScreen'
import { PWPLanguageProvider } from '../components/PWPLanguageProvider/PWPLanguageProvider'
import { Dropdown, DropdownOption } from '../components/Dropdown/Dropdown'
import { Icon } from '@fluentui/react'
import { Button } from '../components/Button/Button'
import { ConfirmPopUp } from '../components/ConfirmPopUp/ConfirmPopUp'
import { PWPAuthContext } from '../components/PWPAuthProvider/PWPAuthProvider'

const onRenderOption = (option: DropdownOption): JSX.Element => {
  return(
    <div style={{ width: "100%", display: "flex"}}>
      {
        option.data?.icon &&
        <span style={{ display: "flex", alignItems: "center" }}>
          <Icon style={{ display: "flex", marginRight: '8px', fontSize: "15px", height: "15px" }} iconName={option.data.icon} />
        </span>
      }
      <span>
        {option.text}
      </span>
    </div>
  )
}

const onRenderCaretDown = (): JSX.Element => {
  return(
    <Icon iconName="ChevronDown" style={{ display: "flex" }} />
  )
}

export interface ProfileState {
  changedUser: IUser | undefined;
  selectedMenu: string;
  fetchData: boolean;
  submitProfile: boolean;
  submitEmail: boolean;
  submitPassword: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  usernameError: boolean;
  emailError: boolean;
  oldPasswordError: boolean;
  newPasswordError: boolean;
  newPasswordMatchError: boolean;
  confirmPasswordError: boolean;
  success: boolean;
  displaySuccess: boolean;
  changedEmail: boolean;
}

export interface ProfileProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'profile'])),
    }
  }
}

/**
 * @class Home Component Class
 * @component
 */
class Profile extends Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props)
    this.state = {
      changedUser: undefined,
      selectedMenu: "profile",
      fetchData: false,
      submitProfile: false,
      submitEmail: false,
      submitPassword: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      usernameError: false,
      emailError: false,
      oldPasswordError: false,
      newPasswordError: false,
      newPasswordMatchError: false,
      confirmPasswordError: false,
      success: false,
      displaySuccess: false,
      changedEmail: false,
    }
  }

  static contextType = PWPAuthContext;

  async componentDidMount() {
    const user = await FrontEndController.getUserFromToken(FrontEndController.getUserToken());
    this.setState({ changedUser: user });
  }

  componentDidUpdate(prevProps: Readonly<ProfileProps>, prevState: Readonly<ProfileState>, snapshot?: any): void {
    const { menu } = this.props.router.query;
    if (menu !== this.state.selectedMenu && this.options.find(element => element.key === menu?.toString())) {
      this.setState({ selectedMenu: menu.toString() });
    }
  }

  componentWillUnmount() {
  }

  private options: DropdownOption[] = [
    {key: "profile", text: this.props.t('common:Profile'), data: {icon: "Contact"}},
    {key: "email", text: this.props.t('profile:Email'), data: {icon: "Mail"}},
    {key: "password", text: this.props.t('profile:Password'), data: {icon: "Lock"}},
  ]

  private onChange = (event: React.FormEvent<HTMLDivElement>, item: DropdownOption): void => {
    if (this.state.selectedMenu !== item.key) {
      this.props.router.push({ pathname: "/profile", query: {menu: item.key} })
      this.setState({ selectedMenu: item.key });
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    const { router } = this.props

    if (this.context.user === null) {
      router.push("/login", "/login", { shallow: true })
    }

    if (this.context.user === undefined) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:Profile')}</title>
              <meta name="description" content="Profile page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
              <PageLoadingScreen />
            </main>
          </div>
        </PWPLanguageProvider>
      )
    } else {

      let getAccessString = (accessLevel: number | undefined): string => {
        switch (accessLevel) {
          case 0:
            return "User";
          case 1:
            return "Admin";
          default:
            return "unavailable";
        }
      }

      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:Profile')}</title>
              <meta name="description" content="Profile page." />
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
                  <h1>{this.props.t('profile:User')}: {FrontEndController.getUsernameFromToken(FrontEndController.getUserToken())}</h1>
                  
                  <Dropdown 
                    options={this.options} 
                    selectedKey={this.state.selectedMenu}
                    onChange={this.onChange} 
                    onRenderOption={onRenderOption} 
                    onRenderCaretDown={onRenderCaretDown}
                    width={"100%"}
                    />
                  
                  {
                    this.state.selectedMenu === "profile" &&
                    <div>
                      <div className={styles.inputWrapper}>
                        <h1>{this.props.t('profile:AccessLevel')}</h1>
                        <input 
                          type="text"
                          className={styles.input}
                          value={getAccessString(this.state.changedUser?.accessLevel) || ""}
                          readOnly={true}
                        />
                      </div>
                      <div className={styles.inputWrapper}>
                        <h1>{this.props.t('profile:Username')}</h1>
                        <input 
                          type="text"
                          className={`${styles.input} ${this.state.usernameError && styles.inputError} ${this.context.user?.username !== this.state.changedUser?.username && styles.inputChanged}`}
                          placeholder={this.context.user?.username}
                          value={this.state.changedUser?.username || ""}
                          onChange={async (event) => {
                            this.setState({ changedUser: { ...this.state.changedUser, username: event.target.value } })
                            this.setState({ usernameError: (await FrontEndController.doesUserExist(event.target.value) && event.target.value !== this.context.user?.username) || !await FrontEndController.isUsernameValid(event.target.value) })
                          }}
                          readOnly={this.state.changedUser === undefined || this.state.submitProfile || this.state.displaySuccess}
                        />
                        {
                          this.state.usernameError &&
                            <p className={styles.errorText}>
                              {this.props.t('profile:UsernameTaken')}
                            </p>
                        }
                      </div>
                      <div className={styles.inputWrapper}>
                        <h1>{this.props.t('profile:FirstName')}</h1>
                        <input 
                          type="text"
                          className={`${styles.input} ${this.context.user?.firstName !== this.state.changedUser?.firstName && styles.inputChanged}`}
                          placeholder={this.context.user?.firstName}
                          value={this.state.changedUser?.firstName || ""}
                          onChange={(event) => {
                            this.setState({ changedUser: { ...this.state.changedUser, firstName: event.target.value.replaceAll("  ", " ").trimStart() } })
                          }}
                          readOnly={this.state.changedUser === undefined || this.state.submitProfile || this.state.displaySuccess}
                        />
                      </div>
                      <div className={styles.inputWrapper}>
                        <h1>{this.props.t('profile:LastName')}</h1>
                        <input 
                          type="text"
                          className={`${styles.input} ${this.context.user?.lastName !== this.state.changedUser?.lastName && styles.inputChanged}`}
                          placeholder={this.context.user?.lastName}
                          value={this.state.changedUser?.lastName || ""}
                          onChange={(event) => {
                            this.setState({ changedUser: { ...this.state.changedUser, lastName: event.target.value.replaceAll(" ", "") } })
                          }}
                          readOnly={this.state.changedUser === undefined || this.state.submitProfile || this.state.displaySuccess}
                        />
                      </div>
                      <div className={styles.submitButton}>
                        <Button
                          onClick={() => {
                            this.setState({ submitProfile: true })
                          }}
                          disabled={this.state.submitProfile || this.state.displaySuccess || this.state.usernameError || (this.context.user?.username === this.state.changedUser?.username && this.context.user?.firstName === this.state.changedUser?.firstName && this.context.user?.lastName === this.state.changedUser?.lastName)}  
                        >
                          {this.props.t('profile:UpdateProfile')}
                        </Button>
                      </div>
                      {
                        this.state.submitProfile &&
                          <ConfirmPopUp 
                            title={this.props.t('profile:SubmitProfileChanges')} 
                            onConfirm={this.state.fetchData ? undefined : async () => {
                              this.setState({ fetchData: true })
                              this.setState({ success: await FrontEndController.updateUserProfile(FrontEndController.getUserToken(), this.state.changedUser), fetchData: false, displaySuccess: true, submitProfile: false })
                            }}
                            onCancel={this.state.fetchData ? undefined : () => {
                              this.setState({ submitProfile: false })
                            }}
                            warning={this.props.t('profile:UndoWarning')}
                            sync={this.state.fetchData}
                          >
                            <div className={styles.confirmWrapper}>
                              {
                                this.context.user?.username !== this.state.changedUser?.username &&
                                <div>
                                  <h1>{this.props.t('profile:Username')}</h1>
                                  <p>{this.context.user?.username} -&gt; {this.state.changedUser?.username}</p>
                                </div>
                              }
                              {
                                (this.context.user?.firstName !== this.state.changedUser?.firstName || this.context.user?.lastName !== this.state.changedUser?.lastName) &&
                                <div>
                                  <h1>{this.props.t('profile:Name')}</h1>
                                  <p>{this.context.user?.firstName} {this.context.user?.lastName} -&gt; {this.state.changedUser?.firstName} {this.state.changedUser?.lastName}</p>
                                </div>
                              }
                            </div>
                          </ConfirmPopUp>
                      }
                    </div>
                  }

                  {
                    this.state.selectedMenu === "email" &&
                    <div>
                      <div className={styles.inputWrapper}>
                        <h1>{this.props.t('profile:Email')}</h1>
                        <input 
                          type="email"
                          className={`${styles.input} ${this.state.emailError && styles.inputError} ${this.context.user?.email !== this.state.changedUser?.email && styles.inputChanged}`}
                          placeholder={this.context.user?.email}
                          value={this.state.changedUser?.email || ""}
                          onChange={async (event) => {
                            this.setState({ changedUser: { ...this.state.changedUser, email: event.target.value } })
                            this.setState({ emailError: !await FrontEndController.isEmailValid(event.target.value) || (await FrontEndController.doesEmailExist(event.target.value) && event.target.value !== this.context.user?.email) })
                          }}
                          readOnly={this.state.changedUser === undefined || this.state.submitEmail || this.state.displaySuccess}
                        />
                        {
                          this.state.emailError &&
                            <p className={styles.errorText}>
                              {this.props.t('profile:EmailTaken')}
                            </p>
                        }
                      </div>
                      <div className={styles.submitButton}>
                        <Button
                          onClick={() => {
                            this.setState({ submitEmail: true })
                          }}
                          disabled={this.state.submitEmail || this.state.displaySuccess || this.state.emailError || this.context.user?.email === this.state.changedUser?.email}
                        >
                          {this.props.t('profile:UpdateEmail')}
                        </Button>
                      </div>
                      {
                        this.state.submitEmail &&
                        <ConfirmPopUp
                          title={this.props.t('profile:SubmitEmailChanges')}
                          onConfirm={this.state.fetchData ? undefined : async () => {
                            this.setState({ fetchData: true })
                            this.setState({ success: await FrontEndController.updateUserEmail(FrontEndController.getUserToken(), this.state.changedUser?.email), fetchData: false, changedEmail: true, displaySuccess: true, submitEmail: false })
                          }}
                          onCancel={this.state.fetchData ? undefined : () => {
                            this.setState({ submitEmail: false })
                          }}
                          sync={this.state.fetchData}
                        >
                          <div className={styles.confirmWrapper}>
                            <div>
                              <h1>{this.props.t('profile:Email')}</h1>
                              <p>{this.context.user?.email} -&gt; {this.state.changedUser?.email}</p>
                            </div>
                          </div>
                        </ConfirmPopUp>
                      }
                    </div>
                  }

                  {
                    this.state.selectedMenu === "password" &&
                    <div>
                      <div className={styles.inputWrapper}>
                        <h1>{this.props.t('profile:OldPassword')}</h1>
                        <input 
                          type="password"
                          className={`${styles.input} ${this.state.oldPasswordError && styles.inputError}`}
                          value={this.state.oldPassword}
                          onChange={async (event) => {
                            this.setState({ oldPassword: event.target.value, newPasswordMatchError: event.target.value !== "" && event.target.value === this.state.newPassword, oldPasswordError: event.target.value !== "" && !await FrontEndController.isPasswordValid(event.target.value) })
                          }}
                          readOnly={this.state.changedUser === undefined || this.state.submitPassword || this.state.displaySuccess}
                        />
                        {
                          this.state.oldPasswordError &&
                            <p className={styles.errorText}>
                              {this.props.t('profile:PasswordInvalid')}
                            </p>
                        }
                      </div>
                      <div className={styles.inputWrapper}>
                        <h1>{this.props.t('profile:NewPassword')}</h1>
                        <input 
                          type="password"
                          className={`${styles.input} ${(this.state.newPasswordError || this.state.newPasswordMatchError) && styles.inputError}`}
                          value={this.state.newPassword}
                          onChange={async (event) => {
                            this.setState({ newPassword: event.target.value, newPasswordMatchError: event.target.value !== "" && event.target.value === this.state.oldPassword, confirmPasswordError: event.target.value !== "" && event.target.value !== this.state.confirmPassword, newPasswordError: event.target.value !== "" && !await FrontEndController.isPasswordValid(event.target.value) })
                          }}
                          readOnly={this.state.changedUser === undefined || this.state.submitPassword || this.state.displaySuccess}
                        />
                        {
                          this.state.newPasswordError &&
                            <p className={styles.errorText}>
                              {this.props.t('profile:PasswordInvalid')}
                            </p>
                        }
                        {
                          this.state.newPasswordMatchError &&
                            <p className={styles.errorText}>
                              {this.props.t('profile:PasswordOldNewMatch')}
                            </p>
                        }
                      </div>
                      <div className={styles.inputWrapper}>
                        <h1>{this.props.t('profile:ConfirmPassword')}</h1>
                        <input 
                          type="password"
                          className={`${styles.input} ${this.state.confirmPasswordError && styles.inputError}`}
                          value={this.state.confirmPassword}
                          onChange={(event) => {
                            this.setState({ confirmPassword: event.target.value, confirmPasswordError: event.target.value !== "" && event.target.value !== this.state.newPassword })
                          }}
                          readOnly={this.state.changedUser === undefined || this.state.submitPassword || this.state.displaySuccess}
                        />
                        {
                          this.state.confirmPasswordError &&
                            <p className={styles.errorText}>
                              {this.props.t('profile:PasswordMismatch')}
                            </p>
                        }
                      </div>
                      <div className={styles.submitButton}>
                        <Button
                          onClick={() => {
                            this.setState({ submitPassword: true })
                          }}
                          disabled={this.state.submitPassword || this.state.displaySuccess || this.state.oldPasswordError || this.state.newPasswordError || this.state.confirmPasswordError || this.state.newPasswordMatchError || this.state.oldPassword === "" || this.state.newPassword === "" || this.state.confirmPassword === ""}
                        >
                          {this.props.t('profile:UpdatePassword')}
                        </Button>
                      </div>
                      {
                        this.state.submitPassword &&
                        <ConfirmPopUp
                          title={this.props.t('profile:SubmitPasswordChanges')}
                          onConfirm={this.state.fetchData ? undefined : async () => {
                            this.setState({ fetchData: true })
                            this.setState({ success: await FrontEndController.changePassword(FrontEndController.getUserToken(), this.state.oldPassword, this.state.newPassword), fetchData: false, displaySuccess: true, submitPassword: false })
                          }}
                          onCancel={this.state.fetchData ? undefined : () => {
                            this.setState({ submitPassword: false })
                          }}
                          sync={this.state.fetchData}
                        />
                      }
                    </div>
                  }

                  {
                    this.state.displaySuccess &&
                      <ConfirmPopUp
                        title={this.state.success ? this.props.t('common:Success') : this.props.t('common:Error')}
                        onConfirm={() => {
                          this.setState({ displaySuccess: false, changedEmail: false, oldPassword: "", newPassword: "", confirmPassword: "" })
                        }}
                        message={this.state.success && this.props.t('profile:UpdateUserSuccessMessage') + (this.state.changedEmail ? "\n\n" + this.props.t('profile:UpdateEmailSuccessMessage') : "")}
                        warning={!this.state.success && this.props.t('profile:UpdateUserErrorMessage')}
                      />
                  }
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

export default withRouter(withTranslation()(Profile))
