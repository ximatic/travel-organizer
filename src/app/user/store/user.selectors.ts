import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserState } from './user.state';

import { UserData } from '../models/user.model';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserEvent = createSelector(selectUserState, (state: UserState) => state.event);

export const selectUserEmail = createSelector(selectUserState, (state: UserState) => state.email);

export const selectUserProfile = createSelector(selectUserState, (state: UserState) => state.profile);

export const selectUserData = createSelector(selectUserState, (state: UserState) => {
  if (!state.email || !state.profile) {
    return null;
  }

  return {
    email: state.email,
    profile: state.profile,
  } as UserData;
});

export const selectUserSettings = createSelector(selectUserState, (state: UserState) => state.settings);

// TODO - use it or remove?
export const UserSelectors = {
  state: selectUserProfile,
  email: selectUserEmail,
  profile: selectUserProfile,
  settings: selectUserSettings,
  event: selectUserEvent,
};
