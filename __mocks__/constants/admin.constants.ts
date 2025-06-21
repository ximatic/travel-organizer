import { AdminUser } from '../../src/app/admin/models/admin-user.model';
import { AdminEvent, AdminEventMessage, AdminEventName, AdminEventType } from '../../src/app/admin/store/admin.store';

import {
  MOCK_EMAIL_1,
  MOCK_EMAIL_2,
  MOCK_FIRSTNAME_1,
  MOCK_FIRSTNAME_2,
  MOCK_LASTNAME_1,
  MOCK_LASTNAME_2,
} from './auth.constants';
import { MOCK_USER_ID_1, MOCK_USER_ID_2, MOCK_USER_ROLE_1, MOCK_USER_ROLE_2 } from './common.constants';

// admin user

export const MOCK_ADMIN_USER_1: AdminUser = {
  id: MOCK_USER_ID_1,
  email: MOCK_EMAIL_1,
  firstname: MOCK_FIRSTNAME_1,
  lastname: MOCK_LASTNAME_1,
  role: MOCK_USER_ROLE_1,
};

export const MOCK_ADMIN_USER_2: AdminUser = {
  id: MOCK_USER_ID_2,
  email: MOCK_EMAIL_2,
  firstname: MOCK_FIRSTNAME_2,
  lastname: MOCK_LASTNAME_2,
  role: MOCK_USER_ROLE_2,
};

// store events

export const MOCK_ADMIN_EVENT_LOAD_ALL_PROCESSING: AdminEvent = {
  name: AdminEventName.LoadAll,
  type: AdminEventType.Processing,
};

export const MOCK_ADMIN_EVENT_LOAD_ALL_SUCCESS: AdminEvent = {
  name: AdminEventName.LoadAll,
  type: AdminEventType.Success,
};

export const MOCK_ADMIN_EVENT_LOAD_ALL_ERROR: AdminEvent = {
  name: AdminEventName.LoadAll,
  type: AdminEventType.Error,
  message: AdminEventMessage.LOAD_USERS_ERROR,
};

export const MOCK_ADMIN_EVENT_LOAD_USER_PROCESSING: AdminEvent = {
  name: AdminEventName.Load,
  type: AdminEventType.Processing,
};

export const MOCK_ADMIN_EVENT_LOAD_USER_SUCCESS: AdminEvent = {
  name: AdminEventName.Load,
  type: AdminEventType.Success,
  user: MOCK_ADMIN_USER_1,
};

export const MOCK_ADMIN_EVENT_LOAD_USER_ERROR: AdminEvent = {
  name: AdminEventName.Load,
  type: AdminEventType.Error,
  message: AdminEventMessage.LOAD_USER_ERROR,
};

export const MOCK_ADMIN_EVENT_CREATE_USER_PROCESSING: AdminEvent = {
  name: AdminEventName.Create,
  type: AdminEventType.Processing,
};

export const MOCK_ADMIN_EVENT_CREATE_USER_SUCCESS: AdminEvent = {
  name: AdminEventName.Create,
  type: AdminEventType.Success,
  message: AdminEventMessage.CREATE_USER_SUCCESS,
  user: MOCK_ADMIN_USER_1,
};

export const MOCK_ADMIN_EVENT_CREATE_USER_ERROR: AdminEvent = {
  name: AdminEventName.Create,
  type: AdminEventType.Error,
  message: AdminEventMessage.CREATE_USER_ERROR,
};

export const MOCK_ADMIN_EVENT_UPDATE_USER_PROCESSING: AdminEvent = {
  name: AdminEventName.Update,
  type: AdminEventType.Processing,
};

export const MOCK_ADMIN_EVENT_UPDATE_USER_SUCCESS: AdminEvent = {
  name: AdminEventName.Update,
  type: AdminEventType.Success,
  message: AdminEventMessage.UPDATE_USER_SUCCESS,
  user: MOCK_ADMIN_USER_1,
};

export const MOCK_ADMIN_EVENT_UPDATE_USER_ERROR: AdminEvent = {
  name: AdminEventName.Update,
  type: AdminEventType.Error,
  message: AdminEventMessage.UPDATE_USER_ERROR,
};

export const MOCK_ADMIN_EVENT_DELETE_USER_SUCCESS: AdminEvent = {
  name: AdminEventName.Delete,
  type: AdminEventType.Success,
  message: AdminEventMessage.DELETE_USER_SUCCESS,
  user: MOCK_ADMIN_USER_1,
};

export const MOCK_ADMIN_EVENT_DELETE_USER_ERROR: AdminEvent = {
  name: AdminEventName.Delete,
  type: AdminEventType.Error,
  message: AdminEventMessage.DELETE_USER_ERROR,
  user: MOCK_ADMIN_USER_1,
};
