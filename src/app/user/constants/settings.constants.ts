import {
  UserSettings,
  UserSettingsDateFormat,
  UserSettingsLanguage,
  UserSettingsTheme,
  UserSettingsTimeFormat,
} from '../models/user-settings.model';

export const DEFAULT_USER_LANGUAGE = UserSettingsLanguage.English;
export const DEFAULT_USER_DATE_FORMAT = UserSettingsDateFormat.DMY;
export const DEFAULT_USER_TIME_FORMAT = UserSettingsTimeFormat.H24;
export const DEFAULT_USER_THEME = UserSettingsTheme.Light;

export const DEFAULT_USER_SETTINGS: UserSettings = {
  language: DEFAULT_USER_LANGUAGE,
  dateFormat: DEFAULT_USER_DATE_FORMAT,
  timeFormat: DEFAULT_USER_TIME_FORMAT,
  theme: DEFAULT_USER_THEME,
};
