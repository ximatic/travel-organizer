import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';

import { TripsService } from '../services/trips.service';
import {
  ActionPropsId,
  ActionPropsTrip,
  ActionPropsTripItem,
  TripAction,
  tripActions,
  TripItemAction,
  tripItemActions,
} from './trips.actions';

import { Trip, TripError, TripsEventMessage } from '../models/trip.model';

@Injectable()
export class TripsEffects {
  // trip

  loadTrips$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripAction.LoadTrips),
      exhaustMap(() =>
        this.tripsService.loadTrips().pipe(
          map((trips: Trip[]) => tripActions.loadTripsSuccess({ trips })),
          catchError(() => of(tripActions.loadTripsError({ message: TripsEventMessage.LOAD_TRIPS_ERROR }))),
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
          catchError(() => of(tripActions.loadTripError({ message: TripsEventMessage.LOAD_TRIP_ERROR }))),
        ),
      ),
    ),
  );

  createTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripAction.CreateTrip),
      exhaustMap((action: ActionPropsTrip) =>
        this.tripsService.createTrip(action.trip).pipe(
          map((trip: Trip) => tripActions.createTripSuccess({ trip, message: TripsEventMessage.CREATE_TRIP_SUCCESS })),
          catchError((error: TripError) =>
            of(tripActions.createTripError({ trip: error.trip, message: TripsEventMessage.CREATE_TRIP_ERROR })),
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
          map((trip: Trip) => tripActions.updateTripSuccess({ trip, message: TripsEventMessage.UPDATE_TRIP_SUCCESS })),
          catchError((error: TripError) =>
            of(tripActions.updateTripError({ trip: error.trip, message: TripsEventMessage.UPDATE_TRIP_ERROR })),
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
          map((trip: Trip) => tripActions.removeTripSuccess({ trip, message: TripsEventMessage.REMOVE_TRIP_SUCCESS })),
          catchError((error: TripError) =>
            of(tripActions.removeTripError({ trip: error.trip, message: TripsEventMessage.REMOVE_TRIP_ERROR })),
          ),
        ),
      ),
    ),
  );

  // trip item

  createTripItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripItemAction.CreateTripItem),
      exhaustMap((action: ActionPropsTripItem) =>
        this.tripsService.createTripItem(action.trip, action.tripItem).pipe(
          map((trip: Trip) =>
            tripItemActions.createTripItemSuccess({ trip, message: TripsEventMessage.CREATE_TRIP_ITEM_SUCCESS }),
          ),
          catchError(() =>
            of(
              tripItemActions.createTripItemError({
                message: TripsEventMessage.CREATE_TRIP_ITEM_ERROR,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  checkTripItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripItemAction.CheckTripItem),
      exhaustMap((action: ActionPropsTripItem) =>
        this.tripsService.checkTripItem(action.trip, action.tripItem).pipe(
          map((trip: Trip) => tripItemActions.checkTripItemSuccess({ trip, message: TripsEventMessage.CHECK_TRIP_ITEM_SUCCESS })),
          catchError(() =>
            of(
              tripItemActions.checkTripItemError({
                message: TripsEventMessage.CHECK_TRIP_ITEM_ERROR,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  removeTripItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripItemAction.RemoveTripItem),
      exhaustMap((action: ActionPropsTripItem) =>
        this.tripsService.removeTripItem(action.trip, action.tripItem).pipe(
          map((trip: Trip) =>
            tripItemActions.removeTripItemSuccess({ trip, message: TripsEventMessage.REMOVE_TRIP_ITEM_SUCCESS }),
          ),
          catchError(() =>
            of(
              tripItemActions.removeTripItemError({
                message: TripsEventMessage.REMOVE_TRIP_ITEM_ERROR,
              }),
            ),
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
