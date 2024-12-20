import { DEFAULT_SETTINGS } from '../../settings/constants/settings.constants';
import { SettingsTheme } from '../../settings/models/settings.model';

import { SettingsState } from '../../settings/store/settings.state';

// settings mocks

export const DEFAULT_MOCK_SETTINGS_1 = {
  ...DEFAULT_SETTINGS,
};

export const DEFAULT_MOCK_SETTINGS_2 = {
  ...DEFAULT_SETTINGS,
  theme: SettingsTheme.Dark,
};

// store mocks

export const DEFAULT_INITIAL_SETTINGS_STATE: SettingsState = {
  settings: DEFAULT_MOCK_SETTINGS_1,
};
