import { DEFAULT_FIRSTNAME_1, DEFAULT_FIRSTNAME_2, DEFAULT_LASTNAME_1, DEFAULT_LASTNAME_2 } from './auth.constants';

import { UserProfile } from '../../src/app/user/models/user-profile.model';
import { UserEvent, UserEventName, UserEventType } from '../../src/app/user/store/user.state';

// user profile mocks

export const MOCK_USER_PROFILE_1: UserProfile = {
  firstname: DEFAULT_FIRSTNAME_1,
  lastname: DEFAULT_LASTNAME_1,
};

export const MOCK_USER_PROFILE_2: UserProfile = {
  firstname: DEFAULT_FIRSTNAME_2,
  lastname: DEFAULT_LASTNAME_2,
};

// user events mock

export const MOCK_USER_EVENT_UPDATE_USER_PROFILE_PROCESSING: UserEvent = {
  name: UserEventName.UpdateUserProfile,
  type: UserEventType.Processing,
};

export const MOCK_USER_EVENT_UPDATE_USER_PROFILE_SUCCESS: UserEvent = {
  name: UserEventName.UpdateUserProfile,
  type: UserEventType.Success,
};

export const MOCK_USER_EVENT_UPDATE_USER_PROFILE_ERROR: UserEvent = {
  name: UserEventName.UpdateUserProfile,
  type: UserEventType.Error,
};
