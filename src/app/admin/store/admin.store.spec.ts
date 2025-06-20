/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';

import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';

import { of, throwError } from 'rxjs';

import {
  MOCK_ADMIN_EVENT_CREATE_USER_ERROR,
  MOCK_ADMIN_EVENT_CREATE_USER_SUCCESS,
  MOCK_ADMIN_EVENT_LOAD_ALL_ERROR,
  MOCK_ADMIN_EVENT_LOAD_ALL_SUCCESS,
  MOCK_ADMIN_EVENT_LOAD_USER_ERROR,
  MOCK_ADMIN_EVENT_LOAD_USER_SUCCESS,
  MOCK_ADMIN_USER_1,
  MOCK_ADMIN_USER_2,
} from '../../../../__mocks__/constants/admin.constants';

import { MOCK_PASSWORD_1 } from '../../../../__mocks__/constants/auth.constants';
import { AdminServiceMock } from '../../../../__mocks__/services/admin.service.mocks';

import { AdminService } from '../services/admin.service';

import { CreateAdminUserPayload } from '../models/admin-user.model';

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
});
