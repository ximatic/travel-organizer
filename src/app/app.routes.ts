import { Routes } from '@angular/router';

import { provideEffects } from '@ngrx/effects';

import { AuthGuard } from './auth/utils/auth.guard';
import { AuthEffects } from './auth/store/auth.effects';
import { AuthService } from './auth/services/auth.service';

import { TripsEffects } from './trips/store/trips.effects';
import { TripsService } from './trips/services/trips.service';
import { TripsHttpService } from './trips/services/trips-http.service';
import { TripsStorageService } from './trips/services/trips-storage.service';

import { SettingsEffects } from './settings/store/settings.effects';
import { SettingsService } from './settings/services/settings.service';
import { SettingsHttpService } from './settings/services/settings-http.service';
import { SettingsStorageService } from './settings/services/settings-storage.service';

import { DashboardComponent } from './dashboard/dashboard.component';

import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
    providers: [provideEffects([AuthEffects]), AuthService],
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./user/user.routes').then((m) => m.userRoutes),
  },
  {
    path: 'trips',
    canActivate: [AuthGuard],
    loadChildren: () => import('./trips/trips.routes').then((m) => m.tripsRoutes),
    providers: [
      provideEffects([TripsEffects]),
      { provide: TripsService, useClass: environment.storageMethod === 'http' ? TripsHttpService : TripsStorageService },
    ],
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./settings/settings.routes').then((m) => m.settingsRoutes),
    providers: [
      provideEffects([SettingsEffects]),
      { provide: SettingsService, useClass: environment.storageMethod === 'http' ? SettingsHttpService : SettingsStorageService },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
