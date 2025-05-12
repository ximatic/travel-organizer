import { AuthToken } from '../../src/app/auth/model/auth.model';
import { AuthEventName, AuthEventType } from '../../src/app/auth/store/auth.state';

// login && signup mocks

export const MOCK_EMAIL_1 = 'email-1@example.com';
export const MOCK_EMAIL_2 = 'email-2@example.com';

export const MOCK_PASSWORD_1 = 'P@ssword1';
export const MOCK_PASSWORD_2 = 'P@ssword2';

export const MOCK_FIRSTNAME_1 = 'Test Firstname #1';
export const MOCK_FIRSTNAME_2 = 'Test Firstname #2';

export const MOCK_LASTNAME_1 = 'Test Lastname #1';
export const MOCK_LASTNAME_2 = 'Test Lastname #2';

// auth token mocks

export const MOCK_AUTH_TOKEN_0: AuthToken = {
  // AuthToken without role
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Nzg3OWMxM2ZjZDgzNDQ4MzY0MDMzOGYiLCJlbWFpbCI6ImVtYWlsQHRlc3QuY29tIiwiaWF0IjoxNzM3MDMyNTU1LCJleHAiOjE3MzcxMTg5NTV9.hFSb21wA_QnULC3iuYA9iS2z5PcPDBsVp0pLXfUl36M',
};

export const MOCK_AUTH_TOKEN_1: AuthToken = {
  // AuthToken with User role
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Nzk3NWYyOWU0OTVmNDllYmU3N2Y0YTQiLCJlbWFpbCI6ImVtYWlsQHRlc3QuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDY3MjY5NTQsImV4cCI6MTc0NjgxMzM1NH0.H_iZoiExVm8XOCSVp7p8t5xJc3glV9FegmRciNUVC-w',
};

export const MOCK_AUTH_TOKEN_2: AuthToken = {
  // AuthToken with Admin role
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2Y5Mjc5ZTc4NDA1YmRlMGUyYmJhNDUiLCJlbWFpbCI6ImVtYWlsMkB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NjcyOTEwMSwiZXhwIjoxNzQ2ODE1NTAxfQ.pt_dS0_IuNZv3yU1K21VBjOu9TT9ZgTA-CYLURXaidY',
};

// state

export const MOCK_INITIAL_AUTH_STATE = {
  authToken: null,
};

// settings events mock

export const MOCK_AUTH_EVENT_LOGIN_LOADING = {
  name: AuthEventName.Login,
  type: AuthEventType.Loading,
};

export const MOCK_AUTH_EVENT_LOGIN_SUCCESS = {
  name: AuthEventName.Login,
  type: AuthEventType.Success,
};

export const MOCK_AUTH_EVENT_LOGIN_ERROR = {
  name: AuthEventName.Login,
  type: AuthEventType.Error,
};

export const MOCK_AUTH_EVENT_LOGOUT_LOADING = {
  name: AuthEventName.Logout,
  type: AuthEventType.Loading,
};

export const MOCK_AUTH_EVENT_LOGOUT_SUCCESS = {
  name: AuthEventName.Logout,
  type: AuthEventType.Success,
};

export const MOCK_AUTH_EVENT_LOGOUT_ERROR = {
  name: AuthEventName.Logout,
  type: AuthEventType.Error,
};

export const MOCK_AUTH_EVENT_SIGNUP_LOADING = {
  name: AuthEventName.Signup,
  type: AuthEventType.Loading,
};

export const MOCK_AUTH_EVENT_SIGNUP_SUCCESS = {
  name: AuthEventName.Signup,
  type: AuthEventType.Success,
};

export const MOCK_AUTH_EVENT_SIGNUP_ERROR = {
  name: AuthEventName.Signup,
  type: AuthEventType.Error,
};
