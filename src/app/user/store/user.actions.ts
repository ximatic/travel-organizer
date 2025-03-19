import { createAction, props } from '@ngrx/store';

import { UserData, UserInfo, UserPassword } from '../models/user.model';
import { UserSettings } from '../models/user-settings.model';

export enum UserAction {
  Reset = 'user/reset',
  LoadUserInfo = 'user/loadUserInfo',
  LoadUserInfoSuccess = 'user/loadUserInfoSuccess',
  LoadUserInfoError = 'user/loadUserInfoError',
  // UpdateUser = 'user/updateUser',
  // UpdateUserSuccess = 'user/updateUserSuccess',
  // UpdateUserError = 'user/updateUserError',
  // UpdateUserProfile = 'user/updateUserProfile',
  // UpdateUserProfileSuccess = 'user/updateUserProfileSuccess',
  // UpdateUserProfileError = 'user/updateUserProfileError',
  UpdateUserData = 'user/updateUserData',
  UpdateUserDataSuccess = 'user/updateUserDataSuccess',
  UpdateUserDataError = 'user/updateUserDataError',
  UpdateUserPassword = 'user/updateUserPassword',
  UpdateUserPasswordSuccess = 'user/updateUserPasswordSuccess',
  UpdateUserPasswordError = 'user/updateUserPasswordError',
  UpdateUserSettings = 'user/updateUserSettings',
  UpdateUserSettingsSuccess = 'user/updateUserSettingsSuccess',
  UpdateUserSettingsError = 'user/updateUserSettingsError',
}

// common

export interface ActionPropsSuccess {
  message?: string;
}

export interface ActionPropsError {
  message: string;
}

// // user

// export interface ActionPropsUser {
//   userRequest: UserRequest;
// }

// user info

export interface ActionPropsUserInfoSuccess extends ActionPropsSuccess {
  userInfo: UserInfo | null;
}

// // user profile

// export interface ActionPropsUserProfile {
//   userProfile: UserProfile;
// }

// export interface ActionPropsUserProfileSuccess {
//   userProfile: UserProfile | null;
// }

// user data

export interface ActionPropsUserData {
  userData: UserData;
}

export interface ActionPropsUserDataSuccess extends ActionPropsSuccess {
  userData: UserData | null;
}

// user password

export interface ActionPropsUserPassword {
  userPassword: UserPassword;
}

// user settings

export interface ActionPropsUserSettings {
  userSettings: UserSettings;
}

export interface ActionPropsUserSettingsSuccess extends ActionPropsSuccess {
  userSettings: UserSettings | null;
}

export const userActions = {
  reset: createAction(UserAction.Reset),
  loadUserInfo: createAction(UserAction.LoadUserInfo),
  loadUserInfoSuccess: createAction(UserAction.LoadUserInfoSuccess, props<ActionPropsUserInfoSuccess>()),
  loadUserInfoError: createAction(UserAction.LoadUserInfoError, props<ActionPropsError>()),
  // updateUser: createAction(UserAction.UpdateUser, props<ActionPropsUser>()),
  // updateUserSuccess: createAction(UserAction.UpdateUserSuccess, props<ActionPropsSuccess>()),
  // updateUserError: createAction(UserAction.UpdateUserError, props<ActionPropsError>()),
  // updateUserProfile: createAction(UserAction.UpdateUserProfile, props<ActionPropsUserProfile>()),
  // updateUserProfileSuccess: createAction(UserAction.UpdateUserProfileSuccess, props<ActionPropsUserProfileSuccess>()),
  // updateUserProfileError: createAction(UserAction.UpdateUserProfileError, props<ActionPropsError>()),
  updateUserData: createAction(UserAction.UpdateUserData, props<ActionPropsUserData>()),
  updateUserDataSuccess: createAction(UserAction.UpdateUserDataSuccess, props<ActionPropsUserDataSuccess>()),
  updateUserDataError: createAction(UserAction.UpdateUserDataError, props<ActionPropsError>()),
  updateUserPassword: createAction(UserAction.UpdateUserPassword, props<ActionPropsUserPassword>()),
  updateUserPasswordSuccess: createAction(UserAction.UpdateUserPasswordSuccess, props<ActionPropsSuccess>()),
  updateUserPasswordError: createAction(UserAction.UpdateUserPasswordError, props<ActionPropsError>()),
  updateUserSettings: createAction(UserAction.UpdateUserSettings, props<ActionPropsUserSettings>()),
  updateUserSettingsSuccess: createAction(UserAction.UpdateUserSettingsSuccess, props<ActionPropsUserSettingsSuccess>()),
  updateUserSettingsError: createAction(UserAction.UpdateUserSettingsError, props<ActionPropsError>()),
};
