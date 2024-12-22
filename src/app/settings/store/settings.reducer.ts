import { createReducer, on } from '@ngrx/store';

import { settingsActions } from './settings.actions';
import { SettingsActionType, SettingsState, SettiongsActionName } from './settings.state';

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
    actionState: {
      name: SettiongsActionName.LoadSettings,
      type: SettingsActionType.Loading,
    },
  })),
  on(settingsActions.loadSettingsSuccess, (state: SettingsState, { settings }) => ({
    ...state,
    settings,
    actionState: {
      name: SettiongsActionName.LoadSettings,
      type: SettingsActionType.Success,
    },
  })),
  on(settingsActions.loadSettingsError, (state: SettingsState, { message }) => ({
    ...state,
    actionState: {
      name: SettiongsActionName.LoadSettings,
      type: SettingsActionType.Error,
      message,
    },
  })),
  // update settings
  on(settingsActions.updateSettingsSuccess, (state: SettingsState, { settings, message }) => ({
    ...state,
    settings,
    actionState: {
      name: SettiongsActionName.UpdateSettings,
      type: SettingsActionType.Success,
      message,
    },
  })),
  on(settingsActions.updateSettingsError, (state: SettingsState, { message }) => ({
    ...state,
    actionState: {
      name: SettiongsActionName.UpdateSettings,
      type: SettingsActionType.Error,
      message,
    },
  })),
);
