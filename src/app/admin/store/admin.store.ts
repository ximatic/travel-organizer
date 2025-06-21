import { computed, inject } from '@angular/core';

import { tapResponse } from '@ngrx/operators';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { catchError, EMPTY, of, pipe, switchMap, tap } from 'rxjs';

import { AdminService } from '../services/admin.service';

import { AdminUser, CreateAdminUserPayload, UpdateAdminUserPayload } from '../models/admin-user.model';

export enum AdminEventMessage {
  LOAD_USERS_ERROR = 'LOAD_USERS_ERROR',
  LOAD_USER_ERROR = 'LOAD_USER_ERROR',
  CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS',
  CREATE_USER_ERROR = 'CREATE_USER_ERROR',
  UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS',
  UPDATE_USER_ERROR = 'UPDATE_USER_ERROR',
  DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS',
  DELETE_USER_ERROR = 'DELETE_USER_ERROR',
}

export enum AdminEventName {
  LoadAll = 'load-users',
  Load = 'load-user',
  Create = 'create-user',
  Update = 'update-user',
  Delete = 'remove-user',
}

export enum AdminEventType {
  Processing = 'processing',
  Success = 'success',
  Error = 'error',
}

export interface AdminEvent {
  name: AdminEventName;
  type: AdminEventType;
  message?: string;
  user?: AdminUser;
}

export interface AdminState {
  users: AdminUser[] | null;
  event: AdminEvent | null;
}

export interface AdminUserUpdateProps {
  id: string;
  payload: UpdateAdminUserPayload;
}

export const initialState: AdminState = {
  users: null,
  event: null,
};

export const AdminStore = signalStore(
  { providedIn: 'root' },
  withState<AdminState>(initialState),
  withComputed(({ users }) => ({
    usersCount: computed(() => (users() || []).length),
  })),
  withMethods((store, adminService = inject(AdminService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, {
            event: {
              name: AdminEventName.LoadAll,
              type: AdminEventType.Processing,
            },
          }),
        ),
        switchMap(() => adminService.loadUsers()),
        tap({
          next: (users: AdminUser[]) =>
            patchState(store, {
              users,
              event: {
                name: AdminEventName.LoadAll,
                type: AdminEventType.Success,
              },
            }),
          error: () =>
            patchState(store, {
              event: {
                name: AdminEventName.LoadAll,
                type: AdminEventType.Error,
                message: AdminEventMessage.LOAD_USERS_ERROR,
              },
            }),
        }),
      ),
    ),
    loadUser: rxMethod<string>(
      pipe(
        tap(() =>
          patchState(store, {
            event: {
              name: AdminEventName.Load,
              type: AdminEventType.Processing,
            },
          }),
        ),
        switchMap((id: string) => adminService.loadUser(id)),
        tap({
          next: (user: AdminUser) =>
            patchState(store, {
              event: {
                name: AdminEventName.Load,
                type: AdminEventType.Success,
                user,
              },
            }),
          error: () =>
            patchState(store, {
              event: {
                name: AdminEventName.Load,
                type: AdminEventType.Error,
                message: AdminEventMessage.LOAD_USER_ERROR,
              },
            }),
        }),
      ),
    ),
    createUser: rxMethod<CreateAdminUserPayload>(
      pipe(
        tap(() => {
          patchState(store, {
            event: {
              name: AdminEventName.Create,
              type: AdminEventType.Processing,
            },
          });
        }),
        switchMap((payload: CreateAdminUserPayload) =>
          adminService.createUser(payload).pipe(
            tapResponse({
              next: (user: AdminUser) =>
                patchState(store, {
                  users: [...(store.users() || []), user],
                  event: {
                    name: AdminEventName.Create,
                    type: AdminEventType.Success,
                    message: AdminEventMessage.CREATE_USER_SUCCESS,
                    user,
                  },
                }),
              error: () =>
                patchState(store, {
                  event: {
                    name: AdminEventName.Create,
                    type: AdminEventType.Error,
                    message: AdminEventMessage.CREATE_USER_ERROR,
                  },
                }),
            }),
            catchError((error) => of(error)),
          ),
        ),
      ),
    ),
    updateUser: rxMethod<AdminUserUpdateProps>(
      pipe(
        tap(() => {
          patchState(store, {
            event: {
              name: AdminEventName.Update,
              type: AdminEventType.Processing,
            },
          });
        }),
        switchMap((props: AdminUserUpdateProps) =>
          adminService.updateUser(props.id, props.payload).pipe(
            tapResponse({
              next: (user: AdminUser) =>
                patchState(store, {
                  users: (store.users() || []).map((u: AdminUser) => (user.id === u.id ? user : u)),
                  event: {
                    name: AdminEventName.Update,
                    type: AdminEventType.Success,
                    message: AdminEventMessage.UPDATE_USER_SUCCESS,
                    user,
                  },
                }),
              error: () =>
                patchState(store, {
                  event: {
                    name: AdminEventName.Update,
                    type: AdminEventType.Error,
                    message: AdminEventMessage.UPDATE_USER_ERROR,
                  },
                }),
            }),
            catchError((error) => of(error)),
          ),
        ),
      ),
    ),
  })),
);
