import { Routes } from '@angular/router';

import { AdminUserComponent } from './components/admin-users/admin-users.component';

export const adminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user',
  },
  {
    path: 'user',
    component: AdminUserComponent,
  },
];
