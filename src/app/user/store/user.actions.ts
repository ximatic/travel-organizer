import { createAction, props } from '@ngrx/store';

import { UserProfile } from '../models/user.model';

export enum UserAction {
  Reset = 'user/reset',
  LoadUser = 'user/load',
  LoadUserSuccess = 'user/loadSuccess',
  LoadUserError = 'user/loadError',
  UpdateUser = 'user/update',
  UpdateUserSuccess = 'user/updateSuccess',
  UpdateUserError = 'user/updateError',
}

export interface ActionPropsUser {
  profile: UserProfile;
}

export interface ActionPropsUserSuccess {
  profile: UserProfile | null;
  message?: string;
}

export interface ActionPropsUserError {
  message: string;
}

export const userActions = {
  reset: createAction(UserAction.Reset),
  resetSuccess: createAction(UserAction.LoadUserSuccess, props<ActionPropsUserSuccess>()),
  tesetError: createAction(UserAction.LoadUserError, props<ActionPropsUserError>()),
  loadUser: createAction(UserAction.LoadUser),
  loadUserSuccess: createAction(UserAction.LoadUserSuccess, props<ActionPropsUserSuccess>()),
  loadUserError: createAction(UserAction.LoadUserError, props<ActionPropsUserError>()),
  updateUser: createAction(UserAction.UpdateUser, props<ActionPropsUser>()),
  updateUserSuccess: createAction(UserAction.UpdateUserSuccess, props<ActionPropsUserSuccess>()),
  updateUserError: createAction(UserAction.UpdateUserError, props<ActionPropsUserError>()),
};
