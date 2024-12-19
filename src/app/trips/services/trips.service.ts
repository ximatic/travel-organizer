import { Injectable } from '@angular/core';

import { delay, Observable, of, throwError } from 'rxjs';
import * as uuid from 'uuid';

import { Trip, TripError } from '../models/trip.model';

@Injectable({
  providedIn: 'root',
})
export class TripsService {
  private storageKey = 'to-trips';

  createTrip(trip: Trip): Observable<Trip> {
    const newTrip = { ...trip };
    if (!newTrip.id) {
      newTrip.id = uuid.v4();
    }

    const trips = this.fetchTrips();
    trips.push(newTrip);
    this.saveTrips(trips);

    return of(newTrip);
  }

  updateTrip(trip: Trip): Observable<Trip> {
    const updatedTrip = { ...trip };
    if (!trip.id) {
      return throwError(() => new TripError('Trip ID is not provided', trip));
    }

    const trips = this.fetchTrips();
    const index = this.getTripIndex(trips, updatedTrip.id);
    if (index > -1) {
      Object.assign(trips[index], updatedTrip);
      this.saveTrips(trips);
      return of(updatedTrip);
    } else {
      return throwError(() => new TripError("Trip with provided ID doesn't exist", trip));
    }
  }

  removeTrip(trip: Trip): Observable<Trip> {
    if (!trip.id) {
      return throwError(() => new TripError('Trip ID is not provided', trip));
    }

    const trips = this.fetchTrips();
    const index = this.getTripIndex(trips, trip.id);
    if (index > -1) {
      trips.splice(index, 1);
      this.saveTrips(trips);
      return of(trip);
    } else {
      return throwError(() => new TripError("Trip with provided ID doesn't exist", trip));
    }
  }

  loadTrip(id: string): Observable<Trip> {
    if (!id) {
      return throwError(() => new TripError('Trip ID is not provided'));
    }
    const trips = this.fetchTrips();
    const index = this.getTripIndex(trips, id);
    let trip = null;
    if (index > -1) {
      trip = trips[index];
    } else {
      return throwError(() => new TripError("Trip with provided ID doesn't exist"));
    }

    // artificial delay to improve UX
    return of(trip).pipe(delay(1000));
  }

  saveTrips(trips: Trip[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(trips));
  }

  loadTrips(): Observable<Trip[]> {
    // artificial delay to improve UX
    return of(this.fetchTrips()).pipe(delay(1000));
  }

  private getTripIndex(trips: Trip[], id?: string): number {
    return trips.findIndex((trip: Trip) => trip.id == id);
  }

  private fetchTrips(): Trip[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }
}
