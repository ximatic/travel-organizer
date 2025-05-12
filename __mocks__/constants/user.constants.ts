import { UserInfo } from '../../src/app/user/models/user.model';
import { UserEvent, UserEventName, UserEventType, UserState } from '../../src/app/user/store/user.state';

import { MOCK_EMAIL_1, MOCK_EMAIL_2 } from './auth.constants';
import { MOCK_USER_PROFILE_1, MOCK_USER_PROFILE_2 } from './user-profile.constants';
import { MOCK_USER_SETTINGS_1, MOCK_USER_SETTINGS_2 } from './user-settings.constants';

// user info mocks

export const MOCK_USER_INFO_1: UserInfo = {
  email: MOCK_EMAIL_1,
  profile: MOCK_USER_PROFILE_1,
  settings: MOCK_USER_SETTINGS_1,
};

export const MOCK_USER_INFO_2: UserInfo = {
  email: MOCK_EMAIL_2,
  profile: MOCK_USER_PROFILE_2,
  settings: MOCK_USER_SETTINGS_2,
};

// store mocks

export const MOCK_INITIAL_USER_STATE: UserState = {
  email: null,
  role: null,
  profile: null,
  settings: null,
};

export const MOCK_INITIAL_USER_STATE_1: UserState = {
  email: MOCK_EMAIL_1,
  role: null,
  profile: MOCK_USER_PROFILE_1,
  settings: MOCK_USER_SETTINGS_1,
};

// user events mock

export const MOCK_USER_EVENT_LOAD_USER_INFO_PROCESSING: UserEvent = {
  name: UserEventName.LoadUserInfo,
  type: UserEventType.Processing,
};

export const MOCK_USER_EVENT_LOAD_USER_INFO_SUCCESS: UserEvent = {
  name: UserEventName.LoadUserInfo,
  type: UserEventType.Success,
};

export const MOCK_USER_EVENT_LOAD_USER_INFO_ERROR: UserEvent = {
  name: UserEventName.LoadUserInfo,
  type: UserEventType.Error,
};
