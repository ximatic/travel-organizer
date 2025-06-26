/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';

import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';

import { of, throwError } from 'rxjs';

import {
  MOCK_ADMIN_EVENT_CREATE_USER_ERROR,
  MOCK_ADMIN_EVENT_CREATE_USER_SUCCESS,
  MOCK_ADMIN_EVENT_DELETE_USER_ERROR,
  MOCK_ADMIN_EVENT_DELETE_USER_SUCCESS,
  MOCK_ADMIN_EVENT_LOAD_ALL_ERROR,
  MOCK_ADMIN_EVENT_LOAD_ALL_SUCCESS,
  MOCK_ADMIN_EVENT_LOAD_USER_ERROR,
  MOCK_ADMIN_EVENT_LOAD_USER_SUCCESS,
  MOCK_ADMIN_EVENT_UPDATE_USER_ERROR,
  MOCK_ADMIN_EVENT_UPDATE_USER_SUCCESS,
  MOCK_ADMIN_USER_1,
  MOCK_ADMIN_USER_2,
} from '../../../../__mocks__/constants/admin.constants';
import { MOCK_USER_ID_1 } from '../../../../__mocks__/constants/common.constants';

import { MOCK_PASSWORD_1 } from '../../../../__mocks__/constants/auth.constants';
import { AdminServiceMock } from '../../../../__mocks__/services/admin.service.mocks';

import { AdminService } from '../services/admin.service';

import { CreateAdminUserPayload, UpdateAdminUserPayload } from '../models/admin-user.model';

import { AdminStore } from './admin.store';

