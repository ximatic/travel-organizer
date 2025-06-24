/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';

import {
  MOCK_AUTH_TOKEN_1,
  MOCK_AUTH_EVENT_LOGIN_SUCCESS,
  MOCK_AUTH_EVENT_LOGOUT_LOADING,
  MOCK_AUTH_EVENT_LOGOUT_SUCCESS,
  MOCK_AUTH_TOKEN_2,
} from '../../../__mocks__/constants/auth.constants';
import { MOCK_INITIAL_USER_STATE, MOCK_USER_EVENT_LOAD_USER_INFO_SUCCESS } from '../../../__mocks__/constants/user.constants';
import {
  MOCK_USER_EVENT_UPDATE_USER_SETTINGS_PROCESSING,
  MOCK_USER_EVENT_UPDATE_USER_SETTINGS_SUCCESS,
  MOCK_USER_SETTINGS_1,
  MOCK_USER_SETTINGS_2,
} from '../../../__mocks__/constants/user-settings.constants';

import { DEFAULT_UX_DELAY } from '../common/constants/common.constants';
import { DEFAULT_USER_SETTINGS } from '../user/constants/settings.constants';

import { AuthAction } from '../auth/store/auth.actions';
import { selectAuthEvent, selectAuthToken } from '../auth/store/auth.selectors';

