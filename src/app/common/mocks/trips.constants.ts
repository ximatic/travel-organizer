import { Trip } from '../../trips/models/trip.model';
import { TripsState } from '../../trips/store/trips.state';

// trip mocks

export const DEFAULT_TRIP_0: Trip = {
  name: 'Test Trip #0',
};

export const DEFAULT_TRIP_1: Trip = {
  id: 'test-id-1',
  name: 'Test Trip #1',
};

export const DEFAULT_TRIP_2: Trip = {
  id: 'test-id-2',
  name: 'Test Trip #2',
  description: 'Test Description #2',
};

export const DEFAULT_TRIP_3: Trip = {
  id: 'test-id-3',
  name: 'Test Trip #3',
  description: 'Test Description #3',
  location: 'Berlin',
};

export const DEFAULT_TRIP_4: Trip = {
  id: 'test-id-4',
  name: 'Test Trip #4',
  description: 'Test Description #4',
  location: 'Berlin',
  startDate: new Date(),
  endDate: new Date(),
};

// store mocks

export const DEFAULT_INITIAL_TRIPS_STATE: TripsState = {
  trips: [],
};
