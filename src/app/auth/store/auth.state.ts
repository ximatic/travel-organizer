import { AuthToken } from '../model/auth.model';

export enum AuthEventName {
  Login = 'login',
  Logout = 'logout',
  Verify = 'verify',
  Refresh = 'refresh',
  Signup = 'signup',
}

export enum AuthEventType {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export interface AuthEvent {
  name: AuthEventName;
  type: AuthEventType;
  message?: string;
}

export interface AuthState {
  authToken: AuthToken | null;
  event?: AuthEvent;
}
