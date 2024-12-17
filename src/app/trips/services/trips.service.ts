import { Injectable } from '@angular/core';

import * as uuid from 'uuid';

import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root',
})
export class TripsService {
  private storageKey = 'to-trips';

  private trips: Trip[] = [];

  constructor() {
    this.loadTrips();
  }

  createTrip(trip: Trip): Trip {
    if (!trip.id) {
      trip.id = uuid.v4();
    }
    this.trips.push(trip);
    this.saveTrips();

    return trip;
  }

  updateTrip(trip: Trip): void {
    if (!trip.id) {
      return;
    }

    const index = this.getTripIndex(trip.id);
    if (index > -1) {
      Object.assign(this.trips[index], trip);
      this.saveTrips();
    }
  }

  deleteTrip(trip: Trip): void {
    if (!trip.id) {
      return;
    }

    const index = this.getTripIndex(trip.id);
    if (index > -1) {
      this.trips.splice(index, 1);
      this.saveTrips();
    }
  }

  loadTrip(id?: string): Trip | null {
    const index = this.getTripIndex(id);
    let trip = null;
    if (index > -1) {
      trip = this.trips[index];
    }

    return trip;
  }

  saveTrips(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.trips));
  }

  loadTrips(): Trip[] {
    this.trips = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return this.trips;
  }

  private getTripIndex(id?: string): number {
    return this.trips.findIndex((trip: Trip) => trip.id == id);
  }
}
