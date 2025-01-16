import { createReducer, on } from '@ngrx/store';

import { authActions } from './auth.actions';
import { AuthEventName, AuthEventType, AuthState } from './auth.state';

export const initialState: AuthState = {
  authToken: null,
};

export const authReducer = createReducer(
  initialState,
  // login
  on(authActions.login, (state: AuthState) => ({
    ...state,
    event: {
      name: AuthEventName.Login,
      type: AuthEventType.Loading,
    },
  })),
  on(authActions.loginSuccess, (state: AuthState, { authToken }) => ({
    ...state,
    authToken,
    event: {
      name: AuthEventName.Login,
      type: AuthEventType.Success,
    },
  })),
  on(authActions.loginError, (state: AuthState, { message }) => ({
    ...state,
    event: {
      name: AuthEventName.Login,
      type: AuthEventType.Error,
      message,
    },
  })),
  // logout
  on(authActions.logout, (state: AuthState) => ({
    ...state,
    event: {
      name: AuthEventName.Logout,
      type: AuthEventType.Loading,
    },
  })),
  on(authActions.logoutSuccess, (state: AuthState) => ({
    ...state,
    authToken: null,
    event: {
      name: AuthEventName.Logout,
      type: AuthEventType.Success,
    },
  })),
  on(authActions.logoutError, (state: AuthState, { message }) => ({
    ...state,
    event: {
      name: AuthEventName.Logout,
      type: AuthEventType.Error,
      message,
    },
  })),
  // verify
  on(authActions.verify, (state: AuthState) => ({
    ...state,
    event: {
      name: AuthEventName.Verify,
      type: AuthEventType.Loading,
    },
  })),
  on(authActions.verifySuccess, (state: AuthState, { authToken }) => ({
    ...state,
    authToken,
    event: {
      name: AuthEventName.Verify,
      type: AuthEventType.Success,
    },
  })),
  on(authActions.verifyError, (state: AuthState, { message }) => ({
    ...state,
    authToken: null,
    event: {
      name: AuthEventName.Verify,
      type: AuthEventType.Error,
      message,
    },
  })),
  // signup
  on(authActions.signup, (state: AuthState) => ({
    ...state,
    event: {
      name: AuthEventName.Signup,
      type: AuthEventType.Loading,
    },
  })),
  on(authActions.signupSuccess, (state: AuthState, { authToken }) => ({
    ...state,
    authToken,
    event: {
      name: AuthEventName.Signup,
      type: AuthEventType.Success,
    },
  })),
  on(authActions.signupError, (state: AuthState, { message }) => ({
    ...state,
    event: {
      name: AuthEventName.Signup,
      type: AuthEventType.Error,
      message,
    },
  })),
);
