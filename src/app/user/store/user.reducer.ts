import { createReducer, on } from '@ngrx/store';

import { userActions } from './user.actions';
import { UserEventType, UserState, UserEventName } from './user.state';

export const initialState: UserState = {
  email: null,
  profile: null,
  settings: null,
};

export const userReducer = createReducer(
  initialState,
  on(userActions.reset, () => initialState),
  // load user info
  on(userActions.loadUserInfo, (state: UserState) => ({
    ...state,
    event: {
      name: UserEventName.LoadUserInfo,
      type: UserEventType.Processing,
    },
  })),
  on(userActions.loadUserInfoSuccess, (state: UserState, { userInfo }) => ({
    ...state,
    ...userInfo,
    event: {
      name: UserEventName.LoadUserInfo,
      type: UserEventType.Success,
    },
  })),
  on(userActions.loadUserInfoError, (state: UserState, { message }) => ({
    ...state,
    event: {
      name: UserEventName.LoadUserInfo,
      type: UserEventType.Error,
      message,
    },
  })),
  // update user data
  on(userActions.updateUserData, (state: UserState) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUserData,
      type: UserEventType.Processing,
    },
  })),
  on(userActions.updateUserDataSuccess, (state: UserState, { userData, message }) => ({
    ...state,
    email: userData?.email || null,
    profile: userData?.profile || null,
    event: {
      name: UserEventName.UpdateUserData,
      type: UserEventType.Success,
      message,
    },
  })),
  on(userActions.updateUserDataError, (state: UserState, { message }) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUserData,
      type: UserEventType.Error,
      message,
    },
  })),
  // update user password
  on(userActions.updateUserPassword, (state: UserState) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUserPassword,
      type: UserEventType.Processing,
    },
  })),
  on(userActions.updateUserPasswordSuccess, (state: UserState, { message }) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUserPassword,
      type: UserEventType.Success,
      message,
    },
  })),
  on(userActions.updateUserPasswordError, (state: UserState, { message }) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUserPassword,
      type: UserEventType.Error,
      message,
    },
  })),
  // update user settings
  on(userActions.updateUserSettings, (state: UserState) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUserSettings,
      type: UserEventType.Processing,
    },
  })),
  on(userActions.updateUserSettingsSuccess, (state: UserState, { userSettings, message }) => ({
    ...state,
    settings: userSettings,
    event: {
      name: UserEventName.UpdateUserSettings,
      type: UserEventType.Success,
      message,
    },
  })),
  on(userActions.updateUserSettingsError, (state: UserState, { message }) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUserSettings,
      type: UserEventType.Error,
      message,
    },
  })),
);
