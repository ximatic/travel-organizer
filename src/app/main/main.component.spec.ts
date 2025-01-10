/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';

import {
  DEFAULT_INITIAL_SETTINGS_STATE,
  DEFAULT_MOCK_SETTINGS_1,
  DEFAULT_MOCK_SETTINGS_2,
  DEFAULT_MOCK_SETTINGS_EVENT_LOAD_LOADING,
  DEFAULT_MOCK_SETTINGS_EVENT_LOAD_SUCCESS,
  DEFAULT_MOCK_SETTINGS_EVENT_UPDATE_SUCCESS,
} from '../common/mocks/settings.constants';
import { DEFAULT_UX_DELAY } from '../common/constants/common.constants';

import { DEFAULT_SETTINGS } from '../settings/constants/settings.constants';
import { SettingsLanguage, SettingsTheme } from '../settings/models/settings.model';
import { SettingsAction } from '../settings/store/settings.actions';
import { selectSettings, selectSettingsEvent } from '../settings/store/settings.selectors';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let store: MockStore;

  let mockSettingsSelector: any;
  let mockSettingsEventSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideMockStore({ initialState: DEFAULT_INITIAL_SETTINGS_STATE }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    mockSettingsSelector = store.overrideSelector(selectSettings, DEFAULT_MOCK_SETTINGS_1);
    mockSettingsEventSelector = store.overrideSelector(selectSettingsEvent, DEFAULT_MOCK_SETTINGS_EVENT_LOAD_LOADING);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('initial settings are default', () => {
    expect(component.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('loading settings works for light theme', () => {
    fixture.detectChanges();

    mockSettingsSelector.setResult(DEFAULT_MOCK_SETTINGS_1);

    store.refreshState();

    expect(component.darkMode).toEqual(false);
    expect(component.settings).toEqual(DEFAULT_MOCK_SETTINGS_1);
    expect(document.querySelector('html')?.classList.contains('dark-mode')).toBeFalsy();
  });

  it('loading settings works for dark theme', () => {
    fixture.detectChanges();

    mockSettingsSelector.setResult(DEFAULT_MOCK_SETTINGS_2);

    store.refreshState();

    expect(component.darkMode).toEqual(true);
    expect(component.settings).toEqual(DEFAULT_MOCK_SETTINGS_2);
    expect(document.querySelector('html')?.classList.contains('dark-mode')).toBeTruthy();
  });

  it('getting settings event works for event Load', fakeAsync(() => {
    fixture.detectChanges();

    expect(component.isLoading).toEqual(true);
    mockSettingsEventSelector.setResult(DEFAULT_MOCK_SETTINGS_EVENT_LOAD_SUCCESS);

    store.refreshState();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(component.isLoading).toEqual(false);
  }));

  it("getting settings event doesn't work for event Update", fakeAsync(() => {
    fixture.detectChanges();

    expect(component.isLoading).toEqual(true);
    mockSettingsEventSelector.setResult(DEFAULT_MOCK_SETTINGS_EVENT_UPDATE_SUCCESS);

    store.refreshState();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(component.isLoading).toEqual(true);
  }));

  it('checking if language is English works', () => {
    fixture.detectChanges();

    component.settings.language = SettingsLanguage.English;
    expect(component.isLanguageEnglish()).toBeTruthy();
    expect(component.isLanguagePolish()).toBeFalsy();
  });

  it('checking if language is Polish works', () => {
    fixture.detectChanges();

    component.settings.language = SettingsLanguage.Polish;
    expect(component.isLanguageEnglish()).toBeFalsy();
    expect(component.isLanguagePolish()).toBeTruthy();
  });

  it('changing language to English works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.switchLanguage(SettingsLanguage.English);
    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: SettingsAction.UpdateSettings,
      settings: { ...DEFAULT_MOCK_SETTINGS_1, language: SettingsLanguage.English },
    });
  });

  it('changing language to English works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.switchLanguage(SettingsLanguage.Polish);
    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: SettingsAction.UpdateSettings,
      settings: { ...DEFAULT_MOCK_SETTINGS_1, language: SettingsLanguage.Polish },
    });
  });

  it('toggleSidebar works', () => {
    fixture.detectChanges();

    expect(component.sidebarVisible).toBeFalsy();
    component.toggleSidebar();
    expect(component.sidebarVisible).toBeTruthy();
    component.toggleSidebar();
    expect(component.sidebarVisible).toBeFalsy();
  });

  it('toggleDarkMode works with switch to Dark mode', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.toggleDarkMode();

    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: SettingsAction.UpdateSettings,
      settings: { ...component.settings, theme: SettingsTheme.Dark },
    });
  });

  it('toggleDarkMode works with switch to Light mode', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
    component.settings = {
      ...component.settings,
      theme: SettingsTheme.Dark,
    };
    component.darkMode = true;
    component.toggleDarkMode();

    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: SettingsAction.UpdateSettings,
      settings: { ...component.settings, theme: SettingsTheme.Light },
    });
  });
});
