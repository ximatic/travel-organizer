import { AuthToken } from '../../src/app/auth/model/auth.model';
import { AuthEventName, AuthEventType } from '../../src/app/auth/store/auth.state';

// login && signup mocks

export const DEFAULT_EMAIL_1 = 'email-1@example.com';
export const DEFAULT_EMAIL_2 = 'email-2@example.com';

export const DEFAULT_PASSWORD_1 = 'P@ssword1';
export const DEFAULT_PASSWORD_2 = 'P@ssword2';

export const DEFAULT_FIRSTNAME_1 = 'Test Firstname #1';
export const DEFAULT_FIRSTNAME_2 = 'Test Firstname #2';

export const DEFAULT_LASTNAME_1 = 'Test Lastname #1';
export const DEFAULT_LASTNAME_2 = 'Test Lastname #2';

// auth token mocks

export const DEFAULT_AUTH_TOKEN_1: AuthToken = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Nzg3OWMxM2ZjZDgzNDQ4MzY0MDMzOGYiLCJlbWFpbCI6ImVtYWlsQHRlc3QuY29tIiwiaWF0IjoxNzM3MDMyNTU1LCJleHAiOjE3MzcxMTg5NTV9.hFSb21wA_QnULC3iuYA9iS2z5PcPDBsVp0pLXfUl36M',
};

export const DEFAULT_AUTH_TOKEN_2: AuthToken = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Nzg4MmQ1MWI3YTdmYzE0NzU3ZTdmNWYiLCJlbWFpbCI6ImVtYWlsLTJAdGVzdC5jb20iLCJpYXQiOjE3MzY5Nzc3NDUsImV4cCI6MTczNzA2NDE0NX0.WTq4UCitLUftCAin35gUAtjH4t36B5R4VbTvwtfxFy0',
};

// state

export const DEFAULT_INITIAL_AUTH_STATE = {
  authToken: null,
};

// settings events mock

export const DEFAULT_MOCK_AUTH_EVENT_LOGIN_LOADING = {
  name: AuthEventName.Login,
  type: AuthEventType.Loading,
};

export const DEFAULT_MOCK_AUTH_EVENT_LOGIN_SUCCESS = {
  name: AuthEventName.Login,
  type: AuthEventType.Success,
};

export const DEFAULT_MOCK_AUTH_EVENT_LOGIN_ERROR = {
  name: AuthEventName.Login,
  type: AuthEventType.Error,
};

export const DEFAULT_MOCK_AUTH_EVENT_LOGOUT_LOADING = {
  name: AuthEventName.Logout,
  type: AuthEventType.Loading,
};

export const DEFAULT_MOCK_AUTH_EVENT_LOGOUT_SUCCESS = {
  name: AuthEventName.Logout,
  type: AuthEventType.Success,
};

export const DEFAULT_MOCK_AUTH_EVENT_LOGOUT_ERROR = {
  name: AuthEventName.Logout,
  type: AuthEventType.Error,
};

export const DEFAULT_MOCK_AUTH_EVENT_SIGNUP_LOADING = {
  name: AuthEventName.Signup,
  type: AuthEventType.Loading,
};

export const DEFAULT_MOCK_AUTH_EVENT_SIGNUP_SUCCESS = {
  name: AuthEventName.Signup,
  type: AuthEventType.Success,
};

export const DEFAULT_MOCK_AUTH_EVENT_SIGNUP_ERROR = {
  name: AuthEventName.Signup,
  type: AuthEventType.Error,
};
