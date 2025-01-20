/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';
import { DEFAULT_INITIAL_USER_STATE, DEFAULT_USER_PROFILE_1 } from '../../../common/mocks/user.constants';

import { messageServiceMock } from '../../../common/mocks/services.mocks';

import { UserAction } from '../../store/user.actions';
import { selectUserProfile, selectUserEvent } from '../../store/user.selectors';
import { UserEventName, UserEventType } from '../../store/user.state';

import { ProfileComponent } from './profile.component';
import { UserEventMessage } from '../../models/user.model';
import { DEFAULT_PASSWORD_1 } from '../../../common/mocks/auth.constants';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let messageService: MessageService;
  let store: MockStore;

  let mockProfileSelector: any;
  let mockUserEvent: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        provideNoopAnimations(),
        provideTranslateService(),
        provideMockStore({ initialState: DEFAULT_INITIAL_USER_STATE }),
        MessageService,
      ],
    }).compileComponents();
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });

    store = TestBed.inject(MockStore);
    messageService = TestBed.inject(MessageService);

    mockProfileSelector = store.overrideSelector(selectUserProfile, null);
    mockUserEvent = store.overrideSelector(selectUserEvent, {
      name: UserEventName.Load,
      type: UserEventType.Success,
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('user form is invalid with empty email', () => {
    fixture.detectChanges();

    component.profileForm.patchValue({
      email: '',
    });

    expect(component.profileForm.invalid).toBeTruthy();
    expect(component.submitForm()).toBeUndefined();
  });

  it('updating user works', fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.profileForm.patchValue({
      ...DEFAULT_USER_PROFILE_1,
      password: DEFAULT_PASSWORD_1,
      passwordRepeat: DEFAULT_PASSWORD_1,
    });

    expect(component.profileForm.valid).toBeTruthy();
    component.submitForm();
    expect(component.isSubmitInProgress).toBeTruthy();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: UserAction.UpdateUser,
      profile: {
        ...DEFAULT_USER_PROFILE_1,
        password: DEFAULT_PASSWORD_1,
        passwordRepeat: DEFAULT_PASSWORD_1,
      },
    });
  }));

  it('receiving Settings via selector works', () => {
    fixture.detectChanges();

    mockProfileSelector.setResult(DEFAULT_USER_PROFILE_1);
    store.refreshState();

    expect(component.profileForm.getRawValue()).toEqual(DEFAULT_USER_PROFILE_1);
  });

  // toast testing

  it('toast is not visible after receiving empty User Action State', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockUserEvent.setResult(null);

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('toast is visible after receiving User Action State with Update User Error', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockUserEvent.setResult({
      name: UserEventName.Update,
      type: UserEventType.Error,
      message: UserEventMessage.UPDATE_USER_ERROR,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${UserEventMessage.UPDATE_USER_ERROR}`,
      key: 'toast',
      life: 3000,
    });
  });

  it('toast is visible after receiving User Action State with Update User Success', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockUserEvent.setResult({
      name: UserEventName.Update,
      type: UserEventType.Success,
      message: UserEventMessage.UPDATE_USER_SUCCESS,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'EVENT.TYPE.SUCCESS',
      detail: `EVENT.MESSAGE.${UserEventMessage.UPDATE_USER_SUCCESS}`,
      key: 'toast',
      life: 3000,
    });
  });
});
