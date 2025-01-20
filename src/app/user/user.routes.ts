import { Routes } from '@angular/router';

import { ProfileComponent } from './components/profile/profile.component';

export const userRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile',
  },
  {
    path: '',
    component: ProfileComponent,
  },
];
