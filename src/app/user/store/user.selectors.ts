import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserEvent = createSelector(selectUserState, (state: UserState) => state.event);

export const selectUserProfile = createSelector(selectUserState, (state: UserState) => state.profile);

// TODO - use it or remove?
export const UserSelectors = {
  state: selectUserProfile,
  event: selectUserEvent,
  profile: selectUserProfile,
};
