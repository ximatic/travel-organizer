import { Routes } from '@angular/router';

import { provideEffects } from '@ngrx/effects';

import { TripsEffects } from './trips/store/trips.effects';
import { TripsService } from './trips/services/trips.service';
import { TripsHttpService } from './trips/services/trips-http.service';

import { SettingsEffects } from './settings/store/settings.effects';
import { SettingsService } from './settings/services/settings.service';

import { DashboardComponent } from './dashboard/dashboard.component';
import { environment } from '../environments/environment';
import { TripsStorageService } from './trips/services/trips-storage.service';

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
    providers: [
      provideEffects([TripsEffects]),
      { provide: TripsService, useClass: environment.storageMethod === 'http' ? TripsHttpService : TripsStorageService },
    ],
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
