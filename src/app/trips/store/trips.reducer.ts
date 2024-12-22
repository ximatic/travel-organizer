import { createReducer, on } from '@ngrx/store';

import { tripActions, tripItemActions } from './trips.actions';
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
    (state: TripsState, { message }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.LoadAll,
        type: TripsEventType.Error,
        message,
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
    (state: TripsState, { message }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.Load,
        type: TripsEventType.Error,
        message,
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
        trip: trip,
        message: message,
      },
    }),
  ),
  on(
    tripActions.createTripError,
    (state: TripsState, { trip, message }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.Create,
        type: TripsEventType.Error,
        trip: trip,
        message,
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
        trip: trip,
        message: message,
      },
    }),
  ),
  on(
    tripActions.updateTripError,
    (state: TripsState, { trip, message }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.Update,
        type: TripsEventType.Error,
        trip: trip,
        message,
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
        trip: trip,
        message: message,
      },
    }),
  ),
  on(
    tripActions.removeTripError,
    (state: TripsState, { trip, message }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.Remove,
        type: TripsEventType.Error,
        trip: trip,
        message,
      },
    }),
  ),
  // create trip item
  on(
    tripItemActions.createTripItemSuccess,
    (state: TripsState, { trip, message }): TripsState => ({
      ...state,
      trips: state.trips.map((t: Trip) => (trip.id === t.id ? trip : t)),
      event: {
        name: TripsEventName.CreateItem,
        type: TripsEventType.Success,
        message: message,
        trip: trip,
      },
    }),
  ),
  on(
    tripItemActions.createTripItemError,
    (state: TripsState, { message }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.CreateItem,
        type: TripsEventType.Error,
        message,
      },
    }),
  ),
  // check trip item
  on(
    tripItemActions.checkTripItemSuccess,
    (state: TripsState, { trip, message }): TripsState => ({
      ...state,
      trips: state.trips.map((t: Trip) => (trip.id === t.id ? trip : t)),
      event: {
        name: TripsEventName.CheckItem,
        type: TripsEventType.Success,
        message: message,
        trip: trip,
      },
    }),
  ),
  on(
    tripItemActions.checkTripItemError,
    (state: TripsState, { message }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.CheckItem,
        type: TripsEventType.Error,
        message,
      },
    }),
  ),
  // remove trip item
  on(
    tripItemActions.removeTripItemSuccess,
    (state: TripsState, { trip, message }): TripsState => ({
      ...state,
      trips: state.trips.map((t: Trip) => (trip.id === t.id ? trip : t)),
      event: {
        name: TripsEventName.RemoveItem,
        type: TripsEventType.Success,
        message: message,
        trip: trip,
      },
    }),
  ),
  on(
    tripItemActions.removeTripItemError,
    (state: TripsState, { message }): TripsState => ({
      ...state,
      event: {
        name: TripsEventName.RemoveItem,
        type: TripsEventType.Error,
        message,
      },
    }),
  ),
);
