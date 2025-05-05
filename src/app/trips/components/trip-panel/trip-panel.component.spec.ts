/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { MOCK_INITIAL_USER_STATE } from '../../../../../__mocks__/constants/user.constants';
import { MOCK_USER_SETTINGS_1 } from '../../../../../__mocks__/constants/user-settings.constants';
import { MOCK_TRIP_0 } from '../../../../../__mocks__/constants/trips.constants';

import { DEFAULT_USER_SETTINGS } from '../../../user/constants/settings.constants';

import { selectUserSettings } from '../../../user/store/user.selectors';

import { TripPanelComponent } from './trip-panel.component';

describe('TripPanelComponent', () => {
  let component: TripPanelComponent;
  let fixture: ComponentFixture<TripPanelComponent>;

  let store: MockStore;
  let mockUserSettingsSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripPanelComponent],
      providers: [provideNoopAnimations(), provideMockStore({ initialState: MOCK_INITIAL_USER_STATE })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockUserSettingsSelector = store.overrideSelector(selectUserSettings, MOCK_USER_SETTINGS_1);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripPanelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('trip', MOCK_TRIP_0);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('receiving User Settings via selector works', () => {
    fixture.detectChanges();

    mockUserSettingsSelector.setResult(MOCK_USER_SETTINGS_1);
    store.refreshState();

    expect(component.userSettings()).toEqual(MOCK_USER_SETTINGS_1);
  });

  it('receiving null User Settings via selector works', () => {
    fixture.detectChanges();

    mockUserSettingsSelector.setResult(null);
    store.refreshState();

    expect(component.userSettings()).toEqual(DEFAULT_USER_SETTINGS);
  });
});
