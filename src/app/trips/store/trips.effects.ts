import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';

import { TripsService } from '../services/trips.service';
import { ActionPropsId, ActionPropsTrip, TripAction, tripActions } from './trips.actions';

import { Trip, TripError } from '../models/trip.model';

@Injectable()
export class TripsEffects {
  loadTrips$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripAction.LoadTrips),
      exhaustMap(() =>
        this.tripsService.loadTrips().pipe(
          map((trips: Trip[]) => tripActions.loadTripsSuccess({ trips })),
          catchError(() => of(tripActions.loadTripsError({ error: "Can't load trips. Please try again later." }))),
        ),
      ),
    ),
  );

  loadTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripAction.LoadTrip),
      exhaustMap((action: ActionPropsId) =>
        this.tripsService.loadTrip(action.id).pipe(
          map((trip: Trip) => tripActions.loadTripSuccess({ trip })),
          catchError(() => of(tripActions.loadTripError({ error: "Can't load trip. Please try again later." }))),
        ),
      ),
    ),
  );

  createTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripAction.CreateTrip),
      exhaustMap((action: ActionPropsTrip) =>
        this.tripsService.createTrip(action.trip).pipe(
          map((trip: Trip) => tripActions.createTripSuccess({ trip, message: `Trip (${trip.name}) added` })),
          catchError((error: TripError) =>
            of(tripActions.createTripError({ error: `Can't create trip (${error.trip?.name}). Please try again later.` })),
          ),
        ),
      ),
    ),
  );

  updateTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripAction.UpdateTrip),
      exhaustMap((action: ActionPropsTrip) =>
        this.tripsService.updateTrip(action.trip).pipe(
          map((trip: Trip) => tripActions.updateTripSuccess({ trip, message: `Trip (${trip.name}) updated` })),
          catchError((error: TripError) =>
            of(tripActions.updateTripError({ error: `Can't update trip (${error.trip?.name}). Please try again later.` })),
          ),
        ),
      ),
    ),
  );

  removeTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripAction.RemoveTrip),
      exhaustMap((action: ActionPropsTrip) =>
        this.tripsService.removeTrip(action.trip).pipe(
          map((trip: Trip) => tripActions.removeTripSuccess({ trip, message: `Trip (${trip.name}) removed` })),
          catchError((error: TripError) =>
            of(tripActions.removeTripError({ error: `Can't remove trip (${error.trip?.name}). Please try again later.` })),
          ),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private tripsService: TripsService,
  ) {}
}
