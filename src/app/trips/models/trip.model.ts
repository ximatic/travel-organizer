export enum TripsEventMessage {
  LOAD_TRIPS_ERROR = 'LOAD_TRIPS_ERROR',
  LOAD_TRIP_ERROR = 'LOAD_TRIP_ERROR',
  CREATE_TRIP_SUCCESS = 'CREATE_TRIP_SUCCESS',
  CREATE_TRIP_ERROR = 'CREATE_TRIP_ERROR',
  UPDATE_TRIP_SUCCESS = 'UPDATE_TRIP_SUCCESS',
  UPDATE_TRIP_ERROR = 'UPDATE_TRIP_ERROR',
  REMOVE_TRIP_SUCCESS = 'REMOVE_TRIP_SUCCESS',
  REMOVE_TRIP_ERROR = 'REMOVE_TRIP_ERROR',
  CREATE_TRIP_ITEM_SUCCESS = 'CREATE_TRIP_ITEM_SUCCESS',
  CREATE_TRIP_ITEM_ERROR = 'CREATE_TRIP_ITEM_ERROR',
  CHECK_TRIP_ITEM_SUCCESS = 'CHECK_TRIP_ITEM_SUCCESS',
  CHECK_TRIP_ITEM_ERROR = 'CHECK_TRIP_ITEM_ERROR',
  REMOVE_TRIP_ITEM_SUCCESS = 'REMOVE_TRIP_ITEM_SUCCESS',
  REMOVE_TRIP_ITEM_ERROR = 'REMOVE_TRIP_ITEM_ERROR',
}

// trip

export interface TripItem {
  _id?: string;
  name: string;
  checked: boolean;
  description?: string;
  type?: string; // clothes, electronics, shoes, accessories, etc.
  size?: string;
  color?: string;
}

export interface Trip {
  _id?: string;
  name: string;
  type?: string; // foot, car, train, plane, boat, etc.
  description?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  items?: TripItem[];
}
