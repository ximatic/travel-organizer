import { Settings } from '../models/settings.model';

export enum SettingsEventName {
  Load = 'load-settings',
  Update = 'update-settings',
}

export enum SettingsEventType {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export interface SettingsEvent {
  name: SettingsEventName;
  type: SettingsEventType;
  message?: string;
}

export interface SettingsState {
  settings: Settings;
  event?: SettingsEvent;
}
