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

export interface ActionPropsTrips {
  trips: Trip[];
}

export interface ActionPropsTrip {
  trip: Trip;
}

export interface ActionPropsId {
  id: string;
}

export interface ActionPropsSuccess {
  trip: Trip;
  message: string;
}

export interface ActionPropsError {
  error: string;
}

export const tripActions = {
  reset: createAction(TripAction.Reset),
  loadTrips: createAction(TripAction.LoadTrips),
  loadTripsSuccess: createAction(TripAction.LoadTripsSuccess, props<ActionPropsTrips>()),
  loadTripsError: createAction(TripAction.LoadTripsError, props<ActionPropsError>()),
  loadTrip: createAction(TripAction.LoadTrip, props<ActionPropsId>()),
  loadTripSuccess: createAction(TripAction.LoadTripSuccess, props<ActionPropsTrip>()),
  loadTripError: createAction(TripAction.LoadTripError, props<ActionPropsError>()),
  createTrip: createAction(TripAction.CreateTrip, props<ActionPropsTrip>()),
  createTripSuccess: createAction(TripAction.CreateTripSuccess, props<ActionPropsSuccess>()),
  createTripError: createAction(TripAction.CreateTripError, props<ActionPropsError>()),
  updateTrip: createAction(TripAction.UpdateTrip, props<ActionPropsTrip>()),
  updateTripSuccess: createAction(TripAction.UpdateTripSuccess, props<ActionPropsSuccess>()),
  updateTripError: createAction(TripAction.UpdateTripError, props<ActionPropsError>()),
  removeTrip: createAction(TripAction.RemoveTrip, props<ActionPropsTrip>()),
  removeTripSuccess: createAction(TripAction.RemoveTripSuccess, props<ActionPropsSuccess>()),
  removeTripError: createAction(TripAction.RemoveTripError, props<ActionPropsError>()),
};
