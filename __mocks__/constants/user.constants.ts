import { UserEvent, UserEventName, UserEventType, UserState } from '../../src/app/user/store/user.state';

import { DEFAULT_EMAIL_1 } from './auth.constants';
import { MOCK_USER_PROFILE_1 } from './user-profile.constants';
import { MOCK_USER_SETTINGS_1 } from './user-settings.constants';

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

// store mocks

export const MOCK_INITIAL_USER_STATE: UserState = {
  email: null,
  profile: null,
  settings: null,
};

export const MOCK_INITIAL_USER_STATE_1: UserState = {
  email: DEFAULT_EMAIL_1,
  profile: MOCK_USER_PROFILE_1,
  settings: MOCK_USER_SETTINGS_1,
};
