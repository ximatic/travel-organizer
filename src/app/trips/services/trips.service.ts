import { Observable } from 'rxjs';

import { Trip, TripItem } from '../models/trip.model';

export abstract class TripsService {
  // trip

  abstract loadTrips(): Observable<Trip[]>;

  abstract loadTrip(id: string): Observable<Trip>;

  abstract createTrip(trip: Trip): Observable<Trip>;

  abstract updateTrip(trip: Trip): Observable<Trip>;

  abstract removeTrip(trip: Trip): Observable<Trip>;

  // trip items

  abstract createTripItem(trip: Trip, tripItem: TripItem): Observable<Trip>;

  abstract checkTripItem(trip: Trip, tripItem: TripItem): Observable<Trip>;

  abstract removeTripItem(trip: Trip, tripItem: TripItem): Observable<Trip>;
}
