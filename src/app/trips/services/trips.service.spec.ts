import { TestBed } from '@angular/core/testing';

import { switchMap } from 'rxjs';

import { Trip, TripError } from '../models/trip.model';

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
      .pipe(switchMap(() => service.loadTrip(DEFAULT_TRIP_1.id as string)))
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
      .pipe(switchMap(() => service.loadTrip(DEFAULT_TRIP_2.id as string)))
      .subscribe({
        error: (error: TripError) => {
          expect(error).toEqual(new TripError("Trip with provided ID doesn't exist"));
          done();
        },
      });
  });
});
