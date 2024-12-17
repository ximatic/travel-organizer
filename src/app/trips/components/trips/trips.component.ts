import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, CardModule],
})
export class TripsComponent {
  trips: Trip[] = [
    {
      id: 'trip-1',
      name: 'Test trip #1',
      description: 'test description for the trip',
    },
    {
      id: 'trip-2',
      name: 'Test trip #2',
    },
    {
      id: 'trip-3',
      name: 'Test trip #3',
    },
  ];

  constructor(private router: Router) {}

  openTrip(trip: Trip): void {
    this.router.navigate([`/trips/${trip.id}`]);
  }
}
