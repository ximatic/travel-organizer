export enum SettingsEventMessage {
  LOAD_SETTINGS_ERROR = 'LOAD_SETTINGS_ERROR',
  UPDATE_SETTINGS_SUCCESS = 'UPDATE_SETTINGS_SUCCESS',
  UPDATE_SETTINGS_ERROR = 'UPDATE_SETTINGS_ERROR',
}

// settings

export enum SettingsLanguage {
  English = 'en',
  Polish = 'pl',
}

export enum SettingsDateFormat {
  YMD = 'dd.MM.yyyy',
  DMY = 'yyyy.MM.dd',
}

export enum SettingsTimeFormat {
  H12 = '12h',
  H24 = '24h',
}

export enum SettingsTheme {
  Light = 'light',
  Dark = 'dark',
}

export interface Settings {
  _id?: string;
  language: SettingsLanguage;
  dateFormat: SettingsDateFormat;
  timeFormat: SettingsTimeFormat;
  theme: SettingsTheme;
}
