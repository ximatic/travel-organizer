import { UserProfile } from './user-profile.model';
import { UserSettings } from './user-settings.model';

export enum UserEventMessage {
  LOAD_USER_INFO_SUCCESS = 'LOAD_USER_INFO_SUCCESS',
  LOAD_USER_INFO_ERROR = 'LOAD_USER_INFO_ERROR',
  // UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS',
  // UPDATE_USER_ERROR = 'UPDATE_USER_ERROR',
  // UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS',
  // UPDATE_USER_PROFILE_ERROR = 'UPDATE_USER_PROFILE_ERROR',
  UPDATE_USER_DATA_SUCCESS = 'UPDATE_USER_DATA_SUCCESS',
  UPDATE_USER_DATA_ERROR = 'UPDATE_USER_DATE_ERROR',
  UPDATE_USER_PASSWORD_SUCCESS = 'UPDATE_USER_PASSWORD_SUCCESS',
  UPDATE_USER_PASSWORD_ERROR = 'UPDATE_USER_PASSWORD_ERROR',
  UPDATE_USER_SETTINGS_SUCCESS = 'UPDATE_USER_SETTINGS_SUCCESS',
  UPDATE_USER_SETTINGS_ERROR = 'UPDATE_USER_SETTINGS_ERROR',
}

export interface UserInfo {
  email: string;
  profile: UserProfile;
  settings: UserSettings;
}

export interface UserData {
  email: string | null;
  profile: UserProfile | null;
}

export interface UserPassword {
  currentPassword?: string;
  password?: string;
  passwordRepeat?: string;
}
