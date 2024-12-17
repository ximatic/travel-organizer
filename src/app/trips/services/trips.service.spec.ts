import { TestBed } from '@angular/core/testing';

import { Trip } from '../models/trip.model';

import { DEFAULT_TRIP_0, DEFAULT_TRIP_1, DEFAULT_TRIP_2 } from '../../common/mocks/constants';

import { TripsService } from './trips.service';

describe('TripsService', () => {
  let service: TripsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    // clear localStorage before every test to have known state
    localStorage.clear();

    service = TestBed.inject(TripsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('no trips initially in localStorage', () => {
    expect(service.loadTrips()).toEqual([]);
  });

  it('creating trip without id works', () => {
    service.createTrip(DEFAULT_TRIP_0);
    expect(service.loadTrips()).toEqual([DEFAULT_TRIP_0]);
  });

  it('creating trip with id works', () => {
    service.createTrip(DEFAULT_TRIP_1);
    expect(service.loadTrips()).toEqual([DEFAULT_TRIP_1]);
  });

  it('updating trip works', () => {
    service.createTrip(DEFAULT_TRIP_1);
    const birthday: Trip = {
      ...DEFAULT_TRIP_1,
      description: DEFAULT_TRIP_2.description,
    };
    service.updateTrip(birthday);
    expect(service.loadTrips()).toEqual([birthday]);
  });

  it("updating trip doesn't work for trip without id", () => {
    service.createTrip(DEFAULT_TRIP_1);
    expect(service.updateTrip(DEFAULT_TRIP_0)).toBeUndefined();
    expect(service.loadTrips()).toEqual([DEFAULT_TRIP_1]);
  });

  it('removing trip works', () => {
    service.createTrip(DEFAULT_TRIP_1);
    service.deleteTrip(DEFAULT_TRIP_1);
    expect(service.loadTrips()).toEqual([]);
  });

  it("removing trip  doesn't work for trip without id", () => {
    service.createTrip(DEFAULT_TRIP_1);
    expect(service.deleteTrip(DEFAULT_TRIP_0)).toBeUndefined();
    expect(service.loadTrips()).toEqual([DEFAULT_TRIP_1]);
  });

  it('loading invidual trip works', () => {
    service.createTrip(DEFAULT_TRIP_1);
    expect(service.loadTrip(DEFAULT_TRIP_1.id)).toEqual(DEFAULT_TRIP_1);
  });
});
