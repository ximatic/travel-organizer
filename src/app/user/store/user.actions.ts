import { createAction, props } from '@ngrx/store';

import { UserProfile } from '../models/user-profile.model';
import { UserInfo, UserRequest } from '../models/user.model';
import { UserSettings } from '../models/user-settings.model';

export enum UserAction {
  Reset = 'user/reset',
  LoadUserInfo = 'user/loadUserInfo',
  LoadUserInfoSuccess = 'user/loadUserInfoSuccess',
  LoadUserInfoError = 'user/loadUserInfoError',
  UpdateUser = 'user/updateUser',
  UpdateUserSuccess = 'user/updateUserSuccess',
  UpdateUserError = 'user/updateUserError',
  UpdateUserProfile = 'user/updateUserProfile',
  UpdateUserProfileSuccess = 'user/updateUserProfileSuccess',
  UpdateUserProfileError = 'user/updateUserProfileError',
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

// user

export interface ActionPropsUser {
  userRequest: UserRequest;
}

// user info

export interface ActionPropsUserInfoSuccess {
  userInfo: UserInfo | null;
  message?: string;
}

// user profile

export interface ActionPropsUserProfile {
  userProfile: UserProfile;
}

export interface ActionPropsUserProfileSuccess {
  userProfile: UserProfile | null;
}

// user settings

export interface ActionPropsUserSettings {
  userSettings: UserSettings;
}

export interface ActionPropsUserSettingsSuccess {
  userSettings: UserSettings | null;
}

export const userActions = {
  reset: createAction(UserAction.Reset),
  loadUserInfo: createAction(UserAction.LoadUserInfo),
  loadUserInfoSuccess: createAction(UserAction.LoadUserInfoSuccess, props<ActionPropsUserInfoSuccess>()),
  loadUserInfoError: createAction(UserAction.LoadUserInfoError, props<ActionPropsError>()),
  updateUser: createAction(UserAction.UpdateUser, props<ActionPropsUser>()),
  updateUserSuccess: createAction(UserAction.UpdateUserSuccess, props<ActionPropsSuccess>()),
  updateUserError: createAction(UserAction.UpdateUserError, props<ActionPropsError>()),
  updateUserProfile: createAction(UserAction.UpdateUserProfile, props<ActionPropsUserProfile>()),
  updateUserProfileSuccess: createAction(UserAction.UpdateUserProfileSuccess, props<ActionPropsUserProfileSuccess>()),
  updateUserProfileError: createAction(UserAction.UpdateUserProfileError, props<ActionPropsError>()),
  updateUserSettings: createAction(UserAction.UpdateUserSettings, props<ActionPropsUserSettings>()),
  updateUserSettingsSuccess: createAction(UserAction.UpdateUserSettingsSuccess, props<ActionPropsUserSettingsSuccess>()),
  updateUserSettingsError: createAction(UserAction.UpdateUserSettingsError, props<ActionPropsError>()),
};
