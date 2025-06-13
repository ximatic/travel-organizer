import { Routes } from '@angular/router';

import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';

export const adminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user',
  },
  {
    path: 'user',
    component: AdminUsersComponent,
  },
  {
    path: 'user/add',
    component: AdminUserComponent,
  },
  {
    path: 'user/edit/:id',
    component: AdminUserComponent,
  },
  {
    path: '**',
    redirectTo: '/admin/user',
  },
];
