import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';

import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.scss',
  standalone: true,
  imports: [RouterModule, ButtonModule, CardModule, PanelModule],
})
export class TripComponent {
  trip: Trip = {
    id: 'trip-1',
    name: 'Test trip #1',
    description: 'test description for the trip',
  };
}
