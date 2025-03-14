/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';
import { MOCK_INITIAL_USER_STATE } from '../../../../../__mocks__/constants/user.constants';
import { MOCK_USER_SETTINGS_1, MOCK_USER_SETTINGS_2 } from '../../../../../__mocks__/constants/user-settings.constants';

import { messageServiceMock, translateServiceMock } from '../../../../../__mocks__/services.mocks';

import { UserEventMessage } from '../../models/user.model';
import { selectUserEvent, selectUserSettings } from '../../store/user.selectors';
import { UserAction } from '../../store/user.actions';
import { UserEventName, UserEventType } from '../../store/user.state';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let translateService: TranslateService;
  let messageService: MessageService;
  let store: MockStore;

  let mockUserSettingsSelector: any;
  let mockUserEventSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        provideNoopAnimations(),
        provideTranslateService(),
        provideMockStore({ initialState: MOCK_INITIAL_USER_STATE }),
        TranslateService,
        MessageService,
      ],
    }).compileComponents();
    TestBed.overrideProvider(TranslateService, { useValue: translateServiceMock });
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });

    store = TestBed.inject(MockStore);
    translateService = TestBed.inject(TranslateService);
    messageService = TestBed.inject(MessageService);

    mockUserSettingsSelector = store.overrideSelector(selectUserSettings, MOCK_USER_SETTINGS_1);
    mockUserEventSelector = store.overrideSelector(selectUserEvent, {
      name: UserEventName.LoadUserInfo,
      type: UserEventType.Success,
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('settings form is invalid with empty language', () => {
    fixture.detectChanges();

    component.settingsForm.patchValue({
      language: '',
    });

    expect(component.settingsForm.invalid).toBeTruthy();
    expect(component.submitSettings()).toBeUndefined();
  });

  it('updating User Settings without changes works', fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.settingsForm.valid).toBeTruthy();
    component.submitSettings();
    expect(component.isSubmitInProgress()).toBeTruthy();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: UserAction.UpdateUserSettings,
      userSettings: MOCK_USER_SETTINGS_1,
    });
  }));

  it('receiving User Settings via selector works', () => {
    const useSpy = jest.spyOn(translateService, 'use');

    fixture.detectChanges();

    mockUserSettingsSelector.setResult(MOCK_USER_SETTINGS_2);
    store.refreshState();

    expect(component.settings).toEqual(MOCK_USER_SETTINGS_2);
    expect(useSpy).toHaveBeenLastCalledWith(MOCK_USER_SETTINGS_2.language);
  });

  it('receiving null User Settings via selector does not change anything', () => {
    fixture.detectChanges();

    mockUserSettingsSelector.setResult(null);
    store.refreshState();

    expect(component.settings).toEqual(MOCK_USER_SETTINGS_1);
  });

  // toast testing

  it('toast is not visible after receiving empty Settings Action State', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockUserEventSelector.setResult(null);

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('toast is visible after receiving User event with Update User Settings / Error', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockUserEventSelector.setResult({
      name: UserEventName.UpdateUserSettings,
      type: UserEventType.Error,
      message: UserEventMessage.UPDATE_USER_SETTINGS_ERROR,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${UserEventMessage.UPDATE_USER_SETTINGS_ERROR}`,
      key: 'toast',
      life: 3000,
    });
  });

  it('toast is visible after receiving User event with Update User Settings / Success', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockUserEventSelector.setResult({
      name: UserEventName.UpdateUserSettings,
      type: UserEventType.Success,
      message: UserEventMessage.UPDATE_USER_SETTINGS_SUCCESS,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'EVENT.TYPE.SUCCESS',
      detail: `EVENT.MESSAGE.${UserEventMessage.UPDATE_USER_SETTINGS_SUCCESS}`,
      key: 'toast',
      life: 3000,
    });
  });
});
