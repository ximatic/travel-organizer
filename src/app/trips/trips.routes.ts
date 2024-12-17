import { Routes } from '@angular/router';

import { TripComponent } from './components/trip/trip.component';
import { TripAddComponent } from './components/trip-add/trip-add.component';
import { TripsComponent } from './components/trips/trips.component';

export const tripsRoutes: Routes = [
  {
    path: '',
    component: TripsComponent,
  },
  {
    path: 'add',
    component: TripAddComponent,
  },
  {
    path: ':id',
    component: TripComponent,
  },
];
