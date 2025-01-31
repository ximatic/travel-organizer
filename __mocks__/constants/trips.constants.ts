import { Trip, TripItem } from '../../src/app/trips/models/trip.model';
import { TripsState } from '../../src/app/trips/store/trips.state';

// trip mocks

export const DEFAULT_TRIP_0: Trip = {
  name: 'Test Trip #0',
};

export const DEFAULT_TRIP_1: Trip = {
  _id: 'test-id-1',
  name: 'Test Trip #1',
};

export const DEFAULT_TRIP_2: Trip = {
  _id: 'test-id-2',
  name: 'Test Trip #2',
  description: 'Test Description #2',
  items: [],
};

export const DEFAULT_TRIP_3: Trip = {
  _id: 'test-id-3',
  name: 'Test Trip #3',
  description: 'Test Description #3',
  location: 'Berlin',
};

export const DEFAULT_TRIP_4: Trip = {
  _id: 'test-id-4',
  name: 'Test Trip #4',
  description: 'Test Description #4',
  location: 'Berlin',
  startDate: new Date(),
  endDate: new Date(),
};

// trip item mocks

export const DEFAULT_TRIP_ITEM_0: TripItem = {
  name: 'Test Trip Item #0',
  checked: false,
};

export const DEFAULT_TRIP_ITEM_1: TripItem = {
  _id: 'test-item-id-1',
  name: 'Test Trip Item #1',
  checked: false,
};

export const DEFAULT_TRIP_ITEM_2: TripItem = {
  _id: 'test-item-id-2',
  name: 'Test Trip Item #2',
  checked: false,
};

// store mocks

export const DEFAULT_INITIAL_TRIPS_STATE: TripsState = {
  trips: [],
};
