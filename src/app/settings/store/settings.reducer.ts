import { createReducer, on } from '@ngrx/store';

import { settingsActions } from './settings.actions';
import { SettingsEventType, SettingsState, SettingsEventName } from './settings.state';

import { DEFAULT_SETTINGS } from '../constants/settings.constants';

export const initialState: SettingsState = {
  settings: DEFAULT_SETTINGS,
};

export const settingsReducer = createReducer(
  initialState,
  on(settingsActions.reset, () => initialState),
  // load settings
  on(settingsActions.loadSettings, (state: SettingsState) => ({
    ...state,
    event: {
      name: SettingsEventName.Load,
      type: SettingsEventType.Loading,
    },
  })),
  on(settingsActions.loadSettingsSuccess, (state: SettingsState, { settings }) => ({
    ...state,
    settings,
    event: {
      name: SettingsEventName.Load,
      type: SettingsEventType.Success,
    },
  })),
  on(settingsActions.loadSettingsError, (state: SettingsState, { message }) => ({
    ...state,
    event: {
      name: SettingsEventName.Load,
      type: SettingsEventType.Error,
      message,
    },
  })),
  // update settings
  on(settingsActions.updateSettingsSuccess, (state: SettingsState, { settings, message }) => ({
    ...state,
    settings,
    event: {
      name: SettingsEventName.Update,
      type: SettingsEventType.Success,
      message,
    },
  })),
  on(settingsActions.updateSettingsError, (state: SettingsState, { message }) => ({
    ...state,
    event: {
      name: SettingsEventName.Update,
      type: SettingsEventType.Error,
      message,
    },
  })),
);
