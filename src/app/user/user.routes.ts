import { Routes } from '@angular/router';

import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';

export const userRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile',
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
];
