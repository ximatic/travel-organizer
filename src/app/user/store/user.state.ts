import { UserProfile } from '../models/user-profile.model';
import { UserSettings } from '../models/user-settings.model';

export enum UserEventName {
  Reset = 'reset-user',
  //UpdateUser = 'update-user',
  LoadUserInfo = 'load-user-info',
  //UpdateUserProfile = 'update-user-profile',
  UpdateUserData = 'update-user-data',
  UpdateUserPassword = 'update-user-password',
  UpdateUserSettings = 'update-user-settings',
}

export enum UserEventType {
  Processing = 'processing',
  Success = 'success',
  Error = 'error',
}

export interface UserEvent {
  name: UserEventName;
  type: UserEventType;
  message?: string;
}

export interface UserState {
  email: string | null;
  profile: UserProfile | null;
  settings: UserSettings | null;
  event?: UserEvent;
}
