export enum AuthEventMessage {
  LOGIN_ERROR = 'LOGIN_ERROR',
  LOGOUT_ERROR = 'LOGOUT_ERROR',
  VERIFY_ERROR = 'VERIFY_ERROR',
  SIGNUP_ERROR = 'SIGNUP_ERROR',
}

// request payload

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  passwordRepeat: string;
  firstname: string;
  lastname: string;
}

// response

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
}
