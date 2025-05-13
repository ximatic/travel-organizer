import { signal } from '@angular/core';

import { AdminUser } from '../../src/app/admin/models/admin-user.model';

import { AdminEvent } from '../../src/app/admin/store/admin.store';

export const AdminStoreMock = {
  // state
  users: signal<AdminUser[] | null>([]),
  event: signal<AdminUser | null>(null),
  ev: signal<AdminEvent | null>(null),
  // computed state
  usersCount: signal<number>(1),
  // methods
  loadUsers: jest.fn(),
};
