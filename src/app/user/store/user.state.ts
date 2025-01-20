import { UserProfile } from '../models/user.model';

export enum UserEventName {
  Reset = 'reset-user',
  Load = 'load-user',
  Update = 'update-user',
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
  profile: UserProfile | null;
  event?: UserEvent;
}
