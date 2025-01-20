import { createReducer, on } from '@ngrx/store';

import { userActions } from './user.actions';
import { UserEventType, UserState, UserEventName } from './user.state';

export const initialState: UserState = {
  profile: null,
};

export const userReducer = createReducer(
  initialState,
  on(userActions.reset, () => initialState),
  // load user
  on(userActions.loadUser, (state: UserState) => ({
    ...state,
    event: {
      name: UserEventName.Load,
      type: UserEventType.Processing,
    },
  })),
  on(userActions.loadUserSuccess, (state: UserState, { profile }) => ({
    ...state,
    profile,
    event: {
      name: UserEventName.Load,
      type: UserEventType.Success,
    },
  })),
  on(userActions.loadUserError, (state: UserState, { message }) => ({
    ...state,
    event: {
      name: UserEventName.Load,
      type: UserEventType.Error,
      message,
    },
  })),
  // update user
  on(userActions.updateUser, (state: UserState) => ({
    ...state,
    event: {
      name: UserEventName.Update,
      type: UserEventType.Processing,
    },
  })),
  on(userActions.updateUserSuccess, (state: UserState, { profile, message }) => ({
    ...state,
    profile,
    event: {
      name: UserEventName.Update,
      type: UserEventType.Success,
      message,
    },
  })),
  on(userActions.updateUserError, (state: UserState, { message }) => ({
    ...state,
    event: {
      name: UserEventName.Update,
      type: UserEventType.Error,
      message,
    },
  })),
);
