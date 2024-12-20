import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SettingsState } from './settings.state';

export const selectSettingsState = createFeatureSelector<SettingsState>('settings');

export const selectSettingsActionState = createSelector(selectSettingsState, (state: SettingsState) => state.actionState);

export const selectSettings = createSelector(selectSettingsState, (state: SettingsState) => state.settings);

// TODO - use it in MainComponent instead selectSettings
export const selectSettingsTheme = createSelector(selectSettingsState, (state: SettingsState) => state.settings.theme);

// TODO - use it or remove?
export const SettingsSelectors = {
  state: selectSettingsState,
  actionState: selectSettingsActionState,
  settings: selectSettings,
};
