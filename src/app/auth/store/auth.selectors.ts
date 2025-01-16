import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthEvent = createSelector(selectAuthState, (state: AuthState) => state.event);

export const selectAuthToken = createSelector(selectAuthState, (state: AuthState) => state.authToken);

// TODO - use it or remove?
export const AuthSelectors = {
  state: selectAuthState,
  event: selectAuthEvent,
  authToken: selectAuthToken,
};
