/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { DEFAULT_INITIAL_TRIPS_STATE, DEFAULT_TRIP_1, DEFAULT_TRIP_2 } from '../../../common/mocks/constants';

import { TripAction } from '../../store/trips.actions';
import { selectTrips } from '../../store/trips.selectors';

import { TripsComponent } from './trips.component';

describe('TripsComponent', () => {
  let component: TripsComponent;
  let fixture: ComponentFixture<TripsComponent>;
  let router: Router;
  let store: MockStore;

  let mockTripsSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TripsComponent],
      providers: [provideRouter([]), provideMockStore({ initialState: DEFAULT_INITIAL_TRIPS_STATE })],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);

    mockTripsSelector = store.overrideSelector(selectTrips, []);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('requesting for trips works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.isLoading).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith({ type: TripAction.LoadTrips });
  });

  it('loading trips works', () => {
    fixture.detectChanges();

    mockTripsSelector.setResult([DEFAULT_TRIP_1, DEFAULT_TRIP_2]);

    store.refreshState();

    expect(component.trips).toEqual([DEFAULT_TRIP_1, DEFAULT_TRIP_2]);
    expect(component.isLoading).toBeFalsy();
  });

  it('opening trip works', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.openTrip(DEFAULT_TRIP_1);
    expect(navigateSpy).toHaveBeenCalledWith([`/trips/${DEFAULT_TRIP_1.id}`]);
  });

  it('removing trip works', () => {
    // TODO - add proper check for removeTrip
    component.removeTrip(new MouseEvent('click'), DEFAULT_TRIP_1);
    expect(component).toBeTruthy();
  });
});
