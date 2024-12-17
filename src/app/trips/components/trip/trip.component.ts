import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';

import { TripsService } from '../../services/trips.service';
import { Trip } from '../../models/trip.model';

import { TripPanelComponent } from '../trip-panel/trip-panel.component';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, CardModule, PanelModule, TripPanelComponent],
  providers: [TripsService],
})
export class TripComponent implements OnInit, OnDestroy {
  trip!: Trip | null;

  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private tripsService: TripsService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        this.trip = this.tripsService.loadTrip(params['id']);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
