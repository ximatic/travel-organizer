import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TripsState } from './trips.state';

export const selectTripsState = createFeatureSelector<TripsState>('trips');

export const selectTripsEvent = createSelector(selectTripsState, (state: TripsState) => state.event);

export const selectTrips = createSelector(selectTripsState, (state: TripsState) => state.trips);

export const selectTrip = createSelector(selectTripsState, (state: TripsState) => state.trip);
