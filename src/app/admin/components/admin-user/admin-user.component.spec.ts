/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MessageService } from 'primeng/api';

import {
  MOCK_ADMIN_EVENT_LOAD_USER_ERROR,
  MOCK_ADMIN_EVENT_LOAD_USER_PROCESSING,
  MOCK_ADMIN_EVENT_LOAD_USER_SUCCESS,
  MOCK_ADMIN_USER_1,
} from '../../../../../__mocks__/constants/admin.constants';
import { MOCK_USER_ROLE_1, MOCK_USER_ROLE_2 } from '../../../../../__mocks__/constants/common.constants';
import { messageServiceMock } from '../../../../../__mocks__/services.mocks';
import { AdminStoreMock } from '../../../../../__mocks__/stores/admin.store.mock';

import { AdminEventMessage, AdminStore } from '../../store/admin.store';

import { AdminUserComponent } from './admin-user.component';

describe('AdminUserComponent', () => {
  let component: AdminUserComponent;
  let fixture: ComponentFixture<AdminUserComponent>;

  let router: Router;
  let messageService: MessageService;
  let store: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideTranslateService(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: MOCK_ADMIN_USER_1._id }),
          },
        },
        MessageService,
        AdminStore,
      ],
    }).compileComponents();
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });
    TestBed.overrideProvider(AdminStore, { useValue: AdminStoreMock });

    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);
    store = TestBed.inject(AdminStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('requesting for admin user works', () => {
    const spyLoadUser = jest.spyOn(store, 'loadUser');

    fixture.detectChanges();

    expect(component.isLoading()).toBeTruthy();
    expect(spyLoadUser).toHaveBeenCalledWith(MOCK_ADMIN_USER_1._id);
  });

  it('validating form works', () => {
    fixture.detectChanges();

    const spyFormValidation = jest.spyOn(component.userForm, 'updateValueAndValidity');

    component.validateForm();
    expect(spyFormValidation).toHaveBeenCalled();
  });

  it("submitForm doesn't work for an empty form", () => {
    const spyUpdateUser = jest.spyOn(store, 'updateUser');

    fixture.detectChanges();

    expect(component.userForm.invalid).toBeTruthy();
    expect(component.submitUser()).toBeUndefined();
    expect(spyUpdateUser).toHaveBeenCalledTimes(0);
  });

  // admin event

  it('handling Admin Event with null content works', () => {
    const spyAdd = jest.spyOn(messageService, 'add');

    store.event.set(null);

    fixture.detectChanges();

    expect(component.isLoading()).toBeTruthy();
    expect(spyAdd).toHaveBeenCalledTimes(0);
  });

  it('handling Admin Event (Load User - Processing) works', () => {
    const spyAdd = jest.spyOn(messageService, 'add');

    store.event.set(MOCK_ADMIN_EVENT_LOAD_USER_PROCESSING);

    fixture.detectChanges();

    expect(component.isLoading()).toBeTruthy();
    expect(spyAdd).toHaveBeenCalledTimes(0);
  });

  it('handling Admin Event (Load User - Success) works', () => {
    const spyAdd = jest.spyOn(messageService, 'add');

    store.event.set(MOCK_ADMIN_EVENT_LOAD_USER_SUCCESS);

    fixture.detectChanges();

    expect(component.isLoading()).toBeFalsy();
    expect(component.user()).toEqual(MOCK_ADMIN_EVENT_LOAD_USER_SUCCESS.user);
    expect(spyAdd).toHaveBeenCalledTimes(0);
  });

  it('handling Admin Event (Load User - Error) works', () => {
    const spyAdd = jest.spyOn(messageService, 'add');

    store.event.set(MOCK_ADMIN_EVENT_LOAD_USER_ERROR);

    fixture.detectChanges();

    expect(component.isLoading()).toBeFalsy();
    expect(spyAdd).toHaveBeenLastCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${AdminEventMessage.LOAD_USER_ERROR}`,
      key: 'toast',
      life: 3000,
    });
  });
});
