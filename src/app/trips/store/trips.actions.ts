import { createAction, props } from '@ngrx/store';

import { Trip } from '../models/trip.model';

export enum TripAction {
  Reset = '[TripsAPI] Reset',
  LoadTrips = '[TripsAPI] Trips Load',
  LoadTripsSuccess = '[TripsAPI] Trips Load Success',
  LoadTripsError = '[TripsAPI] Trips Load Error',
  LoadTrip = '[TripsAPI] Trip Load',
  LoadTripSuccess = '[TripsAPI] Trip Load Success',
  LoadTripError = '[TripsAPI] Trip Load Error',
  CreateTrip = '[TripsAPI] Trip Create',
  CreateTripSuccess = '[TripsAPI] Trip Create Success',
  CreateTripError = '[TripsAPI] Trip Create Error',
  UpdateTrip = '[TripsAPI] Trip Update',
  UpdateTripSuccess = '[TripsAPI] Trip Update Success',
  UpdateTripError = '[TripsAPI] Trip Update Error',
  RemoveTrip = '[TripsAPI] Trip Remove',
  RemoveTripSuccess = '[TripsAPI] Trip Remove Success',
  RemoveTripError = '[TripsAPI] Trip Remove Error',
}

export const tripActions = {
  reset: createAction(TripAction.Reset),
  loadTrips: createAction(TripAction.LoadTrips),
  loadTripsSuccess: createAction(TripAction.LoadTripsSuccess, props<{ trips: Trip[] }>()),
  loadTripsError: createAction(TripAction.LoadTripsError, props<{ error: string }>()),
  loadTrip: createAction(TripAction.LoadTrip, props<{ id: string }>()),
  loadTripSuccess: createAction(TripAction.LoadTripSuccess, props<{ trip: Trip }>()),
  loadTripError: createAction(TripAction.LoadTripError, props<{ error: string }>()),
  createTrip: createAction(TripAction.CreateTrip, props<{ trip: Trip }>()),
  createTripSuccess: createAction(TripAction.CreateTripSuccess, props<{ trip: Trip; message: string }>()),
  createTripError: createAction(TripAction.CreateTripError, props<{ error: string }>()),
  updateTrip: createAction(TripAction.UpdateTrip, props<{ trip: Trip }>()),
  updateTripSuccess: createAction(TripAction.UpdateTripSuccess, props<{ trip: Trip; message: string }>()),
  updateTripError: createAction(TripAction.UpdateTripError, props<{ error: string }>()),
  removeTrip: createAction(TripAction.RemoveTrip, props<{ trip: Trip }>()),
  removeTripSuccess: createAction(TripAction.RemoveTripSuccess, props<{ trip: Trip; message: string }>()),
  removeTripError: createAction(TripAction.RemoveTripError, props<{ error: string }>()),
};
