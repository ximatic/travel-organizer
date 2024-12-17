import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';

import { TripsService } from '../../services/trips.service';
import { Trip } from '../../models/trip.model';

import { TripPanelComponent } from '../trip-panel/trip-panel.component';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, CardModule, PanelModule, TripPanelComponent],
  providers: [TripsService],
})
export class TripsComponent {
  trips: Trip[] = [];

  constructor(
    private router: Router,
    private tripsService: TripsService,
  ) {
    this.loadTrips();
  }

  openTrip(trip: Trip): void {
    this.router.navigate([`/trips/${trip.id}`]);
  }

  removeTrip(event: Event, trip: Trip): void {
    event.stopPropagation();
    this.tripsService.deleteTrip(trip);
  }

  private loadTrips(): void {
    this.trips = this.tripsService.loadTrips();
  }
}
