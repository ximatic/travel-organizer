import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { provideMockStore } from '@ngrx/store/testing';

import { DEFAULT_TRIP_0 } from '../../../common/mocks/trips.constants';
import { DEFAULT_INITIAL_SETTINGS_STATE } from '../../../common/mocks/settings.constants';

import { TripPanelComponent } from './trip-panel.component';

describe('TripPanelComponent', () => {
  let component: TripPanelComponent;
  let fixture: ComponentFixture<TripPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripPanelComponent],
      providers: [provideNoopAnimations(), provideMockStore({ initialState: DEFAULT_INITIAL_SETTINGS_STATE })],
    }).compileComponents();

    fixture = TestBed.createComponent(TripPanelComponent);
    component = fixture.componentInstance;
    component.trip = DEFAULT_TRIP_0;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
