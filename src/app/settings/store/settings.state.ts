import { Settings } from '../models/settings.model';

export enum SettiongsActionName {
  LoadSettings = 'load-settings',
  UpdateSettings = 'update-settings',
}

export enum SettingsActionType {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export interface SettingsActionState {
  name: SettiongsActionName;
  type: SettingsActionType;
  message?: string;
}

export interface SettingsState {
  settings: Settings;
  actionState?: SettingsActionState;
}