describe('AdminStore', () => {
  let service: AdminService;
  let store: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AdminService, useValue: AdminServiceMock }, AdminStore],
    });

    service = TestBed.inject(AdminService);
    store = TestBed.inject(AdminStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  // initial state

  it('should have initial state', () => {
    expect(store.users()).toEqual(null);
    expect(store.event()).toEqual(null);

    expect(store.usersCount()).toEqual(0);
  });

  // updated state

  it('should be able to update its state', () => {
    patchState(unprotected(store), { users: [MOCK_ADMIN_USER_1, MOCK_ADMIN_USER_2] });

    expect(store.users()).toEqual([MOCK_ADMIN_USER_1, MOCK_ADMIN_USER_2]);
    expect(store.event()).toEqual(null);

    expect(store.usersCount()).toEqual(2);
  });

  // methods

  // load users

  it('should be able to load users', () => {
    const spyLoadUsers = jest.spyOn(service, 'loadUsers').mockReturnValueOnce(of([MOCK_ADMIN_USER_1, MOCK_ADMIN_USER_2]));

    store.loadUsers();

    expect(store.users()).toEqual([MOCK_ADMIN_USER_1, MOCK_ADMIN_USER_2]);
    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_LOAD_ALL_SUCCESS);

    expect(store.usersCount()).toEqual(2);

    expect(spyLoadUsers).toHaveBeenCalled();
  });

  it('should be able to handle load users error', () => {
    const spyLoadUsers = jest.spyOn(service, 'loadUsers').mockImplementation(() => {
      throw new Error();
    });

    store.loadUsers();

    expect(store.users()).toEqual(null);
    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_LOAD_ALL_ERROR);

    expect(store.usersCount()).toEqual(0);

    expect(spyLoadUsers).toHaveBeenCalled();
  });

  // load user

  it('should be able to load user', () => {
    const spyLoadUser = jest.spyOn(service, 'loadUser').mockReturnValueOnce(of(MOCK_ADMIN_USER_1));

    store.loadUser();

    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_LOAD_USER_SUCCESS);

    expect(spyLoadUser).toHaveBeenCalled();
  });

  it('should be able to handle load user error', () => {
    const spyLoadUser = jest.spyOn(service, 'loadUser').mockImplementation(() => {
      throw new Error();
    });

    store.loadUser();

    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_LOAD_USER_ERROR);

    expect(spyLoadUser).toHaveBeenCalled();
  });

  // create user

  it('should be able to create user', () => {
    const spyCreateUser = jest.spyOn(service, 'createUser').mockReturnValueOnce(of(MOCK_ADMIN_USER_1));

    const payload: CreateAdminUserPayload = {
      ...MOCK_ADMIN_USER_1,
      password: MOCK_PASSWORD_1,
      passwordRepeat: MOCK_PASSWORD_1,
    };
    store.createUser(payload);

    expect(store.users()).toEqual([MOCK_ADMIN_USER_1]);
    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_CREATE_USER_SUCCESS);

    expect(store.usersCount()).toEqual(1);

    expect(spyCreateUser).toHaveBeenCalled();
  });

  it('should be able to handle create user error', () => {
    const spyCreateUser = jest.spyOn(service, 'createUser').mockReturnValueOnce(
      throwError(() => {
        new Error();
      }),
    );

    const payload: CreateAdminUserPayload = {
      ...MOCK_ADMIN_USER_1,
      password: MOCK_PASSWORD_1,
      passwordRepeat: MOCK_PASSWORD_1,
    };
    store.createUser(payload);

    expect(store.users()).toEqual(null);
    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_CREATE_USER_ERROR);

    expect(store.usersCount()).toEqual(0);

    expect(spyCreateUser).toHaveBeenCalled();
  });

  // update user

  it('should be able to update user', () => {
    const updatedUser = { ...MOCK_ADMIN_USER_1, firstname: MOCK_ADMIN_USER_2.firstname };
    const spyUpdateUser = jest.spyOn(service, 'updateUser').mockReturnValueOnce(of(updatedUser));
    patchState(unprotected(store), { users: [MOCK_ADMIN_USER_1] });

    const payload: UpdateAdminUserPayload = {
      id: MOCK_USER_ID_1,
      firstname: MOCK_ADMIN_USER_2.firstname,
    };
    store.updateUser(payload);

    expect(store.users()).toEqual([updatedUser]);
    expect(store.event()).toEqual({ ...MOCK_ADMIN_EVENT_UPDATE_USER_SUCCESS, user: updatedUser });

    expect(store.usersCount()).toEqual(1);

    expect(spyUpdateUser).toHaveBeenCalled();
  });

  it('should be able to handle update user error', () => {
    const spyUpdateUser = jest.spyOn(service, 'updateUser').mockReturnValueOnce(
      throwError(() => {
        new Error();
      }),
    );

    const payload: UpdateAdminUserPayload = {
      id: MOCK_USER_ID_1,
      firstname: MOCK_ADMIN_USER_1.firstname,
    };
    store.updateUser(payload);

    expect(store.users()).toEqual(null);
    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_UPDATE_USER_ERROR);

    expect(store.usersCount()).toEqual(0);

    expect(spyUpdateUser).toHaveBeenCalled();
  });

  it('should not be able to update user when users list is empty', () => {
    const spyUpdateUser = jest.spyOn(service, 'updateUser').mockReturnValueOnce(of(MOCK_ADMIN_USER_1));

    const payload: UpdateAdminUserPayload = {
      id: MOCK_USER_ID_1,
    };
    store.updateUser(payload);

    expect(store.users()).toEqual([]);
    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_UPDATE_USER_SUCCESS);

    expect(store.usersCount()).toEqual(0);

    expect(spyUpdateUser).toHaveBeenCalled();
  });

  it('should not be able to update user when user is not on the users list', () => {
    const spyUpdateUser = jest.spyOn(service, 'updateUser').mockReturnValueOnce(of(MOCK_ADMIN_USER_1));
    patchState(unprotected(store), { users: [MOCK_ADMIN_USER_2] });

    const payload: UpdateAdminUserPayload = {
      id: MOCK_USER_ID_1,
    };
    store.updateUser(payload);

    expect(store.users()).toEqual([MOCK_ADMIN_USER_2]);
    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_UPDATE_USER_SUCCESS);

    expect(store.usersCount()).toEqual(1);

    expect(spyUpdateUser).toHaveBeenCalled();
  });

  // delete user

  it('should be able to delete user', () => {
    const spyUpdateUser = jest.spyOn(service, 'deleteUser').mockReturnValueOnce(of({}));
    patchState(unprotected(store), { users: [MOCK_ADMIN_USER_1] });

    store.deleteUser(MOCK_ADMIN_USER_1.id);

    expect(store.users()).toEqual([]);
    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_DELETE_USER_SUCCESS);

    expect(store.usersCount()).toEqual(0);

    expect(spyUpdateUser).toHaveBeenCalled();
  });

  it('should be able to handle delete user error', () => {
    const spyUpdateUser = jest.spyOn(service, 'deleteUser').mockReturnValueOnce(
      throwError(() => {
        new Error();
      }),
    );

    store.deleteUser(MOCK_ADMIN_USER_1.id);

    expect(store.users()).toEqual(null);
    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_DELETE_USER_ERROR);

    expect(store.usersCount()).toEqual(0);

    expect(spyUpdateUser).toHaveBeenCalled();
  });

  it('should not be able to delete user which is not on the list', () => {
    const spyUpdateUser = jest.spyOn(service, 'deleteUser').mockReturnValueOnce(of({}));
    patchState(unprotected(store), { users: [MOCK_ADMIN_USER_2] });

    store.deleteUser(MOCK_ADMIN_USER_1.id);

    expect(store.users()).toEqual([MOCK_ADMIN_USER_2]);
    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_DELETE_USER_SUCCESS);

    expect(store.usersCount()).toEqual(1);

    expect(spyUpdateUser).toHaveBeenCalled();
  });

  it('should not be able to delete user when list is empty', () => {
    const spyUpdateUser = jest.spyOn(service, 'deleteUser').mockReturnValueOnce(of({}));

    store.deleteUser(MOCK_ADMIN_USER_1.id);

    expect(store.users()).toEqual([]);
    expect(store.event()).toEqual(MOCK_ADMIN_EVENT_DELETE_USER_SUCCESS);

    expect(store.usersCount()).toEqual(0);

    expect(spyUpdateUser).toHaveBeenCalled();
  });
});
