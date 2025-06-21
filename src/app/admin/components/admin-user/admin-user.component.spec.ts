/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MessageService } from 'primeng/api';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';
import {
  MOCK_ADMIN_EVENT_CREATE_USER_ERROR,
  MOCK_ADMIN_EVENT_CREATE_USER_PROCESSING,
  MOCK_ADMIN_EVENT_CREATE_USER_SUCCESS,
  MOCK_ADMIN_EVENT_LOAD_USER_ERROR,
  MOCK_ADMIN_EVENT_LOAD_USER_PROCESSING,
  MOCK_ADMIN_EVENT_LOAD_USER_SUCCESS,
  MOCK_ADMIN_EVENT_UPDATE_USER_ERROR,
  MOCK_ADMIN_EVENT_UPDATE_USER_PROCESSING,
  MOCK_ADMIN_EVENT_UPDATE_USER_SUCCESS,
  MOCK_ADMIN_USER_1,
} from '../../../../../__mocks__/constants/admin.constants';
import { MOCK_USER_PASSWORD_1 } from '../../../../../__mocks__/constants/user-profile.constants';
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

  describe('existing user scenario', () => {
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
              params: of({ id: MOCK_ADMIN_USER_1.id }),
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
      expect(spyLoadUser).toHaveBeenCalledWith(MOCK_ADMIN_USER_1.id);
    });

    it('validating form works', () => {
      fixture.detectChanges();

      const spyFormValidation = jest.spyOn(component.userForm, 'updateValueAndValidity');

      component.validateForm();
      expect(spyFormValidation).toHaveBeenCalled();
    });

    // creating user

    it('submitUser does not work with empty form', () => {
      const spyUpdateUser = jest.spyOn(store, 'updateUser');

      fixture.detectChanges();

      expect(component.userForm.invalid).toBeTruthy();
      expect(component.submitUser()).toBeUndefined();
      expect(component.isSubmitInProgress()).toBeFalsy();

      expect(spyUpdateUser).toHaveBeenCalledTimes(0);
    });

    it('submitUser works', fakeAsync(() => {
      const spyUpdateUser = jest.spyOn(store, 'updateUser');

      store.event.set(MOCK_ADMIN_EVENT_LOAD_USER_SUCCESS);

      fixture.detectChanges();

      expect(component.userForm.invalid).toBeFalsy();
      component.submitUser();
      expect(component.isSubmitInProgress()).toBeTruthy();

      // artificial delay as in component
      tick(DEFAULT_UX_DELAY);

      expect(spyUpdateUser).toHaveBeenCalled();
    }));

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

    it('handling Admin Event (Update User - Processing) works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      store.event.set(MOCK_ADMIN_EVENT_UPDATE_USER_PROCESSING);

      fixture.detectChanges();

      expect(component.isSubmitInProgress()).toBeTruthy();
      expect(messageAddSpy).toHaveBeenCalledTimes(0);
    });

    it('handling Admin Event (Update User - Success) works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      store.event.set(MOCK_ADMIN_EVENT_UPDATE_USER_SUCCESS);

      fixture.detectChanges();

      expect(component.isSubmitInProgress()).toBeFalsy();
      expect(messageAddSpy).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'EVENT.TYPE.SUCCESS',
        detail: `EVENT.MESSAGE.${AdminEventMessage.UPDATE_USER_SUCCESS}`,
        key: 'toast',
        life: 3000,
      });
    });

    it('handling Admin Event (Update User - Error) works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      store.event.set(MOCK_ADMIN_EVENT_UPDATE_USER_ERROR);

      fixture.detectChanges();

      expect(component.isSubmitInProgress()).toBeFalsy();
      expect(messageAddSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'EVENT.TYPE.ERROR',
        detail: `EVENT.MESSAGE.${AdminEventMessage.UPDATE_USER_ERROR}`,
        key: 'toast',
        life: 3000,
      });
    });
  });

  describe('with new user scenario', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AdminUserComponent],
        providers: [provideRouter([]), provideNoopAnimations(), provideTranslateService(), MessageService, AdminStore],
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

    it('no user is requested for admin user works', () => {
      const spyLoadUser = jest.spyOn(store, 'loadUser');

      fixture.detectChanges();

      expect(component.isLoading()).toBeFalsy();
      expect(spyLoadUser).toHaveBeenCalledTimes(0);
    });

    // creating user

    it('submitUser does not work with empty form', () => {
      const spyCreateUser = jest.spyOn(store, 'createUser');

      fixture.detectChanges();

      expect(component.userForm.invalid).toBeTruthy();
      expect(component.submitUser()).toBeUndefined();
      expect(component.isSubmitInProgress()).toBeFalsy();

      expect(spyCreateUser).toHaveBeenCalledTimes(0);
    });

    it('submitUser works', fakeAsync(() => {
      const spyCreateUser = jest.spyOn(store, 'createUser');

      fixture.detectChanges();

      component.userForm.patchValue({
        ...MOCK_ADMIN_USER_1,
        password: MOCK_USER_PASSWORD_1,
        passwordRepeat: MOCK_USER_PASSWORD_1,
      });

      expect(component.userForm.invalid).toBeFalsy();
      component.submitUser();
      expect(component.isSubmitInProgress()).toBeTruthy();

      // artificial delay as in component
      tick(DEFAULT_UX_DELAY);

      expect(spyCreateUser).toHaveBeenCalled();
    }));

    // admin event

    it('handling Admin Event (Create User - Processing) works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      store.event.set(MOCK_ADMIN_EVENT_CREATE_USER_PROCESSING);

      fixture.detectChanges();

      expect(component.isSubmitInProgress()).toBeTruthy();
      expect(messageAddSpy).toHaveBeenCalledTimes(0);
    });

    it('handling Admin Event (Create User - Success) works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      store.event.set(MOCK_ADMIN_EVENT_CREATE_USER_SUCCESS);

      fixture.detectChanges();

      expect(component.isSubmitInProgress()).toBeFalsy();
      expect(messageAddSpy).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'EVENT.TYPE.SUCCESS',
        detail: `EVENT.MESSAGE.${AdminEventMessage.CREATE_USER_SUCCESS}`,
        key: 'toast',
        life: 3000,
      });
    });

    it('handling Admin Event (Create User - Error) works', () => {
      const messageAddSpy = jest.spyOn(messageService, 'add');

      store.event.set(MOCK_ADMIN_EVENT_CREATE_USER_ERROR);

      fixture.detectChanges();

      expect(component.isSubmitInProgress()).toBeFalsy();
      expect(messageAddSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'EVENT.TYPE.ERROR',
        detail: `EVENT.MESSAGE.${AdminEventMessage.CREATE_USER_ERROR}`,
        key: 'toast',
        life: 3000,
      });
    });
  });
});
