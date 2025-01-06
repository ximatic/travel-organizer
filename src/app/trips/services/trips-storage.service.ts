import { Injectable } from '@angular/core';

import { delay, Observable, of, throwError } from 'rxjs';
import * as uuid from 'uuid';

import { DEFAULT_UX_DELAY } from '../../common/constants/common.constants';

import { TripsService } from './trips.service';

import { Trip, TripError, TripItem } from '../models/trip.model';

@Injectable({
  providedIn: 'root',
})
export class TripsStorageService extends TripsService {
  private storageKey = 'to-trips';

  // trip

  loadTrips(): Observable<Trip[]> {
    // artificial delay to improve UX
    return of(this.fetchTrips()).pipe(delay(DEFAULT_UX_DELAY));
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
    return of(trip).pipe(delay(DEFAULT_UX_DELAY));
  }

  createTrip(trip: Trip): Observable<Trip> {
    const newTrip = { ...trip };
    if (!newTrip._id) {
      newTrip._id = uuid.v4();
    }

    const trips = this.fetchTrips();
    trips.push(newTrip);
    this.saveTrips(trips);

    return of(newTrip);
  }

  updateTrip(trip: Trip): Observable<Trip> {
    const updatedTrip = { ...trip };
    if (!trip._id) {
      return throwError(() => new TripError('Trip ID is not provided', trip));
    }

    const trips = this.fetchTrips();
    const index = this.getTripIndex(trips, updatedTrip._id);
    if (index > -1) {
      Object.assign(trips[index], updatedTrip);
      this.saveTrips(trips);
      return of(updatedTrip);
    } else {
      return throwError(() => new TripError("Trip with provided ID doesn't exist", trip));
    }
  }

  removeTrip(trip: Trip): Observable<Trip> {
    if (!trip._id) {
      return throwError(() => new TripError('Trip ID is not provided', trip));
    }

    const trips = this.fetchTrips();
    const index = this.getTripIndex(trips, trip._id);
    if (index > -1) {
      trips.splice(index, 1);
      this.saveTrips(trips);
      return of(trip);
    } else {
      return throwError(() => new TripError("Trip with provided ID doesn't exist", trip));
    }
  }

  // trip items

  createTripItem(trip: Trip, tripItem: TripItem): Observable<Trip> {
    const updatedTrip = { ...trip };
    const newTripItem = { ...tripItem };
    if (!newTripItem._id) {
      newTripItem._id = uuid.v4();
    }

    if (!updatedTrip.items) {
      updatedTrip.items = [];
    } else {
      updatedTrip.items = [...(trip.items as TripItem[])];
    }
    updatedTrip.items.push(newTripItem);

    return this.updateTrip(updatedTrip);
  }

  checkTripItem(trip: Trip, tripItem: TripItem): Observable<Trip> {
    const updatedTrip = { ...trip };
    const updatedTripItem = { ...tripItem };

    updatedTripItem.checked = !updatedTripItem.checked;
    updatedTrip.items = [...(trip.items as TripItem[])];

    const index = this.getTripItemIndex(updatedTrip.items, tripItem._id);
    if (index > -1) {
      updatedTrip.items[index] = updatedTripItem;
      return this.updateTrip(updatedTrip);
    } else {
      return throwError(() => new TripError("Trip Item with provided ID doesn't exist"));
    }
  }

  removeTripItem(trip: Trip, tripItem: TripItem): Observable<Trip> {
    if (!tripItem._id) {
      return throwError(() => new TripError('Trip Item ID is not provided'));
    }

    const updatedTrip = { ...trip, items: [...(trip.items as TripItem[])] };
    const index = this.getTripItemIndex(updatedTrip.items, tripItem._id);
    if (index > -1) {
      updatedTrip.items.splice(index, 1);
      return this.updateTrip(updatedTrip);
    } else {
      return throwError(() => new TripError("Trip Item with provided ID doesn't exist"));
    }
  }

  // base

  private saveTrips(trips: Trip[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(trips));
  }

  private getTripItemIndex(tripItems: TripItem[], id?: string): number {
    return tripItems.findIndex((tripItem: TripItem) => tripItem._id == id);
  }

  private getTripIndex(trips: Trip[], id?: string): number {
    return trips.findIndex((trip: Trip) => trip._id == id);
  }

  private fetchTrips(): Trip[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }
}
