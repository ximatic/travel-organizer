import { createAction, props } from '@ngrx/store';

import { Settings } from '../models/settings.model';

export enum SettingsAction {
  Reset = '[SettingsAPI] Reset',
  LoadSettings = '[SettingsAPI] Settings Load',
  LoadSettingsSuccess = '[SettingsAPI] Settings Load Success',
  LoadSettingsError = '[SettingsAPI] Settings Load Error',
  UpdateSettings = '[SettingsAPI] Settings Update',
  UpdateSettingsSuccess = '[SettingsAPI] Settings Update Success',
  UpdateSettingsError = '[SettingsAPI] Settings Update Error',
}

export interface ActionPropsSettings {
  settings: Settings;
}

export interface ActionPropsSettingsSuccess {
  settings: Settings;
  message: string;
}

export interface ActionPropsSettingsError {
  error: string;
}

export const settingsActions = {
  reset: createAction(SettingsAction.Reset),
  loadSettings: createAction(SettingsAction.LoadSettings),
  loadSettingsSuccess: createAction(SettingsAction.LoadSettingsSuccess, props<ActionPropsSettingsSuccess>()),
  loadSettingsError: createAction(SettingsAction.LoadSettingsError, props<ActionPropsSettingsError>()),
  updateSettings: createAction(SettingsAction.UpdateSettings, props<ActionPropsSettings>()),
  updateSettingsSuccess: createAction(SettingsAction.UpdateSettingsSuccess, props<ActionPropsSettingsSuccess>()),
  updateSettingsError: createAction(SettingsAction.UpdateSettingsError, props<ActionPropsSettingsError>()),
};
