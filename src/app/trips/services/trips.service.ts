/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { Trip, TripItem } from '../models/trip.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TripsService {
  constructor(private httpClient: HttpClient) {}

  // trip

  loadTrips(): Observable<Trip[]> {
    return this.httpClient.get(`${environment.tripsApi}`).pipe(map((response: any) => response as Trip[]));
  }

  loadTrip(id: string): Observable<Trip> {
    return this.httpClient.get(`${environment.tripsApi}/${id}`).pipe(map((response: any) => response as Trip));
  }

  createTrip(trip: Trip): Observable<Trip> {
    return this.httpClient.post(`${environment.tripsApi}`, trip).pipe(map((response: any) => response as Trip));
  }

  updateTrip(trip: Trip): Observable<Trip> {
    return this.httpClient.put(`${environment.tripsApi}/${trip._id}`, trip).pipe(map((response: any) => response as Trip));
  }

  removeTrip(trip: Trip): Observable<Trip> {
    return this.httpClient.delete(`${environment.tripsApi}/${trip._id}`).pipe(map((response: any) => response as Trip));
  }

  // trip items

  createTripItem(trip: Trip, tripItem: TripItem): Observable<Trip> {
    return this.httpClient
      .post(`${environment.tripsApi}/${trip._id}/item`, tripItem)
      .pipe(map((response: any) => response as Trip));
  }

  checkTripItem(trip: Trip, tripItem: TripItem): Observable<Trip> {
    return this.httpClient
      .put(`${environment.tripsApi}/${trip._id}/item/${tripItem._id}`, { ...tripItem, checked: !tripItem.checked })
      .pipe(map((response: any) => response as Trip));
  }

  removeTripItem(trip: Trip, tripItem: TripItem): Observable<Trip> {
    return this.httpClient
      .delete(`${environment.tripsApi}/${trip._id}/item/${tripItem._id}`)
      .pipe(map((response: any) => response as Trip));
  }
}
