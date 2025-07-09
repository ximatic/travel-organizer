/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';
import { MOCK_INITIAL_USER_STATE } from '../../../../../__mocks__/constants/user.constants';
import { MOCK_USER_DATA_1, MOCK_USER_PASSWORD_1 } from '../../../../../__mocks__/constants/user-profile.constants';

import { messageServiceMock } from '../../../../../__mocks__/services.mocks';

import { UserAction } from '../../store/user.actions';
import { selectUserEvent, selectUserData } from '../../store/user.selectors';
import { UserEventName, UserEventType } from '../../store/user.state';

import { ProfileComponent } from './profile.component';
import { UserEventMessage } from '../../models/user.model';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let messageService: MessageService;
  let store: MockStore;

  let mockUserDataSelector: any;
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

    mockUserDataSelector = store.overrideSelector(selectUserData, null);
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

  // user data

  it('user data form is invalid with empty email', () => {
    fixture.detectChanges();

    component.profileForm.patchValue({
      email: '',
    });

    expect(component.profileForm.invalid).toBeTruthy();
    expect(component.submitProfileForm()).toBeUndefined();
  });

  it('updating user data works', fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.profileForm.patchValue({
      email: MOCK_USER_DATA_1.email,
      firstname: MOCK_USER_DATA_1.profile?.firstname,
      lastname: MOCK_USER_DATA_1.profile?.lastname,
    });

    fixture.detectChanges();

    expect(component.profileForm.valid).toBeTruthy();
    component.submitProfileForm();
    expect(component.isSubmitInProgress()).toBeTruthy();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: UserAction.UpdateUserData,
      userData: {
        ...MOCK_USER_DATA_1,
      },
    });
  }));

  it('receiving user data via selector works', () => {
    fixture.detectChanges();

    mockUserDataSelector.setResult(MOCK_USER_DATA_1);
    store.refreshState();

    expect(component.profileForm.getRawValue()).toEqual({
      email: MOCK_USER_DATA_1.email,
      firstname: MOCK_USER_DATA_1.profile?.firstname,
      lastname: MOCK_USER_DATA_1.profile?.lastname,
    });
  });

  // user password

  it('user password form is invalid with empty current password', () => {
    fixture.detectChanges();

    component.passwordForm.patchValue({
      currentPassword: '',
    });

    expect(component.passwordForm.invalid).toBeTruthy();
    expect(component.submitPasswordForm()).toBeUndefined();
  });

  it('updating user password works', fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.passwordForm.patchValue({
      ...MOCK_USER_PASSWORD_1,
    });

    fixture.detectChanges();

    expect(component.passwordForm.valid).toBeTruthy();
    component.submitPasswordForm();
    expect(component.isSubmitInProgress()).toBeTruthy();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: UserAction.UpdateUserPassword,
      userPassword: {
        ...MOCK_USER_PASSWORD_1,
      },
    });
  }));

  // toast testing

  it('toast is not visible after receiving empty User Action State', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockUserEvent.setResult(null);

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('toast is visible after receiving User Action State with Update User Data Error', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockUserEvent.setResult({
      name: UserEventName.UpdateUserData,
      type: UserEventType.Error,
      message: UserEventMessage.UPDATE_USER_DATA_ERROR,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${UserEventMessage.UPDATE_USER_DATA_ERROR}`,
      key: 'main-toast',
      life: 3000,
    });
  });

  it('toast is visible after receiving User Action State with Update User Data Success', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockUserEvent.setResult({
      name: UserEventName.UpdateUserData,
      type: UserEventType.Success,
      message: UserEventMessage.UPDATE_USER_DATA_SUCCESS,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'EVENT.TYPE.SUCCESS',
      detail: `EVENT.MESSAGE.${UserEventMessage.UPDATE_USER_DATA_SUCCESS}`,
      key: 'main-toast',
      life: 3000,
    });
  });

  it('toast is visible after receiving User Action State with Update User Password Error', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockUserEvent.setResult({
      name: UserEventName.UpdateUserPassword,
      type: UserEventType.Error,
      message: UserEventMessage.UPDATE_USER_PASSWORD_ERROR,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${UserEventMessage.UPDATE_USER_PASSWORD_ERROR}`,
      key: 'main-toast',
      life: 3000,
    });
  });

  it('toast is visible after receiving User Action State with Update User Password Success', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockUserEvent.setResult({
      name: UserEventName.UpdateUserPassword,
      type: UserEventType.Success,
      message: UserEventMessage.UPDATE_USER_PASSWORD_SUCCESS,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'EVENT.TYPE.SUCCESS',
      detail: `EVENT.MESSAGE.${UserEventMessage.UPDATE_USER_PASSWORD_SUCCESS}`,
      key: 'main-toast',
      life: 3000,
    });
  });
});
