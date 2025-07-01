import { Routes } from '@angular/router';

import { TripComponent } from './components/trip/trip.component';
import { TripFormComponent } from './components/trip-form/trip-form.component';
import { TripListComponent } from './components/trip-list/trip-list.component';

export const tripsRoutes: Routes = [
  {
    path: '',
    component: TripListComponent,
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
