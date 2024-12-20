import { Routes } from '@angular/router';

import { provideEffects } from '@ngrx/effects';

import { TripsEffects } from './trips/store/trips.effects';
import { TripsService } from './trips/services/trips.service';

import { SettingsEffects } from './settings/store/settings.effects';
import { SettingsService } from './settings/services/settings.service';

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
    providers: [provideEffects([TripsEffects]), TripsService],
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.routes').then((m) => m.settingsRoutes),
    providers: [provideEffects([SettingsEffects]), SettingsService],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
