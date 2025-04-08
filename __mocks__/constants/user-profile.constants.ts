import {
  MOCK_EMAIL_1,
  MOCK_EMAIL_2,
  MOCK_FIRSTNAME_1,
  MOCK_FIRSTNAME_2,
  MOCK_LASTNAME_1,
  MOCK_LASTNAME_2,
} from './auth.constants';

import { UserEvent, UserEventName, UserEventType } from '../../src/app/user/store/user.state';

import { UserProfile } from '../../src/app/user/models/user-profile.model';
import { UserData, UserPassword } from '../../src/app/user/models/user.model';

// user profile mocks

export const MOCK_USER_PROFILE_1: UserProfile = {
  firstname: MOCK_FIRSTNAME_1,
  lastname: MOCK_LASTNAME_1,
};

export const MOCK_USER_PROFILE_2: UserProfile = {
  firstname: MOCK_FIRSTNAME_2,
  lastname: MOCK_LASTNAME_2,
};

// user data mocks

export const MOCK_USER_DATA_1: UserData = {
  email: MOCK_EMAIL_1,
  profile: MOCK_USER_PROFILE_1,
};

export const MOCK_USER_DATA_2: UserData = {
  email: MOCK_EMAIL_2,
  profile: MOCK_USER_PROFILE_2,
};

export const MOCK_USER_PASSWORD_1: UserPassword = {
  currentPassword: 'test-current-password-1',
  password: 'test-new-password-1',
  passwordRepeat: 'test-new-password-1',
};

// user events mock

export const MOCK_USER_EVENT_UPDATE_USER_DATA_PROCESSING: UserEvent = {
  name: UserEventName.UpdateUserData,
  type: UserEventType.Processing,
};

export const MOCK_USER_EVENT_UPDATE_USER_DATA_SUCCESS: UserEvent = {
  name: UserEventName.UpdateUserData,
  type: UserEventType.Success,
};

export const MOCK_USER_EVENT_UPDATE_USER_DATA_ERROR: UserEvent = {
  name: UserEventName.UpdateUserData,
  type: UserEventType.Error,
};
