import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'trips',
    loadChildren: () => import('./trips/trips.routes').then((m) => m.tripsRoutes),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
