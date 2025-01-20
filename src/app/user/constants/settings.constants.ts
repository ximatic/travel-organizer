import { Settings, SettingsLanguage, SettingsDateFormat, SettingsTimeFormat, SettingsTheme } from '../models/user.model';

export const DEFAULT_LANGUAGE = SettingsLanguage.English;
export const DEFAULT_DATE_FORMAT = SettingsDateFormat.DMY;
export const DEFAULT_TIME_FORMAT = SettingsTimeFormat.H24;
export const DEFAULT_THEME = SettingsTheme.Light;

export const DEFAULT_SETTINGS: Settings = {
  language: DEFAULT_LANGUAGE,
  dateFormat: DEFAULT_DATE_FORMAT,
  timeFormat: DEFAULT_TIME_FORMAT,
  theme: DEFAULT_THEME,
};
