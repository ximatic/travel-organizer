import { UserEvent, UserEventName, UserEventType, UserState } from '../../user/store/user.state';

import { UserProfile } from '../../user/models/user.model';

import { DEFAULT_EMAIL_1, DEFAULT_FIRSTNAME_1, DEFAULT_LASTNAME_1 } from './auth.constants';

// user profile mocks

export const DEFAULT_USER_PROFILE_1: UserProfile = {
  email: DEFAULT_EMAIL_1,
  firstname: DEFAULT_FIRSTNAME_1,
  lastname: DEFAULT_LASTNAME_1,
  password: '',
  passwordRepeat: '',
};

export const DEFAULT_USER_PROFILE_2: UserProfile = {
  email: DEFAULT_EMAIL_1,
  firstname: DEFAULT_FIRSTNAME_1,
  lastname: DEFAULT_LASTNAME_1,
};

// state

export const DEFAULT_INITIAL_USER_STATE: UserState = {
  profile: null,
};

// settings events mock

export const DEFAULT_MOCK_USER_EVENT_LOAD_PROCESSING: UserEvent = {
  name: UserEventName.Load,
  type: UserEventType.Processing,
};

export const DEFAULT_MOCK_USER_EVENT_LOAD_SUCCESS: UserEvent = {
  name: UserEventName.Load,
  type: UserEventType.Success,
};

export const DEFAULT_MOCK_USER_EVENT_LOAD_ERROR: UserEvent = {
  name: UserEventName.Load,
  type: UserEventType.Error,
};

export const DEFAULT_MOCK_USER_EVENT_UPDATE_PROCESSING: UserEvent = {
  name: UserEventName.Update,
  type: UserEventType.Processing,
};

export const DEFAULT_MOCK_USER_EVENT_UPDATE_SUCCESS: UserEvent = {
  name: UserEventName.Update,
  type: UserEventType.Success,
};

export const DEFAULT_MOCK_USER_EVENT_UPDATE_ERROR: UserEvent = {
  name: UserEventName.Update,
  type: UserEventType.Error,
};
