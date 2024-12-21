import { Trip } from '../models/trip.model';

export enum TripsEventName {
  LoadAll = 'load-trips',
  Load = 'load-trip',
  Create = 'create-trip',
  Update = 'update-trip',
  Remove = 'remove-trip',
}

export enum TripsEventType {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export interface TripsEvent {
  name: TripsEventName;
  type: TripsEventType;
  message?: string;
  trip?: Trip;
}

export interface TripsState {
  trips: Trip[];
  trip?: Trip;
  event?: TripsEvent;
}
