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
  // update user
  on(userActions.updateUser, (state: UserState) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUser,
      type: UserEventType.Processing,
    },
  })),
  on(userActions.updateUserSuccess, (state: UserState, { message }) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUser,
      type: UserEventType.Success,
      message,
    },
  })),
  on(userActions.updateUserError, (state: UserState, { message }) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUser,
      type: UserEventType.Error,
      message,
    },
  })),
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
  // update user profile
  on(userActions.updateUserProfile, (state: UserState) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUserProfile,
      type: UserEventType.Processing,
    },
  })),
  on(userActions.updateUserProfileSuccess, (state: UserState, { userProfile }) => ({
    ...state,
    profile: userProfile,
    event: {
      name: UserEventName.UpdateUserProfile,
      type: UserEventType.Success,
    },
  })),
  on(userActions.updateUserProfileError, (state: UserState, { message }) => ({
    ...state,
    event: {
      name: UserEventName.UpdateUserProfile,
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
  on(userActions.updateUserSettingsSuccess, (state: UserState, { userSettings }) => ({
    ...state,
    settings: userSettings,
    event: {
      name: UserEventName.UpdateUserSettings,
      type: UserEventType.Success,
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
