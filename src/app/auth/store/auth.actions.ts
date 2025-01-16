import { createAction, props } from '@ngrx/store';

import { AuthToken, LoginPayload, SignupPayload } from '../model/auth.model';

export enum AuthAction {
  Login = 'auth/login',
  LoginSuccess = 'auth/loginSuccess',
  LoginError = 'auth/loginError',
  Logout = 'auth/logout',
  LogoutSuccess = 'auth/logoutSuccess',
  LogoutError = 'auth/logoutError',
  Verify = 'auth/verify',
  VerifySuccess = 'auth/verifySuccess',
  VerifyError = 'auth/verifyError',
  // Refresh = 'auth/refresh',
  // RefreshSuccess = 'auth/refreshSuccess',
  // RefreshError = 'auth/refreshError',
  Signup = 'auth/signup',
  SignupSuccess = 'auth/signupSuccess',
  SignupError = 'auth/signupError',
}

export interface ActionPropsAuthSuccess {
  authToken: AuthToken;
  message?: string;
}

export interface ActionPropsAuthError {
  message: string;
}

export const authActions = {
  login: createAction(AuthAction.Login, props<LoginPayload>()),
  loginSuccess: createAction(AuthAction.LoginSuccess, props<ActionPropsAuthSuccess>()),
  loginError: createAction(AuthAction.LoginError, props<ActionPropsAuthError>()),
  logout: createAction(AuthAction.Logout),
  logoutSuccess: createAction(AuthAction.LogoutSuccess),
  logoutError: createAction(AuthAction.LogoutError, props<ActionPropsAuthError>()),
  verify: createAction(AuthAction.Verify),
  verifySuccess: createAction(AuthAction.VerifySuccess, props<ActionPropsAuthSuccess>()),
  verifyError: createAction(AuthAction.VerifyError, props<ActionPropsAuthError>()),
  // refresh: createAction(AuthAction.Refresh),
  // refreshSuccess: createAction(AuthAction.RefreshSuccess, props<ActionPropsAuthSuccess>()),
  // refreshError: createAction(AuthAction.RefreshError, props<ActionPropsAuthError>()),
  signup: createAction(AuthAction.Signup, props<SignupPayload>()),
  signupSuccess: createAction(AuthAction.SignupSuccess, props<ActionPropsAuthSuccess>()),
  signupError: createAction(AuthAction.SignupError, props<ActionPropsAuthError>()),
};
