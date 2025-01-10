import { DEFAULT_SETTINGS } from '../../settings/constants/settings.constants';
import { SettingsTheme } from '../../settings/models/settings.model';

import { SettingsEventName, SettingsEventType, SettingsState } from '../../settings/store/settings.state';

// settings id mocks

export const DEFAULT_MOCK_SETTINGS_ID_0 = 'test-settings-0';

// settings mocks

export const DEFAULT_MOCK_SETTINGS_0 = {
  _id: DEFAULT_MOCK_SETTINGS_ID_0,
  ...DEFAULT_SETTINGS,
};

export const DEFAULT_MOCK_SETTINGS_1 = {
  ...DEFAULT_SETTINGS,
};

export const DEFAULT_MOCK_SETTINGS_2 = {
  ...DEFAULT_SETTINGS,
  theme: SettingsTheme.Dark,
};

// settings events mock

export const DEFAULT_MOCK_SETTINGS_EVENT_LOAD_LOADING = {
  name: SettingsEventName.Load,
  type: SettingsEventType.Loading,
};

export const DEFAULT_MOCK_SETTINGS_EVENT_LOAD_SUCCESS = {
  name: SettingsEventName.Load,
  type: SettingsEventType.Success,
};

export const DEFAULT_MOCK_SETTINGS_EVENT_UPDATE_SUCCESS = {
  name: SettingsEventName.Update,
  type: SettingsEventType.Success,
};

// store mocks

export const DEFAULT_INITIAL_SETTINGS_STATE: SettingsState = {
  settings: DEFAULT_MOCK_SETTINGS_1,
};
