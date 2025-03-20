import { Routes } from '@angular/router';

import { TripComponent } from './components/trip/trip.component';
import { TripFormComponent } from './components/trip-form/trip-form.component';
import { TripsComponent } from './components/trips/trips.component';

export const tripsRoutes: Routes = [
  {
    path: '',
    component: TripsComponent,
  },
  {
    path: 'add',
    component: TripFormComponent,
  },
  {
    path: 'update/:id',
    component: TripFormComponent,
  },
  {
    path: ':id',
    component: TripComponent,
  },
];
