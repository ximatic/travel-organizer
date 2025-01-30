import { DEFAULT_USER_SETTINGS } from '../src/app/user/constants/settings.constants';

import { UserSettings, UserSettingsTheme } from '../src/app/user/models/user-settings.model';
import { UserEvent, UserEventName, UserEventType } from '../src/app/user/store/user.state';

// user settings mocks

export const MOCK_USER_SETTINGS_1: UserSettings = {
  ...DEFAULT_USER_SETTINGS,
};

export const MOCK_USER_SETTINGS_2: UserSettings = {
  ...DEFAULT_USER_SETTINGS,
  theme: UserSettingsTheme.Dark,
};

// user events mock

export const MOCK_USER_EVENT_UPDATE_USER_SETTINGS_PROCESSING: UserEvent = {
  name: UserEventName.UpdateUserSettings,
  type: UserEventType.Processing,
};

export const MOCK_USER_EVENT_UPDATE_USER_SETTINGS_SUCCESS: UserEvent = {
  name: UserEventName.UpdateUserSettings,
  type: UserEventType.Success,
};

export const MOCK_USER_EVENT_UPDATE_USER_SETTINGS_ERROR: UserEvent = {
  name: UserEventName.UpdateUserSettings,
  type: UserEventType.Error,
};
