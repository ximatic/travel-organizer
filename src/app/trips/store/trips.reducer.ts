import { createReducer, on } from '@ngrx/store';

import { tripActions } from './trips.actions';
import { TripsEventName, TripsEventType, TripsState } from './trips.state';

import { Trip } from '../models/trip.model';

export const initialState: TripsState = {
  trips: [],
  event: {
    name: TripsEventName.LoadAll,
    type: TripsEventType.Loading,
  },
};

export const tripsReducer = createReducer(
  initialState,
  on(tripActions.reset, () => initialState),
  // load trips
  on(
    tripActions.loadTrips,
    (state: TripsState): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.LoadAll,
        type: TripsEventType.Loading,
      },
    }),
  ),
  on(
    tripActions.loadTripsSuccess,
    (state: TripsState, { trips }): TripsState => ({
      ...state,
      trips,
      event: {
        name: TripsEventName.LoadAll,
        type: TripsEventType.Success,
      },
    }),
  ),
  on(
    tripActions.loadTripsError,
    (state: TripsState, { error }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.LoadAll,
        type: TripsEventType.Error,
        message: error,
      },
    }),
  ),
  // load trip
  on(
    tripActions.loadTrip,
    (state: TripsState): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.Load,
        type: TripsEventType.Loading,
      },
    }),
  ),
  on(
    tripActions.loadTripSuccess,
    (state: TripsState, { trip }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.Load,
        type: TripsEventType.Success,
        trip: trip,
      },
    }),
  ),
  on(
    tripActions.loadTripError,
    (state: TripsState, { error }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.Load,
        type: TripsEventType.Error,
        message: error,
      },
    }),
  ),
  // create trip
  on(
    tripActions.createTripSuccess,
    (state: TripsState, { trip, message }): TripsState => ({
      ...state,
      trips: [...state.trips, trip],
      event: {
        name: TripsEventName.Create,
        type: TripsEventType.Success,
        message: message,
        trip: trip,
      },
    }),
  ),
  on(
    tripActions.createTripError,
    (state: TripsState, { error }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.Create,
        type: TripsEventType.Error,
        message: error,
      },
    }),
  ),
  // update trip
  on(
    tripActions.updateTripSuccess,
    (state: TripsState, { trip, message }): TripsState => ({
      ...state,
      trips: state.trips.map((t: Trip) => (trip.id === t.id ? trip : t)),
      event: {
        name: TripsEventName.Update,
        type: TripsEventType.Success,
        message: message,
        trip: trip,
      },
    }),
  ),
  on(
    tripActions.updateTripError,
    (state: TripsState, { error }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.Update,
        type: TripsEventType.Error,
        message: error,
      },
    }),
  ),
  // remove trip
  on(
    tripActions.removeTripSuccess,
    (state: TripsState, { trip, message }): TripsState => ({
      ...state,
      trips: state.trips.filter((t: Trip) => trip.id != t.id),
      event: {
        name: TripsEventName.Remove,
        type: TripsEventType.Success,
        message: message,
      },
    }),
  ),
  on(
    tripActions.removeTripError,
    (state: TripsState, { error }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.Remove,
        type: TripsEventType.Error,
        message: error,
      },
    }),
  ),
);
