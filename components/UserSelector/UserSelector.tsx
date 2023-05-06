import { Spinner } from "@fluentui/react";
import React, { Component } from "react";
import { IUser } from "../../interfaces/database";
import { ClickableIcon } from "../ClickableIcon/ClickableIcon";
import { ConfirmPopUp } from "../ConfirmPopUp/ConfirmPopUp";
import { PWPLanguageContext } from "../PWPLanguageProvider/PWPLanguageProvider";
import styles from "./UserSelector.module.css";

export interface UserSelectorState {
  selectableUsers: IUser[];
  selectedUsers: IUser[];
  selected: number[];
}

export interface UserSelectorProps {
  userList: IUser[];
  onConfirm: (selectedUser: IUser[]) => void;
  onCancel?: () => void;
  sync?: boolean;
}

export class UserSelector extends Component<UserSelectorProps, UserSelectorState> {
  constructor(props) {
    super(props);
    this.state = {
      selectableUsers: undefined,
      selectedUsers: [],
      selected: [],
    }
  }

  componentDidMount(): void {
    this.props.userList !== undefined && this.setState({ selectableUsers: this.props.userList });
  }

  componentDidUpdate(prevProps: Readonly<UserSelectorProps>, prevState: Readonly<UserSelectorState>, snapshot?: any): void {
    // if this.props.userList changes from undefined to array set this.state.selectableUsers to this.props.userList
    if (prevProps.userList === undefined && this.props.userList !== undefined) {
      this.setState({ selectableUsers: structuredClone(this.props.userList), selectedUsers: [] });
    }
  }

  render() {
    return (
      <PWPLanguageContext.Consumer>
        { LanguageContext => (
          <ConfirmPopUp
            title={LanguageContext.t('common:SelectUser')}
            onConfirm={() => this.props.onConfirm(this.state.selectedUsers)}
            onCancel={this.props.onCancel}
            sync={this.props.sync}
          >
            <React.Fragment>
              {
                this.state.selectableUsers === undefined ?
                  <Spinner className={styles.spinner} size={3} />
                  :
                  <div className={styles.content}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th></th>
                          <th>{LanguageContext.t('common:Username')}</th>
                          <th>{LanguageContext.t('common:FirstName')}</th>
                          <th>{LanguageContext.t('common:LastName')}</th>
                          <th>{LanguageContext.t('common:Email')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.selectableUsers.map((user, userIndex) => {
                            const selected = this.state.selectedUsers.includes(user);
                            return (
                              <tr key={userIndex} id={"Row" + userIndex.toString()} style={{ backgroundColor: selected ? "var(--color-bg-selected)" : "" }}>
                                <td>
                                  {
                                    selected ?
                                      <ClickableIcon 
                                        iconName="Remove"
                                        color="var(--color-text-warning)"
                                        onClick={() => {
                                          // remove this item from this.state.selectableUsers and add it to this.state.selectedUsers
                                          const selectedUsers = this.state.selectedUsers;
                                          selectedUsers.splice(selectedUsers.indexOf(user), 1);
                                          this.setState({ selectedUsers });

                                        }}
                                      />
                                      :
                                      <ClickableIcon 
                                        iconName="Add"
                                        color="var(--color-text-approved)"
                                        onClick={() => {
                                          // remove this item from this.state.selectableUsers and add it to this.state.selectedUsers
                                          const selectedUsers = this.state.selectedUsers;
                                          selectedUsers.push(user);
                                          this.setState({ selectedUsers});
                                        }}
                                      />
                                  }
                                </td>
                                <td>{user.username}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
              }
            </React.Fragment>
          </ConfirmPopUp>
        )}
      </PWPLanguageContext.Consumer>
    );
  }
}