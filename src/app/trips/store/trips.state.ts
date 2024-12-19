import { Trip } from '../models/trip.model';

export enum ActionName {
  LoadTrips = 'load-trips',
  LoadTrip = 'load-trip',
  CreateTrip = 'create-trip',
  UpdateTrip = 'update-trip',
  RemoveTrip = 'remove-trip',
}

export enum ActionState {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export interface TripsActionState {
  name: ActionName;
  state: ActionState;
  message?: string;
  trip?: Trip;
}

export interface TripsState {
  trips: Trip[];
  trip?: Trip;
  actionState?: TripsActionState;
}
