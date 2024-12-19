import { createReducer, on } from '@ngrx/store';

import { tripActions } from './trips.actions';
import { ActionName, ActionState, TripsState } from './trips.state';

import { Trip } from '../models/trip.model';

export const initialState: TripsState = {
  trips: [],
  actionState: {
    name: ActionName.LoadTrips,
    state: ActionState.Loading,
  },
};

export const tripsReducer = createReducer(
  initialState,
  on(tripActions.reset, () => initialState),
  // load trips
  on(tripActions.loadTrips, (state: TripsState) => ({
    ...state,
    actionState: {
      name: ActionName.LoadTrips,
      state: ActionState.Loading,
    },
  })),
  on(tripActions.loadTripsSuccess, (state: TripsState, { trips }) => ({
    ...state,
    trips,
    actionState: {
      name: ActionName.LoadTrips,
      state: ActionState.Success,
    },
  })),
  on(tripActions.loadTripsError, (state: TripsState, { error }) => ({
    ...state,
    actionState: {
      name: ActionName.LoadTrips,
      state: ActionState.Error,
      message: error,
    },
  })),
  // load trip
  on(tripActions.loadTrip, (state: TripsState) => ({
    ...state,
    actionState: {
      name: ActionName.LoadTrip,
      state: ActionState.Loading,
    },
  })),
  on(tripActions.loadTripSuccess, (state: TripsState, { trip }) => ({
    ...state,
    actionState: {
      name: ActionName.LoadTrip,
      state: ActionState.Success,
      trip: trip,
    },
  })),
  on(tripActions.loadTripError, (state: TripsState, { error }) => ({
    ...state,
    actionState: {
      name: ActionName.LoadTrip,
      state: ActionState.Error,
      message: error,
    },
  })),
  // create trip
  on(tripActions.createTripSuccess, (state: TripsState, { trip, message }) => ({
    ...state,
    trips: [...state.trips, trip],
    actionState: {
      name: ActionName.CreateTrip,
      state: ActionState.Success,
      message: message,
      trip: trip,
    },
  })),
  on(tripActions.createTripError, (state: TripsState, { error }) => ({
    ...state,
    actionState: {
      name: ActionName.CreateTrip,
      state: ActionState.Error,
      message: error,
    },
  })),
  // update trip
  on(tripActions.updateTripSuccess, (state: TripsState, { trip, message }) => ({
    ...state,
    trips: state.trips.map((t: Trip) => (trip.id === t.id ? trip : t)),
    actionState: {
      name: ActionName.UpdateTrip,
      state: ActionState.Success,
      message: message,
      trip: trip,
    },
  })),
  on(tripActions.updateTripError, (state: TripsState, { error }) => ({
    ...state,
    actionState: {
      name: ActionName.UpdateTrip,
      state: ActionState.Error,
      message: error,
    },
  })),
  // remove trip
  on(tripActions.removeTripSuccess, (state: TripsState, { trip, message }) => ({
    ...state,
    trips: state.trips.filter((t: Trip) => trip.id != t.id),
    actionState: {
      name: ActionName.RemoveTrip,
      state: ActionState.Success,
      message: message,
    },
  })),
  on(tripActions.removeTripError, (state: TripsState, { error }) => ({
    ...state,
    actionState: {
      name: ActionName.RemoveTrip,
      state: ActionState.Error,
      message: error,
    },
  })),
);
