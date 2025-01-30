// user settings

export enum UserSettingsLanguage {
  English = 'en',
  Polish = 'pl',
}

export enum UserSettingsDateFormat {
  YMD = 'dd.MM.yyyy',
  DMY = 'yyyy.MM.dd',
}

export enum UserSettingsTimeFormat {
  H12 = '12h',
  H24 = '24h',
}

export enum UserSettingsTheme {
  Light = 'light',
  Dark = 'dark',
}

export interface UserSettings {
  language: UserSettingsLanguage;
  dateFormat: UserSettingsDateFormat;
  timeFormat: UserSettingsTimeFormat;
  theme: UserSettingsTheme;
}
