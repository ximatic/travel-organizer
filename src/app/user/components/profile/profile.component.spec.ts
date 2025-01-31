/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';
import { MOCK_INITIAL_USER_STATE } from '../../../../../__mocks__/constants/user.constants';
import { MOCK_USER_PROFILE_1 } from '../../../../../__mocks__/constants/user-profile.constants';

import { messageServiceMock } from '../../../../../__mocks__/services.mocks';

import { UserAction } from '../../store/user.actions';
import { selectUserProfile, selectUserEvent } from '../../store/user.selectors';
import { UserEventName, UserEventType } from '../../store/user.state';

import { ProfileComponent } from './profile.component';
import { UserEventMessage } from '../../models/user.model';
import { DEFAULT_EMAIL_1, DEFAULT_PASSWORD_1 } from '../../../../../__mocks__/constants/auth.constants';

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
        provideMockStore({ initialState: MOCK_INITIAL_USER_STATE }),
        MessageService,
      ],
    }).compileComponents();
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });

    store = TestBed.inject(MockStore);
    messageService = TestBed.inject(MessageService);

    mockProfileSelector = store.overrideSelector(selectUserProfile, null);
    mockUserEvent = store.overrideSelector(selectUserEvent, {
      name: UserEventName.LoadUserInfo,
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
      email: DEFAULT_EMAIL_1,
      ...MOCK_USER_PROFILE_1,
      password: DEFAULT_PASSWORD_1,
      passwordRepeat: DEFAULT_PASSWORD_1,
    });

    expect(component.profileForm.valid).toBeTruthy();
    component.submitForm();
    expect(component.isSubmitInProgress).toBeTruthy();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: UserAction.UpdateUserProfile,
      userProfile: {
        email: DEFAULT_EMAIL_1,
        ...MOCK_USER_PROFILE_1,
        password: DEFAULT_PASSWORD_1,
        passwordRepeat: DEFAULT_PASSWORD_1,
      },
    });
  }));

  it('receiving profile via selector works', () => {
    fixture.detectChanges();

    mockProfileSelector.setResult(MOCK_USER_PROFILE_1);
    store.refreshState();

    expect(component.profileForm.getRawValue()).toEqual({
      email: '',
      ...MOCK_USER_PROFILE_1,
      password: '',
      passwordRepeat: '',
    });
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
      name: UserEventName.UpdateUserProfile,
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
      name: UserEventName.UpdateUserProfile,
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
