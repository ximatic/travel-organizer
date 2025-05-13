import { Routes } from '@angular/router';

import { provideEffects } from '@ngrx/effects';

import { AuthGuard } from './auth/utils/auth.guard';
import { AuthRoleGuard } from './auth/utils/auth-role.guard';

import { AuthEffects } from './auth/store/auth.effects';
import { AuthService } from './auth/services/auth.service';

import { TripsEffects } from './trips/store/trips.effects';
import { TripsService } from './trips/services/trips.service';

import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
    providers: [provideEffects([AuthEffects]), AuthService],
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    loadChildren: () => import('./user/user.routes').then((m) => m.userRoutes),
  },
  {
    path: 'trips',
    canActivate: [AuthGuard],
    loadChildren: () => import('./trips/trips.routes').then((m) => m.tripsRoutes),
    providers: [provideEffects([TripsEffects]), TripsService],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AuthRoleGuard],
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
