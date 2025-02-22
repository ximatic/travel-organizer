import { TestBed } from '@angular/core/testing';

import { switchMap } from 'rxjs';

import { Trip, TripError } from '../models/trip.model';

import {
  DEFAULT_TRIP_0,
  DEFAULT_TRIP_1,
  DEFAULT_TRIP_2,
  DEFAULT_TRIP_ITEM_0,
  DEFAULT_TRIP_ITEM_1,
  DEFAULT_TRIP_ITEM_2,
} from '../../../../__mocks__/constants/trips.constants';

import { TripsStorageService } from './trips-storage.service';

describe('TripsStorageService', () => {
  let service: TripsStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    // clear localStorage before every test to have known state
    localStorage.clear();

    service = TestBed.inject(TripsStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // loadTrips

  it('no trips initially in localStorage', (done) => {
    service.loadTrips().subscribe((trips: Trip[]) => {
      expect(trips).toEqual([]);
      done();
    });
  });

  // createTrip

  it('creating trip without id works', (done) => {
    service.createTrip(DEFAULT_TRIP_0).subscribe((trip: Trip) => {
      expect(trip.name).toEqual(DEFAULT_TRIP_0.name);
      done();
    });
  });

  it('creating trip with id works', (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(
        switchMap((trip: Trip) => {
          expect(trip).toEqual(DEFAULT_TRIP_1);
          return service.loadTrips();
        }),
      )
      .subscribe((trips: Trip[]) => {
        expect(trips).toEqual([DEFAULT_TRIP_1]);
        done();
      });
  });

  // updateTrip

  it('updating trip works', (done) => {
    const updatedTrip: Trip = {
      ...DEFAULT_TRIP_1,
      description: DEFAULT_TRIP_2.description,
    };

    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.updateTrip(updatedTrip)))
      .pipe(
        switchMap((trip: Trip) => {
          expect(trip).toEqual(updatedTrip);
          return service.loadTrips();
        }),
      )
      .subscribe((trips: Trip[]) => {
        expect(trips).toEqual([updatedTrip]);
        done();
      });
  });

  it("updating trip doesn't work for trip without id", (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.updateTrip(DEFAULT_TRIP_0)))
      .subscribe({
        error: (error: TripError) => {
          expect(error).toEqual(new TripError('Trip ID is not provided', DEFAULT_TRIP_0));
          done();
        },
      });
  });

  it("updating trip doesn't work for non existing trip", (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.updateTrip(DEFAULT_TRIP_2)))
      .subscribe({
        error: (error: TripError) => {
          expect(error).toEqual(new TripError("Trip with provided ID doesn't exist", DEFAULT_TRIP_2));
          done();
        },
      });
  });

  // removeTrip

  it('removing trip works', (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.removeTrip(DEFAULT_TRIP_1)))
      .pipe(
        switchMap((trip: Trip) => {
          expect(trip).toEqual(DEFAULT_TRIP_1);
          return service.loadTrips();
        }),
      )
      .subscribe((trips: Trip[]) => {
        expect(trips).toEqual([]);
        done();
      });
  });

  it("removing trip doesn't work for trip without id", (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.removeTrip(DEFAULT_TRIP_0)))
      .subscribe({
        error: (error: TripError) => {
          expect(error).toEqual(new TripError('Trip ID is not provided', DEFAULT_TRIP_0));
          done();
        },
      });
  });

  it("removing trip doesn't work for non existing trip", (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.removeTrip(DEFAULT_TRIP_2)))
      .subscribe({
        error: (error: TripError) => {
          expect(error).toEqual(new TripError("Trip with provided ID doesn't exist", DEFAULT_TRIP_2));
          done();
        },
      });
  });

  // loadTrip

  it('loading trip works', (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.loadTrip(DEFAULT_TRIP_1._id as string)))
      .subscribe((trip: Trip) => {
        expect(trip).toEqual(DEFAULT_TRIP_1);
        done();
      });
  });

  it("loading trip doesn't work for trip without id", (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.loadTrip('')))
      .subscribe({
        error: (error: TripError) => {
          expect(error).toEqual(new TripError('Trip ID is not provided'));
          done();
        },
      });
  });

  it("loading trip doesn't work for non existing trip", (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.loadTrip(DEFAULT_TRIP_2._id as string)))
      .subscribe({
        error: (error: TripError) => {
          expect(error).toEqual(new TripError("Trip with provided ID doesn't exist"));
          done();
        },
      });
  });

  // createTripItem

  it('creating trip item without id works', (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.createTripItem(DEFAULT_TRIP_1, DEFAULT_TRIP_ITEM_0)))
      .subscribe((trip: Trip) => {
        expect(trip.items?.length).toEqual(1);
        expect(trip.items && trip.items[0]?.name).toEqual(DEFAULT_TRIP_ITEM_0.name);
        expect(trip.items && trip.items[0]?.checked).toEqual(DEFAULT_TRIP_ITEM_0.checked);
        done();
      });
  });

  it('creating trip item with id works', (done) => {
    service
      .createTrip(DEFAULT_TRIP_2)
      .pipe(switchMap(() => service.createTripItem(DEFAULT_TRIP_2, DEFAULT_TRIP_ITEM_1)))
      .subscribe((trip: Trip) => {
        expect(trip.items).toEqual([DEFAULT_TRIP_ITEM_1]);
        done();
      });
  });

  // checkTripItem

  it('toggling trip item works', (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.createTripItem(DEFAULT_TRIP_1, DEFAULT_TRIP_ITEM_1)))
      .pipe(switchMap((trip: Trip) => service.checkTripItem(trip, DEFAULT_TRIP_ITEM_1)))
      .subscribe((trip: Trip) => {
        expect(trip.items?.length).toEqual(1);
        expect(trip.items && trip.items[0]?.name).toEqual(DEFAULT_TRIP_ITEM_1.name);
        expect(trip.items && trip.items[0]?.checked).toEqual(!DEFAULT_TRIP_ITEM_1.checked);
        done();
      });
  });

  it("toggling trip item for non existing trip item doesn't work", (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.createTripItem(DEFAULT_TRIP_1, DEFAULT_TRIP_ITEM_1)))
      .pipe(switchMap((trip: Trip) => service.checkTripItem(trip, DEFAULT_TRIP_ITEM_2)))
      .subscribe({
        error: (error: TripError) => {
          expect(error).toEqual(new TripError("Trip Item with provided ID doesn't exist"));
          done();
        },
      });
  });

  // removeTripItem

  it('removing trip item defined works', (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.createTripItem(DEFAULT_TRIP_1, DEFAULT_TRIP_ITEM_1)))
      .pipe(switchMap((trip: Trip) => service.removeTripItem(trip, DEFAULT_TRIP_ITEM_1)))
      .subscribe((trip: Trip) => {
        expect(trip.items?.length).toEqual(0);
        done();
      });
  });

  it("removing trip item without id doesn't works", (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.createTripItem(DEFAULT_TRIP_1, DEFAULT_TRIP_ITEM_1)))
      .pipe(switchMap((trip: Trip) => service.removeTripItem(trip, DEFAULT_TRIP_ITEM_0)))
      .subscribe({
        error: (error: TripError) => {
          expect(error).toEqual(new TripError('Trip Item ID is not provided'));
          done();
        },
      });
  });

  it("removing trip item for non existing trip item doesn't work", (done) => {
    service
      .createTrip(DEFAULT_TRIP_1)
      .pipe(switchMap(() => service.createTripItem(DEFAULT_TRIP_1, DEFAULT_TRIP_ITEM_1)))
      .pipe(switchMap((trip: Trip) => service.removeTripItem(trip, DEFAULT_TRIP_ITEM_2)))
      .subscribe({
        error: (error: TripError) => {
          expect(error).toEqual(new TripError("Trip Item with provided ID doesn't exist"));
          done();
        },
      });
  });
});
