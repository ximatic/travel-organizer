/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';

import { MessageService } from 'primeng/api';

import {
  DEFAULT_INITIAL_SETTINGS_STATE,
  DEFAULT_MOCK_SETTINGS_1,
  DEFAULT_MOCK_SETTINGS_2,
} from '../../../common/mocks/settings.constants';

import { SettingsAction } from '../../store/settings.actions';
import { selectSettings, selectSettingsActionState } from '../../store/settings.selectors';
import { SettiongsActionName, SettingsActionType } from '../../store/settings.state';

import { SettingsComponent } from './settings.component';

const messageServiceMock: { add: jest.Mock; messageObserver: Observable<any>; clearObserver: Observable<any> } = {
  add: jest.fn(),
  messageObserver: of(null),
  clearObserver: of(null),
};

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let messageService: MessageService;
  let store: MockStore;

  let mockSettingsSelector: any;
  let mockActionStateSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [provideNoopAnimations(), provideMockStore({ initialState: DEFAULT_INITIAL_SETTINGS_STATE }), MessageService],
    }).compileComponents();
    TestBed.overrideProvider(MessageService, { useValue: messageServiceMock });

    store = TestBed.inject(MockStore);
    messageService = TestBed.inject(MessageService);

    mockSettingsSelector = store.overrideSelector(selectSettings, DEFAULT_MOCK_SETTINGS_1);
    mockActionStateSelector = store.overrideSelector(selectSettingsActionState, {
      name: SettiongsActionName.LoadSettings,
      type: SettingsActionType.Success,
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

  it('requesting for settings works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith({ type: SettingsAction.LoadSettings });
  });

  it('updating settings without changes works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.settingsForm.valid).toBeTruthy();
    component.submitSettings();
    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: SettingsAction.UpdateSettings,
      settings: DEFAULT_MOCK_SETTINGS_1,
    });
  });

  it('receiving Settings via selector works', () => {
    fixture.detectChanges();

    mockSettingsSelector.setResult(DEFAULT_MOCK_SETTINGS_2);
    store.refreshState();

    expect(component.settings).toEqual(DEFAULT_MOCK_SETTINGS_2);
  });

  // toast testing

  it('toast is not visible after receiving empty Settings Action State', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockActionStateSelector.setResult(null);

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledTimes(0);
  });

  it('toast is visible after receiving Settings Action State with Load Setting Error', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockActionStateSelector.setResult({
      name: SettiongsActionName.LoadSettings,
      type: SettingsActionType.Error,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: undefined,
      key: 'toast',
      life: 3000,
    });
  });

  it('toast is visible after receiving Settings Action State with Update Setting Error', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockActionStateSelector.setResult({
      name: SettiongsActionName.UpdateSettings,
      type: SettingsActionType.Error,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: undefined,
      key: 'toast',
      life: 3000,
    });
  });

  it('toast is visible after receiving Settings Action State with Load Setting Success', () => {
    const messageAddSpy = jest.spyOn(messageService, 'add');

    fixture.detectChanges();

    mockActionStateSelector.setResult({
      name: SettiongsActionName.UpdateSettings,
      type: SettingsActionType.Success,
    });

    store.refreshState();

    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: undefined,
      key: 'toast',
      life: 3000,
    });
  });
});
