/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';

import {
  DEFAULT_INITIAL_SETTINGS_STATE,
  DEFAULT_MOCK_SETTINGS_1,
  DEFAULT_MOCK_SETTINGS_2,
} from '../common/mocks/settings.constants';

import { DEFAULT_SETTINGS } from '../settings/constants/settings.constants';
import { SettingsTheme } from '../settings/models/settings.model';
import { SettingsAction } from '../settings/store/settings.actions';
import { selectSettings } from '../settings/store/settings.selectors';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let store: MockStore;

  let mockSettingsSelector: any;

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

  it('loading setting works for light theme', () => {
    fixture.detectChanges();

    mockSettingsSelector.setResult(DEFAULT_MOCK_SETTINGS_1);

    store.refreshState();

    expect(component.darkMode).toEqual(false);
    expect(component.settings).toEqual(DEFAULT_MOCK_SETTINGS_1);
    expect(document.querySelector('html')?.classList.contains('dark-mode')).toBeFalsy();
  });

  it('loading setting works for dark theme', () => {
    fixture.detectChanges();

    mockSettingsSelector.setResult(DEFAULT_MOCK_SETTINGS_2);

    store.refreshState();

    expect(component.darkMode).toEqual(true);
    expect(component.settings).toEqual(DEFAULT_MOCK_SETTINGS_2);
    expect(document.querySelector('html')?.classList.contains('dark-mode')).toBeTruthy();
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
