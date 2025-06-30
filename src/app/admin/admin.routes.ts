import { Routes } from '@angular/router';

import { AdminUserListComponent } from './components/admin-user-list/admin-user-list.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';

export const adminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user',
  },
  {
    path: 'user',
    component: AdminUserListComponent,
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
