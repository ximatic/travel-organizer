/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';
import {
  DEFAULT_INITIAL_SETTINGS_STATE,
  DEFAULT_MOCK_SETTINGS_1,
  DEFAULT_MOCK_SETTINGS_2,
} from '../../../common/mocks/settings.constants';

import { messageServiceMock, translateServiceMock } from '../../../common/mocks/services.mocks';

import { SettingsAction } from '../../store/settings.actions';
import { selectSettings, selectSettingsEvent } from '../../store/settings.selectors';
import { SettingsEventName, SettingsEventType } from '../../store/settings.state';

import { SettingsComponent } from './settings.component';
import { SettingsEventMessage } from '../../models/settings.model';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let translateService: TranslateService;
  let messageService: MessageService;
  let store: MockStore;

  let mockSettingsSelector: any;
  let mockSettingsEvent: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        provideNoopAnimations(),
        provideTranslateService(),
        provideMockStore({ initialState: DEFAULT_INITIAL_SETTINGS_STATE }),
        TranslateService,
        MessageService,
      ],
    }).compileComponents();
    TestBed.overrideProvider(TranslateService, { useValue: translateServiceMock });
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });

    store = TestBed.inject(MockStore);
    translateService = TestBed.inject(TranslateService);
    messageService = TestBed.inject(MessageService);

    mockSettingsSelector = store.overrideSelector(selectSettings, DEFAULT_MOCK_SETTINGS_1);
    mockSettingsEvent = store.overrideSelector(selectSettingsEvent, {
      name: SettingsEventName.Load,
      type: SettingsEventType.Success,
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

  it('updating settings without changes works', fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.settingsForm.valid).toBeTruthy();
    component.submitSettings();
    expect(component.isSubmitInProgress).toBeTruthy();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: SettingsAction.UpdateSettings,
      settings: DEFAULT_MOCK_SETTINGS_1,
    });
  }));

  it('receiving Settings via selector works', () => {
    const useSpy = jest.spyOn(translateService, 'use');

    fixture.detectChanges();

    mockSettingsSelector.setResult(DEFAULT_MOCK_SETTINGS_2);
    store.refreshState();

    expect(component.settings).toEqual(DEFAULT_MOCK_SETTINGS_2);
    expect(useSpy).toHaveBeenLastCalledWith(DEFAULT_MOCK_SETTINGS_2.language);
  });

  // toast testing

  it('toast is not visible after receiving empty Settings Action State', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockSettingsEvent.setResult(null);

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('toast is visible after receiving Settings Action State with Load Settings Error', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockSettingsEvent.setResult({
      name: SettingsEventName.Load,
      type: SettingsEventType.Error,
      message: SettingsEventMessage.LOAD_SETTINGS_ERROR,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${SettingsEventMessage.LOAD_SETTINGS_ERROR}`,
      key: 'toast',
      life: 3000,
    });
  });

  it('toast is visible after receiving Settings Action State with Update Settings Error', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockSettingsEvent.setResult({
      name: SettingsEventName.Update,
      type: SettingsEventType.Error,
      message: SettingsEventMessage.UPDATE_SETTINGS_ERROR,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'EVENT.TYPE.ERROR',
      detail: `EVENT.MESSAGE.${SettingsEventMessage.UPDATE_SETTINGS_ERROR}`,
      key: 'toast',
      life: 3000,
    });
  });

  it('toast is visible after receiving Settings Action State with Update Settings Success', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockSettingsEvent.setResult({
      name: SettingsEventName.Update,
      type: SettingsEventType.Success,
      message: SettingsEventMessage.UPDATE_SETTINGS_SUCCESS,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'EVENT.TYPE.SUCCESS',
      detail: `EVENT.MESSAGE.${SettingsEventMessage.UPDATE_SETTINGS_SUCCESS}`,
      key: 'toast',
      life: 3000,
    });
  });
});
