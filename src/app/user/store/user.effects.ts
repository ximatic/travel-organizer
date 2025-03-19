import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';

import { ProfileService } from '../services/user-profile.service';
import { ActionPropsUserData, ActionPropsUserPassword, ActionPropsUserSettings, UserAction, userActions } from './user.actions';

import { UserData, UserEventMessage, UserInfo } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserSettingsService } from '../services/user-settings.service';
import { UserSettings } from '../models/user-settings.model';

@Injectable()
export class UserEffects {
  loadUserInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.LoadUserInfo),
      exhaustMap(() =>
        this.userService.loadUserInfo().pipe(
          map((userInfo: UserInfo) => userActions.loadUserInfoSuccess({ userInfo })),
          catchError(() => of(userActions.loadUserInfoError({ message: UserEventMessage.LOAD_USER_INFO_ERROR }))),
        ),
      ),
    ),
  );

  updateUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.UpdateUserData),
      exhaustMap((action: ActionPropsUserData) => {
        return this.userService.updateUserData(action.userData).pipe(
          map((userData: UserData) =>
            userActions.updateUserDataSuccess({ userData, message: UserEventMessage.UPDATE_USER_DATA_SUCCESS }),
          ),
          catchError(() => of(userActions.updateUserDataError({ message: UserEventMessage.UPDATE_USER_DATA_ERROR }))),
        );
      }),
    ),
  );

  updateUserPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.UpdateUserPassword),
      exhaustMap((action: ActionPropsUserPassword) => {
        return this.userService.updateUserPassword(action.userPassword).pipe(
          map(() => userActions.updateUserPasswordSuccess({ message: UserEventMessage.UPDATE_USER_PASSWORD_SUCCESS })),
          catchError(() => of(userActions.updateUserPasswordError({ message: UserEventMessage.UPDATE_USER_PASSWORD_ERROR }))),
        );
      }),
    ),
  );

  updateUserSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.UpdateUserSettings),
      exhaustMap((action: ActionPropsUserSettings) => {
        return this.userSettingsService.updateSettings(action.userSettings).pipe(
          map((userSettings: UserSettings) =>
            userActions.updateUserSettingsSuccess({ userSettings, message: UserEventMessage.UPDATE_USER_SETTINGS_SUCCESS }),
          ),
          catchError(() => of(userActions.updateUserSettingsError({ message: UserEventMessage.UPDATE_USER_SETTINGS_ERROR }))),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private userProfileService: ProfileService,
    private userSettingsService: UserSettingsService,
  ) {}
}
