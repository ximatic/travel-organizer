export enum UserEventMessage {
  LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS',
  LOAD_USER_ERROR = 'LOAD_USER_ERROR',
  UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS',
  UPDATE_USER_ERROR = 'UPDATE_USER_ERROR',
}

// user profile

export interface UserProfile {
  _id?: string;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
  passwordRepeat?: string;
}
