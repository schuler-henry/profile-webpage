import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import React, { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import { ISport, ISportClub, ISportClubMembership, ISportClubMembershipSport, IUser } from '../interfaces/database'
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
import { ClickableIcon } from '../components/ClickableIcon/ClickableIcon'
import { AdminSportClubSportUserList } from '../components/AdminSportClubSportUserList/AdminSportClubSportUserList'
import { getSportClubPositionText } from '../shared/getSportClubPositionText'
import { AccessLevel } from '../enums/accessLevel'

const onRenderOption = (option: DropdownOption): JSX.Element => {
  return(
    <div style={{ width: "100%", display: "flex"}}>
      {
        option?.data?.icon &&
        <span style={{ display: "flex", alignItems: "center" }}>
          <Icon style={{ display: "flex", marginRight: '8px', fontSize: "15px", height: "15px" }} iconName={option.data.icon} />
        </span>
      }
      <span>
        {option?.text}
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
  submitSportClub: boolean;
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
  searchUser: string;
  foundUsers: IUser[];
  maxViewableUsers: number;
  createUserUsername: string;
  createUserFirstName: string;
  createUserLastName: string;
  createUserUsernameError: boolean;
  createUserActivationCode: string;
  submitCreateUser: boolean;
  displayCreateUserSuccess: boolean;
  deleteMembershipItem: ISportClubMembership;
  availableSportClubs: ISportClub[];
  adminClubs: ISportClub[];
  selectedSportClub: ISportClub;
  selectedSport: ISport;
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
 * @class Profile Component Class
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
      submitSportClub: false,
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
      searchUser: "",
      foundUsers: [],
      maxViewableUsers: 3,
      createUserUsername: "",
      createUserFirstName: "",
      createUserLastName: "",
      createUserUsernameError: false,
      createUserActivationCode: "",
      submitCreateUser: false,
      displayCreateUserSuccess: false,
      deleteMembershipItem: undefined,
      availableSportClubs: [],
      adminClubs: [],
      selectedSportClub: undefined,
      selectedSport: undefined,
    }
  }

  static contextType = PWPAuthContext;

  async componentDidMount() {
    const user = await FrontEndController.getUserFromToken(FrontEndController.getUserToken());
    if (user.accessLevel >= AccessLevel.ADMIN) {
      // get subPageOptions element with key="password" and add element after it without removing any elements
      const index = this.subPageOptions.findIndex(element => element.key === "password");
      this.subPageOptions.splice(index + 1, 0, {key: "admin", text: this.props.t('profile:Admin'), data: {icon: "ContactCardSettingsIcon"}})     
    }
    this.updateAvailableSportClubs();
    this.setState({ changedUser: user, });
  }

  componentDidUpdate(prevProps: Readonly<ProfileProps>, prevState: Readonly<ProfileState>, snapshot?: any): void {
    const { menu } = this.props.router.query;
    if (menu !== this.state.selectedMenu && this.subPageOptions.find(element => element.key === menu?.toString())) {
      this.setState({ selectedMenu: menu.toString() });
    }
  }

  componentWillUnmount() {
  }

  /**
   * This function updates the users sport club lists to display sport clubs (membership/admin)
   */
  private async updateAvailableSportClubs() {
    const user = await FrontEndController.getUserFromToken(FrontEndController.getUserToken());
    let sportClubs = await FrontEndController.getSportClubs(FrontEndController.getUserToken());
    let adminClubs = await FrontEndController.getAdminSportClubs(FrontEndController.getUserToken());
    if (adminClubs.length !== 0) {
      if (this.subPageOptions.filter((option) => option.key === "sportClubAdmin").length === 0) {
        // get subPageOptions element with key="sportClubMemberships" and add element after it without removing any elements
        const index = this.subPageOptions.findIndex(element => element.key === "sportClubMemberships");
        this.subPageOptions.splice(index + 1, 0, {key: "sportClubAdmin", text: this.props.t('profile:SportClubAdmin'), data: {icon: "MoreSports"}})
      }
    } else {
      this.subPageOptions = this.subPageOptions.filter((option) => option.key !== "sportClubAdmin");
    }
    // remove memberships from dropdown options
    for (let i = 0; i < sportClubs.length; i++) {
      let sportClub = sportClubs[i];
      for (let membershipSport of user.sportClubMembership.find((sportClubMembership: ISportClubMembership) => ((typeof sportClubMembership.sportClub === "object") ? sportClubMembership.sportClub.id : sportClubMembership.sportClub) === sportClub.id)?.membershipSport || []) {
        const index = sportClub.sport.findIndex(i => i.id === membershipSport.sport.id);
        sportClub.sport.splice(index, 1)
      }
      if (sportClub.sport.length === 0) {
        sportClubs.splice(sportClubs.indexOf(sportClub), 1);
        // decrement counter because element was removed
        i--;
      }
    }

    this.setState({ availableSportClubs: sportClubs, adminClubs: adminClubs });
  }

  private async searchUser() {
    this.setState({ fetchData: true });
    this.setState({ foundUsers: await FrontEndController.findUsers(FrontEndController.getUserToken(), this.state.searchUser), searchUser: "", maxViewableUsers: 3, fetchData: false })
  }

  private subPageOptions: DropdownOption[] = [
    {key: "profile", text: this.props.t('common:Profile'), data: {icon: "Contact"}},
    {key: "email", text: this.props.t('profile:Email'), data: {icon: "Mail"}},
    {key: "password", text: this.props.t('profile:Password'), data: {icon: "Lock"}},
    {key: "sportClubMemberships", text: this.props.t('profile:SportClubMemberships'), data: {icon: "MoreSports"}}
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
                    options={this.subPageOptions} 
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
                    this.state.selectedMenu === "admin" &&
                    <div>
                      {
                        this.context.user.accessLevel >= AccessLevel.ADMIN ?
                          <div>
                            <div className={styles.inputWrapper}>
                              <h1>
                                {this.props.t("profile:SearchForUser")}
                              </h1>
                              <div className={styles.inlineSubmit}>
                                <input 
                                  type="text" 
                                  className={styles.input}
                                  value={this.state.searchUser}
                                  disabled={this.state.fetchData}
                                  onChange={async (event) => {
                                    this.setState({ searchUser: event.target.value })
                                  }}
                                  onKeyDown={async (event) => {
                                    if (event.key === "Enter" && !this.state.fetchData) {
                                      event.preventDefault();
                                      this.searchUser()
                                    }
                                  }}
                                  enterKeyHint="done"
                                />
                                <ClickableIcon 
                                  iconName={this.state.fetchData ? "Sync" : "Play"}
                                  onClick={async () => { !this.state.fetchData && this.searchUser() }}
                                  spin={this.state.fetchData}
                                />
                                {
                                  this.state.foundUsers.length > 0 &&
                                  <ClickableIcon
                                    iconName={this.state.maxViewableUsers === 0 ? "ChevronRight" : "ChevronDown"}
                                    onClick={() => {
                                      this.setState({ maxViewableUsers: this.state.maxViewableUsers === 0 ? 3 : 0 })
                                    }}
                                    fontSize={"15px"}
                                  />
                                }
                              </div>
                              {
                                this.state.foundUsers.length > 0 && this.state.maxViewableUsers > 0 &&
                                <div className={styles.userList}>
                                  {
                                    this.state.foundUsers.slice(0, this.state.maxViewableUsers).map((user, index) => {
                                      return (
                                        <div key={"UserListElement" + user.username} className={styles.userItem}>
                                          <div className={styles.table}>
                                            <table>
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    <h1>
                                                      {this.props.t("profile:Username")}:
                                                    </h1>
                                                  </td>
                                                  <td>
                                                    {user.username}
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <h1>
                                                      {this.props.t("profile:Name")}:
                                                    </h1>
                                                  </td>
                                                  <td>
                                                    {user.firstName} {user.lastName}
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <h1>
                                                      {this.props.t("profile:Email")}:
                                                    </h1>
                                                  </td>
                                                  <td>
                                                    {user.email}
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <h1 style={{ whiteSpace: "nowrap" }}>
                                                      {this.props.t("profile:ActivationCode")}:
                                                    </h1>
                                                  </td>
                                                  <td>
                                                    <div className={styles.activationCode}>
                                                      <p style={{ backgroundColor: user.activationCode === "" ? "var(--color-bg-selected)" : ""}}>
                                                        {user.activationCode}
                                                      </p>
                                                      <ClickableIcon 
                                                        iconName={user.activationCode === "" ? 'View' : 'Hide3'} 
                                                        fontSize='16px'
                                                        buttonSize='18px'
                                                        onClick={async () => {
                                                          if (!this.state.fetchData) {
                                                            if (user.activationCode === "") {
                                                              this.setState({ fetchData: true })
                                                              const activationCode = await FrontEndController.getActivationCode(FrontEndController.getUserToken(), user.id)
                                                              this.setState({ foundUsers: this.state.foundUsers.map((foundUser) => {return(foundUser.id === user.id ? {...foundUser, activationCode: activationCode} : foundUser)}), fetchData: false})
                                                            } else {
                                                              this.setState({ fetchData: true })
                                                              this.setState({ foundUsers: this.state.foundUsers.map((foundUser) => {return(foundUser.id === user.id ? {...foundUser, activationCode: ""} : foundUser)}), fetchData: false})
                                                            }
                                                          }
                                                        }}
                                                      />
                                                      {
                                                        user.activationCode !== "" &&
                                                        <ClickableIcon 
                                                          iconName='Copy'
                                                          fontSize='16px'
                                                          buttonSize='18px'
                                                          onClick={() => {
                                                            try {
                                                              navigator.clipboard.writeText(user.activationCode)
                                                            } catch {
                                                              alert("Could not copy activation code to clipboard. Please copy it manually.")
                                                            }
                                                          }}
                                                        />
                                                      }
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      )
                                    })
                                  }
                                  {
                                    this.state.foundUsers.length > this.state.maxViewableUsers &&
                                    <div className={styles.buttonItem}>
                                      <Button
                                        onClick={() => {
                                          this.setState({ maxViewableUsers: this.state.maxViewableUsers + 3 })
                                        }}
                                      >
                                        {this.props.t("profile:ViewMoreUsers")}
                                      </Button>
                                    </div>
                                  }
                                </div>
                              }
                            </div>
                            <div className={styles.inputWrapper}>
                              <h1>
                                {this.props.t("profile:CreateUser")}
                              </h1>
                              <input 
                                type="text"
                                className={`${styles.input} ${this.state.createUserUsernameError && styles.inputError} ${this.state.createUserUsername === "" ? styles.inputChanged : styles.inputOk}`}
                                placeholder={this.props.t("profile:Username")}
                                value={this.state.createUserUsername}
                                disabled={this.state.fetchData}
                                onChange={async (event) => {
                                  this.setState({ createUserUsername: event.target.value.trim() })
                                  this.setState({ createUserUsernameError: event.target.value.trim() !== "" && (await FrontEndController.doesUserExist(event.target.value.trim()) || !await FrontEndController.isUsernameValid(event.target.value.trim())) })
                                }}
                              />
                              {
                                this.state.createUserUsernameError &&
                                  <p className={styles.errorText}>
                                    {this.props.t('profile:UsernameTaken')}
                                  </p>
                              }
                              <h1></h1>
                              <input 
                                type="text"
                                className={`${styles.input} ${this.state.createUserFirstName === "" ? styles.inputChanged : styles.inputOk}`}
                                placeholder={this.props.t("profile:FirstName")}
                                value={this.state.createUserFirstName}
                                disabled={this.state.fetchData}
                                onChange={(event) => {
                                  this.setState({ createUserFirstName: event.target.value.replaceAll("  ", " ").trimStart() })
                                }}
                              />
                              <h1></h1>
                              <input 
                                type="text"
                                className={`${styles.input} ${this.state.createUserLastName === "" ? styles.inputChanged : styles.inputOk}`}
                                placeholder={this.props.t("profile:LastName")}
                                value={this.state.createUserLastName}
                                disabled={this.state.fetchData}
                                onChange={(event) => {
                                  this.setState({ createUserLastName: event.target.value.replaceAll(" ", "") })
                                }}
                                enterKeyHint="done"
                              />
                            </div>
                            <div className={styles.submitButton}>
                              <Button
                                disabled={this.state.fetchData || this.state.createUserUsername === "" || this.state.createUserFirstName === "" || this.state.createUserLastName === ""}
                                onClick={() => {
                                  this.setState({ submitCreateUser: true })
                                }}
                              >
                                {this.props.t("profile:SubmitCreateUser")}
                              </Button>
                            </div>
                            {
                              this.state.submitCreateUser &&
                                <ConfirmPopUp 
                                  title={this.props.t('profile:SubmitCreateUser')} 
                                  onConfirm={this.state.fetchData ? undefined : async () => {
                                    this.setState({ fetchData: true })
                                    const activationCode = await FrontEndController.createUserAsAdmin(FrontEndController.getUserToken(), this.state.createUserUsername, this.state.createUserFirstName, this.state.createUserLastName)
                                    this.setState({ success: activationCode !== "", fetchData: false, createUserActivationCode: activationCode, displayCreateUserSuccess: true, submitCreateUser: false })
                                  }}
                                  onCancel={this.state.fetchData ? undefined : () => {
                                    this.setState({ submitCreateUser: false })
                                  }}
                                  warning={this.props.t('profile:UndoWarning')}
                                  sync={this.state.fetchData}
                                >
                                  <div className={styles.confirmWrapper} style={{ alignItems: "center" }}>
                                    <div className={styles.userItem}>
                                      <div className={styles.table}>
                                        <table>
                                          <tbody>
                                            <tr>
                                              <td>
                                                <h1>
                                                  {this.props.t("profile:Username")}:
                                                </h1>
                                              </td>
                                              <td>
                                                {this.state.createUserUsername}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>
                                                <h1>
                                                  {this.props.t("profile:Name")}:
                                                </h1>
                                              </td>
                                              <td>
                                                {this.state.createUserFirstName} {this.state.createUserLastName}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </ConfirmPopUp>
                            }
                            {
                              this.state.displayCreateUserSuccess && 
                                <ConfirmPopUp
                                  title={this.state.success ? this.props.t('common:Success') : this.props.t('common:Error')}
                                  warning={!this.state.success && this.props.t('profile:CreateUserErrorMessage')}
                                  onConfirm={() => {
                                    this.state.success ? 
                                      this.setState({ createUserUsername: "", createUserFirstName: "", createUserLastName: "", createUserActivationCode: "", displayCreateUserSuccess: false, success: false })
                                      :
                                      this.setState({ displayCreateUserSuccess: false, success: false })
                                  }}
                                >
                                  {
                                    this.state.success &&
                                      <div className={styles.confirmWrapper} style={{ alignItems: "center" }}>
                                        <div className={styles.userItem}>
                                          <div className={styles.table}>
                                            <table>
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    <h1>
                                                      {this.props.t("profile:Username")}:
                                                    </h1>
                                                  </td>
                                                  <td>
                                                    {this.state.createUserUsername}
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <h1>
                                                      {this.props.t("profile:Name")}:
                                                    </h1>
                                                  </td>
                                                  <td>
                                                    {this.state.createUserFirstName} {this.state.createUserLastName}
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <h1 style={{ whiteSpace: "nowrap" }}>
                                                      {this.props.t("profile:ActivationCode")}:
                                                    </h1>
                                                  </td>
                                                  <td>
                                                    <div className={styles.activationCode}>
                                                      <p>
                                                        {this.state.createUserActivationCode}
                                                      </p>
                                                      <ClickableIcon 
                                                        iconName='Copy'
                                                        fontSize='16px'
                                                        buttonSize='18px'
                                                        onClick={() => {
                                                          try {
                                                            navigator.clipboard.writeText(this.state.createUserActivationCode)
                                                          } catch {
                                                            alert("Could not copy activation code to clipboard. Please copy it manually.")
                                                          }
                                                        }}
                                                      />
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </div>
                                  }
                                </ConfirmPopUp>
                            }
                          </div>
                          :
                          <div className={styles.errorWrapper}>
                            <h1>You are not authorized to view this page.</h1>
                          </div>
                      }
                    </div>
                  }

                  {
                    this.state.selectedMenu === "sportClubMemberships" &&
                    <div>
                      <span className={styles.inlineHeading}>
                        <h2>{this.props.t('profile:MySportClubMemberships')}</h2>
                        <ClickableIcon 
                          iconName="Sync"
                          onClick={async () => {
                            this.setState({ fetchData: true })
                            await FrontEndController.updateLoginStatus();
                            await this.updateAvailableSportClubs();
                            this.setState({ fetchData: false })
                          }}
                          spin={this.state.fetchData}
                        />
                      </span>
                      <div>
                        <div className={styles.sportClubMembershipTableWrapper}>
                          <table>
                            <thead>
                              <tr>
                                <th>{this.props.t('profile:SportClub')}</th>
                                <th>{this.props.t('profile:Sport')}</th>
                                <th>{this.props.t('profile:Position')}</th>
                                <th>{this.props.t('profile:Approved')}</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.context.user?.sportClubMembership?.map((membership: ISportClubMembership, index) => {
                                  return(
                                    <React.Fragment key={index}>
                                      {
                                        membership.membershipSport.map((membershipSport: ISportClubMembershipSport, sportIndex) => {
                                          return(
                                            <tr key={"sport" + sportIndex}>
                                              <td>{typeof membership.sportClub === "object" && membership.sportClub.name}</td>
                                              <td>{membershipSport.sport.name}</td>
                                              <td style={{ color: "var(--color-text-secondary)" }}>{this.props.t('profile:' + getSportClubPositionText(membershipSport?.memberStatus))}</td>
                                              <td style={{ color: membershipSport.approved ? "var(--color-text-approved)" : "var(--color-text-warning)" }}>{membershipSport.approved.toString()}</td>
                                              <td>
                                                <ClickableIcon 
                                                  iconName="Trash" 
                                                  buttonSize="30px" 
                                                  fontSize="18px"
                                                  onClick={() => {
                                                    let deleteMembership = structuredClone(membership);
                                                    deleteMembership.membershipSport = [structuredClone(membershipSport)];
                                                    this.setState({ deleteMembershipItem: deleteMembership })
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          )
                                        })
                                      }
                                    </React.Fragment>
                                  )
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {
                        (this.state.deleteMembershipItem) &&
                        <ConfirmPopUp
                          title={this.props.t('profile:DeleteMembership')}
                          warning={this.props.t('profile:DeleteMembershipWarning')}
                          onConfirm={this.state.fetchData ? undefined : async () => {
                            this.setState({ fetchData: true })
                            this.setState({ success: await FrontEndController.deleteSportClubMembership(FrontEndController.getUserToken(), this.state.deleteMembershipItem), fetchData: false, displaySuccess: true, deleteMembershipItem: undefined })
                          }}
                          onCancel={this.state.fetchData ? undefined : () => {
                            this.setState({ deleteMembershipItem: undefined })
                          }}
                          sync={this.state.fetchData}
                        >
                          <div className={`${styles.confirmWrapper} ${styles.sportClubMembershipTableWrapper}`}>
                            <table style={{margin: "0 auto"}}>
                              <thead>
                                <tr>
                                  <th>{this.props.t('profile:SportClub')}</th>
                                  <th>{this.props.t('profile:Sport')}</th>
                                  <th>{this.props.t('profile:Approved')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  this.state.deleteMembershipItem.membershipSport.map((membershipSport: ISportClubMembershipSport, sportIndex) => {
                                    return(
                                      <tr key={"deleteSport" + sportIndex}>
                                        <td>{typeof this.state.deleteMembershipItem.sportClub === "object" && this.state.deleteMembershipItem.sportClub.name}</td>
                                        <td>{membershipSport.sport.name}</td>
                                        <td style={{ color: membershipSport.approved ? "var(--color-text-approved)" : "var(--color-text-warning)" }}>{membershipSport.approved.toString()}</td>
                                      </tr>
                                    )
                                  })
                                }
                              </tbody>
                            </table>
                          </div>
                        </ConfirmPopUp>
                      }
                      <h2>{this.props.t('profile:AddSportClubMembership')}</h2>
                      <div>
                        <div className={styles.inputWrapper}>
                          <h1>{this.props.t('profile:SportClub')}</h1>
                          <Dropdown 
                            options={
                              this.state.availableSportClubs?.reduce((returnValue: [], item, index) => returnValue.concat(Object.assign({ key: index.toString(), text: item.name })), []) || []
                            }
                            selectedKey={this.state.availableSportClubs?.indexOf(this.state.selectedSportClub).toString()}
                            placeholder={{ key: "", text: this.props.t('profile:SelectSportClub') }}
                            onRenderOption={onRenderOption} 
                            onRenderCaretDown={onRenderCaretDown}
                            onChange={(event: React.FormEvent<HTMLDivElement>, item: DropdownOption): void => {
                              this.setState({ selectedSport: this.state.selectedSportClub === this.state.availableSportClubs[item.key] ? this.state.selectedSport : undefined, selectedSportClub: this.state.availableSportClubs[item.key] })
                            }}
                            width={"100%"}
                          />
                        </div>
                        <div className={styles.inputWrapper}>
                          <h1>{this.props.t('profile:Sport')}</h1>
                          <Dropdown 
                            options={
                              this.state.selectedSportClub?.sport.reduce((returnValue: [], item, index) => returnValue.concat(Object.assign({ key: index.toString(), text: item.name })), []) || []
                            }
                            selectedKey={this.state.selectedSportClub?.sport.indexOf(this.state.selectedSport).toString()}
                            placeholder={{ key: "", text: this.props.t('profile:SelectSport') }}
                            onRenderOption={onRenderOption}
                            onRenderCaretDown={onRenderCaretDown}
                            onChange={(event: React.FormEvent<HTMLDivElement>, item: DropdownOption): void => {
                              this.setState({ selectedSport: this.state.selectedSportClub.sport[item.key] })
                            }}
                            width={"100%"}
                          />
                          {
                            this.state.selectedSportClub === undefined &&
                              <p className={styles.errorText}>
                                {this.props.t('profile:SelectSportClub')}
                              </p>
                          }
                        </div>
                      </div>
                      <div className={styles.submitButton}>
                        <Button
                          onClick={() => {
                            this.setState({ submitSportClub: true })
                          }}
                          disabled={this.state.submitSportClub || this.state.displaySuccess || this.state.selectedSportClub === undefined || this.state.selectedSport === undefined}
                        >
                          {this.props.t('profile:AddSportClubMembership')}
                        </Button>
                      </div>
                      {
                        this.state.submitSportClub &&
                        <ConfirmPopUp
                          title={this.props.t('profile:SubmitAddSportClubMembership')}
                          message={this.props.t('profile:SubmitAddSportClubMembershipMessage')}
                          onConfirm={this.state.fetchData ? undefined : async () => {
                            this.setState({ fetchData: true })
                            this.setState({ success: await FrontEndController.addSportClubMembership(FrontEndController.getUserToken(), {id: undefined, user: undefined, membershipSport: [{approved: undefined, memberStatus: undefined, sport: this.state.selectedSport}], sportClub: this.state.selectedSportClub}), selectedSportClub: undefined, selectedSport: undefined, fetchData: false, displaySuccess: true, submitSportClub: false })
                          }}
                          onCancel={this.state.fetchData ? undefined : () => {
                            this.setState({ submitSportClub: false })
                          }}
                          sync={this.state.fetchData}
                        >
                          <div className={`${styles.confirmWrapper} ${styles.sportClubMembershipTableWrapper}`}>
                            <table style={{margin: "0 auto"}}>
                              <thead>
                                <tr>
                                  <th>{this.props.t('profile:SportClub')}</th>
                                  <th>{this.props.t('profile:Sport')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>{this.state.selectedSportClub?.name}</td>
                                  <td>{this.state.selectedSport?.name}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </ConfirmPopUp>
                      }
                    </div>
                  }

                  {
                    this.state.selectedMenu === "sportClubAdmin" &&
                    <div className={styles.sportClubAdminWrapper}>
                      {
                        this.state.adminClubs.map((club, clubIndex) => {
                          return (
                            <div key={"club" + clubIndex} className={styles.adminClubItem}>
                              <span className={styles.inlineHeading}>
                                <h2>{club.name}</h2>
                                <ClickableIcon 
                                  iconName="Sync"
                                  onClick={async () => {
                                    this.setState({ fetchData: true })
                                    await this.updateAvailableSportClubs();
                                    this.setState({ fetchData: false })
                                  }}
                                  spin={this.state.fetchData}
                                />
                              </span>
                              <div className={styles.sportClubAdminSportWrapper}>
                                {
                                  club.sport.map((sport, sportIndex) => {
                                    return (
                                      <div key={"sportAdmin" + sportIndex}>
                                        <AdminSportClubSportUserList 
                                          sport={sport}
                                          club={club}
                                          t={this.props.t}
                                          i18n={this.props.i18n}
                                          tReady={this.props.tReady}
                                        />
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  }

                  {
                    this.state.displaySuccess &&
                      <ConfirmPopUp
                        title={this.state.success ? this.props.t('common:Success') : this.props.t('common:Error')}
                        onConfirm={() => {
                          if (this.state.selectedMenu === "sportClubMemberships" || this.state.selectedMenu === "sportClubAdmin") {
                            this.updateAvailableSportClubs();
                          }
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
