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
    path: 'trip',
    loadChildren: () => import('./trip/trip.routes').then((m) => m.tripRoutes),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
