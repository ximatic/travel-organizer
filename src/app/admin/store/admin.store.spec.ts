/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';

import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';

import { of } from 'rxjs';

import {
  MOCK_ADMIN__EVENT_LOAD_ALL_ERROR,
  MOCK_ADMIN__EVENT_LOAD_ALL_SUCCESS,
  MOCK_ADMIN_USER_1,
  MOCK_ADMIN_USER_2,
} from '../../../../__mocks__/constants/admin.constants';

import { AdminServiceMock } from '../../../../__mocks__/services/admin.service.mocks';

import { AdminService } from '../services/admin.service';

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

  it('should be able to load users', () => {
    const spyLoadUsers = jest.spyOn(service, 'loadUsers').mockReturnValueOnce(of([MOCK_ADMIN_USER_1, MOCK_ADMIN_USER_2]));

    store.loadUsers();

    expect(store.users()).toEqual([MOCK_ADMIN_USER_1, MOCK_ADMIN_USER_2]);
    expect(store.event()).toEqual(MOCK_ADMIN__EVENT_LOAD_ALL_SUCCESS);

    expect(store.usersCount()).toEqual(2);

    expect(spyLoadUsers).toHaveBeenCalled();
  });

  it('should be able to handle load trips error', () => {
    const spyLoadUsers = jest.spyOn(service, 'loadUsers').mockImplementation(() => {
      throw new Error();
    });

    store.loadUsers();

    expect(store.users()).toEqual(null);
    expect(store.event()).toEqual(MOCK_ADMIN__EVENT_LOAD_ALL_ERROR);

    expect(store.usersCount()).toEqual(0);

    expect(spyLoadUsers).toHaveBeenCalled();
  });
});
