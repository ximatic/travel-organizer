/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import {
  MOCK_EMAIL_1,
  MOCK_PASSWORD_1,
  MOCK_FIRSTNAME_1,
  MOCK_LASTNAME_1,
  MOCK_INITIAL_AUTH_STATE,
  MOCK_AUTH_EVENT_SIGNUP_LOADING,
} from '../../../../__mocks__/constants/auth.constants';

import { DEFAULT_UX_DELAY } from '../../common/constants/common.constants';

import { AuthAction } from '../store/auth.actions';
import { selectAuthEvent } from '../store/auth.selectors';
import { AuthEventName, AuthEventType } from '../store/auth.state';

import { AuthEventMessage } from '../model/auth.model';

import { messageServiceMock } from '../../../../__mocks__/services.mocks';

import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: Router;
  let store: MockStore;
  let messageService: MessageService;

  let mockAuthEventSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideTranslateService(),
        provideMockStore({ initialState: MOCK_INITIAL_AUTH_STATE }),
        MessageService,
      ],
    }).compileComponents();
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    messageService = TestBed.inject(MessageService);

    mockAuthEventSelector = store.overrideSelector(selectAuthEvent, MOCK_AUTH_EVENT_SIGNUP_LOADING);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('validating form works', () => {
    fixture.detectChanges();
    const formValidationSpy = jest.spyOn(component.signupForm, 'updateValueAndValidity');

    component.validateForm();
    expect(formValidationSpy).toHaveBeenCalled();
  });

  it("submitForm doesn't work for an empty form", () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.signupForm.invalid).toBeTruthy();
    expect(component.submitForm()).toBeUndefined();
    expect(dispatchSpy).toHaveBeenCalledTimes(0);
  });

  it('submitForm works ', fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.signupForm.patchValue({
      email: MOCK_EMAIL_1,
      password: MOCK_PASSWORD_1,
      passwordRepeat: MOCK_PASSWORD_1,
      firstname: MOCK_FIRSTNAME_1,
      lastname: MOCK_LASTNAME_1,
    });

    expect(component.signupForm.invalid).toBeFalsy();
    component.submitForm();
    expect(component.isSubmitInProgress()).toBeTruthy();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: AuthAction.Signup,
      email: MOCK_EMAIL_1,
      password: MOCK_PASSWORD_1,
      passwordRepeat: MOCK_PASSWORD_1,
      firstname: MOCK_FIRSTNAME_1,
      lastname: MOCK_LASTNAME_1,
    });
  }));

  // auth events

  it('handling Auth Event with null content works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockAuthEventSelector.setResult(null);

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('handling Auth with Signup Success works', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockAuthEventSelector.setResult({
      name: AuthEventName.Signup,
      type: AuthEventType.Success,
    });

    store.refreshState();

    expect(component.isSubmitInProgress()).toBeFalsy();
    expect(messageAddSpy).toHaveBeenCalledTimes(0);
    expect(navigateSpy).toHaveBeenCalledWith([`/dashboard`]);
  });

  it('handling Auth Event with Signup Error works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockAuthEventSelector.setResult({
      name: AuthEventName.Signup,
      type: AuthEventType.Error,
      message: AuthEventMessage.SIGNUP_ERROR,
    });

    store.refreshState();

    expect(component.isSubmitInProgress()).toBeFalsy();
    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${AuthEventMessage.SIGNUP_ERROR}`,
      key: 'main-toast',
      life: 3000,
    });
  });
});
