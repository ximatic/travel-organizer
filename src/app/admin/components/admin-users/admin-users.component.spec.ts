/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import {
  MOCK_ADMIN_EVENT_LOAD_ALL_ERROR,
  MOCK_ADMIN_EVENT_LOAD_ALL_SUCCESS,
  MOCK_ADMIN_EVENT_LOAD_ALL_PROCESSING,
  MOCK_ADMIN_EVENT_DELETE_USER_ERROR,
  MOCK_ADMIN_EVENT_DELETE_USER_SUCCESS,
  MOCK_ADMIN_USER_1,
} from '../../../../../__mocks__/constants/admin.constants';
import { MOCK_USER_ROLE_1, MOCK_USER_ROLE_2 } from '../../../../../__mocks__/constants/common.constants';
import { messageServiceMock } from '../../../../../__mocks__/services.mocks';
import { AdminStoreMock } from '../../../../../__mocks__/stores/admin.store.mock';

import { AdminEventMessage, AdminStore } from '../../store/admin.store';

import { AdminUsersComponent } from './admin-users.component';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;

  let router: Router;
  let messageService: MessageService;
  let store: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsersComponent],
      providers: [provideRouter([]), provideNoopAnimations(), provideTranslateService(), MessageService, AdminStore],
    }).compileComponents();
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });
    TestBed.overrideProvider(AdminStore, { useValue: AdminStoreMock });

    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);
    store = TestBed.inject(AdminStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('requesting for admin users works', () => {
    const spyLoadUsers = jest.spyOn(store, 'loadUsers');

    fixture.detectChanges();

    expect(component.isLoading()).toBeTruthy();
    expect(spyLoadUsers).toHaveBeenCalled();
  });

  // user handling

  it('deleting admin user works', () => {
    const event = new MouseEvent('mouseclick');
    const spyStopPropagation = jest.spyOn(event, 'stopPropagation');

    fixture.detectChanges();

    component.deleteAdminUser(event, MOCK_ADMIN_USER_1);

    expect(spyStopPropagation).toHaveBeenCalled();
    // TODO - improve when code for user deletion will be finalized
  });

  it('get User role severity works', () => {
    fixture.detectChanges();

    expect(component.getRoleSeverity(MOCK_USER_ROLE_1)).toEqual('info');
  });

  it('get Admin role severity works', () => {
    fixture.detectChanges();

    expect(component.getRoleSeverity(MOCK_USER_ROLE_2)).toEqual('success');
  });

  // admin event

  it('handling Admin Event with null content works', () => {
    const spyAdd = jest.spyOn(messageService, 'add');

    store.event.set(null);

    fixture.detectChanges();

    expect(component.isLoading()).toBeTruthy();
    expect(spyAdd).toHaveBeenCalledTimes(0);
  });

  it('handling Admin Event (Load All - Processing) works', () => {
    const spyAdd = jest.spyOn(messageService, 'add');

    store.event.set(MOCK_ADMIN_EVENT_LOAD_ALL_PROCESSING);

    fixture.detectChanges();

    expect(component.isLoading()).toBeTruthy();
    expect(spyAdd).toHaveBeenCalledTimes(0);
  });

  it('handling Admin Event (Load All - Success) works', () => {
    const spyAdd = jest.spyOn(messageService, 'add');

    store.event.set(MOCK_ADMIN_EVENT_LOAD_ALL_SUCCESS);

    fixture.detectChanges();

    expect(component.isLoading()).toBeFalsy();
    expect(spyAdd).toHaveBeenCalledTimes(0);
  });

  it('handling Admin Event (Load All - Error) works', () => {
    const spyAdd = jest.spyOn(messageService, 'add');

    store.event.set(MOCK_ADMIN_EVENT_LOAD_ALL_ERROR);

    fixture.detectChanges();

    expect(component.isLoading()).toBeFalsy();
    expect(spyAdd).toHaveBeenLastCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${AdminEventMessage.LOAD_USERS_ERROR}`,
      key: 'toast',
      life: 3000,
    });
  });

  it('handling Admin Event (Delete User - Success) works', () => {
    const spyAdd = jest.spyOn(messageService, 'add');

    store.event.set(MOCK_ADMIN_EVENT_DELETE_USER_SUCCESS);

    fixture.detectChanges();

    expect(spyAdd).toHaveBeenLastCalledWith({
      severity: 'success',
      summary: 'EVENT.TYPE.SUCCESS',
      detail: `EVENT.MESSAGE.${AdminEventMessage.DELETE_USER_SUCCESS}`,
      key: 'toast',
      life: 3000,
    });
  });

  it('handling Admin Event (Delete User - Error) works', () => {
    const spyAdd = jest.spyOn(messageService, 'add');

    store.event.set(MOCK_ADMIN_EVENT_DELETE_USER_ERROR);

    fixture.detectChanges();

    expect(spyAdd).toHaveBeenLastCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${AdminEventMessage.DELETE_USER_ERROR}`,
      key: 'toast',
      life: 3000,
    });
  });
});
