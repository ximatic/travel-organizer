/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import {
  DEFAULT_EMAIL_1,
  DEFAULT_PASSWORD_1,
  DEFAULT_INITIAL_AUTH_STATE,
  DEFAULT_MOCK_AUTH_EVENT_LOGIN_LOADING,
} from '../../../../__mocks__/constants/auth.constants';

import { DEFAULT_UX_DELAY } from '../../common/constants/common.constants';

import { AuthAction } from '../store/auth.actions';
import { selectAuthEvent } from '../store/auth.selectors';
import { AuthEventName, AuthEventType } from '../store/auth.state';

import { AuthEventMessage } from '../model/auth.model';

import { messageServiceMock } from '../../../../__mocks__/services.mocks';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let store: MockStore;
  let messageService: MessageService;

  let mockAuthEventSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideTranslateService(),
        provideMockStore({ initialState: DEFAULT_INITIAL_AUTH_STATE }),
        MessageService,
      ],
    }).compileComponents();
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    messageService = TestBed.inject(MessageService);

    mockAuthEventSelector = store.overrideSelector(selectAuthEvent, DEFAULT_MOCK_AUTH_EVENT_LOGIN_LOADING);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it("submitForm doesn't work for an empty form", () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.loginForm.invalid).toBeTruthy();
    expect(component.submitForm()).toBeUndefined();
    expect(dispatchSpy).toHaveBeenCalledTimes(0);
  });

  it('submitForm works ', fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.loginForm.patchValue({ email: DEFAULT_EMAIL_1, password: DEFAULT_PASSWORD_1 });

    expect(component.loginForm.invalid).toBeFalsy();
    component.submitForm();
    expect(component.isSubmitInProgress).toBeTruthy();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: AuthAction.Login,
      email: DEFAULT_EMAIL_1,
      password: DEFAULT_PASSWORD_1,
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

  it('handling Auth with Login Success works', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockAuthEventSelector.setResult({
      name: AuthEventName.Login,
      type: AuthEventType.Success,
    });

    store.refreshState();

    expect(component.isSubmitInProgress).toBeFalsy();
    expect(messageAddSpy).toHaveBeenCalledTimes(0);
    expect(navigateSpy).toHaveBeenCalledWith([`/dashboard`]);
  });

  it('handling Auth Event with Login Error works', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockAuthEventSelector.setResult({
      name: AuthEventName.Login,
      type: AuthEventType.Error,
      message: AuthEventMessage.LOGIN_ERROR,
    });

    store.refreshState();

    expect(component.isSubmitInProgress).toBeFalsy();
    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${AuthEventMessage.LOGIN_ERROR}`,
      key: 'toast',
      life: 3000,
    });
  });
});