import { UserSettings, UserSettingsLanguage, UserSettingsTheme } from '../user/models/user-settings.model';
import { UserAction } from '../user/store/user.actions';
import { selectUserEvent, selectUserSettings } from '../user/store/user.selectors';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let router: Router;
  let store: MockStore;

  let mockUserSettingsSelector: any;
  let mockUserSettingsSelmockUserEventSelectorector: any;
  let mockAuthTokenSelector: any;
  let mockAuthEventSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [provideRouter([]), provideTranslateService(), provideMockStore({ initialState: MOCK_INITIAL_USER_STATE })],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);

    mockUserSettingsSelector = store.overrideSelector(selectUserSettings, MOCK_USER_SETTINGS_1);
    mockUserSettingsSelmockUserEventSelectorector = store.overrideSelector(
      selectUserEvent,
      MOCK_USER_EVENT_UPDATE_USER_SETTINGS_PROCESSING,
    );
    mockAuthTokenSelector = store.overrideSelector(selectAuthToken, null);
    mockAuthEventSelector = store.overrideSelector(selectAuthEvent, MOCK_AUTH_EVENT_LOGOUT_LOADING);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // settings

  it('initial settings are default', () => {
    expect(component.settings()).toEqual(DEFAULT_USER_SETTINGS);
  });

  it('receiving null settings does not change current settings', () => {
    fixture.detectChanges();

    mockUserSettingsSelector.setResult(null);

    store.refreshState();

    expect(component.settings()).toEqual(DEFAULT_USER_SETTINGS);
  });

  it('loading settings works for light theme', () => {
    fixture.detectChanges();

    mockUserSettingsSelector.setResult(MOCK_USER_SETTINGS_1);

    store.refreshState();

    expect(component.darkMode()).toEqual(false);
    expect(component.settings()).toEqual(MOCK_USER_SETTINGS_1);
    expect(document.querySelector('html')?.classList.contains('dark-mode')).toBeFalsy();
  });

  it('loading settings works for dark theme', () => {
    fixture.detectChanges();

    mockUserSettingsSelector.setResult(MOCK_USER_SETTINGS_2);

    store.refreshState();

    expect(component.darkMode()).toEqual(true);
    expect(component.settings()).toEqual(MOCK_USER_SETTINGS_2);
    expect(document.querySelector('html')?.classList.contains('dark-mode')).toBeTruthy();
  });

  // user events

  it('getting user event works for User Load Info event', fakeAsync(() => {
    fixture.detectChanges();

    expect(component.isLoading()).toEqual(true);
    mockUserSettingsSelmockUserEventSelectorector.setResult(MOCK_USER_EVENT_LOAD_USER_INFO_SUCCESS);

    store.refreshState();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(component.isLoading()).toEqual(false);
  }));

  it("getting user event doesn't work for Update User Settings event", fakeAsync(() => {
    fixture.detectChanges();

    expect(component.isLoading()).toEqual(true);
    mockUserSettingsSelmockUserEventSelectorector.setResult(MOCK_USER_EVENT_UPDATE_USER_SETTINGS_SUCCESS);

    store.refreshState();

    // artificial delay as in component
    tick(DEFAULT_UX_DELAY);

    expect(component.isLoading()).toEqual(true);
  }));

  // language

  it('checking if language is English works', () => {
    fixture.detectChanges();

    component.settings.update((settings: UserSettings) => {
      return { ...settings, language: UserSettingsLanguage.English };
    });
    expect(component.isLanguageEnglish()).toBeTruthy();
    expect(component.isLanguagePolish()).toBeFalsy();
  });

  it('checking if language is Polish works', () => {
    fixture.detectChanges();

    component.settings.update((settings: UserSettings) => {
      return { ...settings, language: UserSettingsLanguage.Polish };
    });
    expect(component.isLanguageEnglish()).toBeFalsy();
    expect(component.isLanguagePolish()).toBeTruthy();
  });

  it('changing language to English works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.switchLanguage(UserSettingsLanguage.English);
    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: UserAction.UpdateUserSettings,
      userSettings: { ...MOCK_USER_SETTINGS_1, language: UserSettingsLanguage.English },
    });
  });

  it('changing language to English works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.switchLanguage(UserSettingsLanguage.Polish);
    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: UserAction.UpdateUserSettings,
      userSettings: { ...MOCK_USER_SETTINGS_1, language: UserSettingsLanguage.Polish },
    });
  });

  // dark mode

  it('toggleSidebar works', () => {
    fixture.detectChanges();

    expect(component.sidebarVisible()).toBeFalsy();
    component.toggleSidebar();
    expect(component.sidebarVisible()).toBeTruthy();
    component.toggleSidebar();
    expect(component.sidebarVisible()).toBeFalsy();
  });

  it('toggleDarkMode works with switch to Dark mode', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.toggleDarkMode();

    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: UserAction.UpdateUserSettings,
      userSettings: { ...component.settings(), theme: UserSettingsTheme.Dark },
    });
  });

  it('toggleDarkMode works with switch to Light mode', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.settings.update((settings: UserSettings) => {
      return { ...settings, theme: UserSettingsTheme.Dark };
    });
    component.darkMode.set(true);
    component.toggleDarkMode();

    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: UserAction.UpdateUserSettings,
      userSettings: { ...component.settings(), theme: UserSettingsTheme.Light },
    });
  });

  // logout

  it('logout works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.logout();
    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: AuthAction.Logout,
    });
  });

  // auth

  it('user is not logged in when Auth Token is null', fakeAsync(() => {
    fixture.detectChanges();

    mockAuthTokenSelector.setResult(null);

    store.refreshState();

    expect(component.isLoggedIn()).toBe(false);
    expect(component.isAdmin()).toBe(false);
  }));

  it('user (user role) is logged in when Auth Token is valid', fakeAsync(() => {
    fixture.detectChanges();

    mockAuthTokenSelector.setResult(MOCK_AUTH_TOKEN_1);

    store.refreshState();

    expect(component.isLoggedIn()).toBe(true);
    expect(component.isAdmin()).toBe(false);
  }));

  it('user (admin role) is logged in when Auth Token is valid', fakeAsync(() => {
    fixture.detectChanges();

    mockAuthTokenSelector.setResult(MOCK_AUTH_TOKEN_2);

    store.refreshState();

    expect(component.isLoggedIn()).toBe(true);
    expect(component.isAdmin()).toBe(true);
  }));

  // auth events

  it('user is redirected to /auth/login after receiving Logout Success auth event', fakeAsync(() => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockReturnValue(
      new Promise((resolve) => {
        resolve(true);
      }),
    );
    fixture.detectChanges();

    mockAuthEventSelector.setResult(MOCK_AUTH_EVENT_LOGOUT_SUCCESS);

    store.refreshState();

    expect(component.isLoggedIn()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith([`/auth/login`]);
  }));

  it('request for settings and profile is dispatched after user login', fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();

    mockAuthEventSelector.setResult(MOCK_AUTH_EVENT_LOGIN_SUCCESS);

    store.refreshState();

    expect(component.isLoggedIn()).toBe(true);
    expect(dispatchSpy).toHaveBeenLastCalledWith({
      type: UserAction.LoadUserInfo,
    });
  }));
});
