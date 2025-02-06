import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';

import { ProfileService } from '../services/user-profile.service';
import { ActionPropsUser, ActionPropsUserProfile, ActionPropsUserSettings, UserAction, userActions } from './user.actions';

import { UserEventMessage, UserInfo } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserSettingsService } from '../services/user-settings.service';
import { UserSettings } from '../models/user-settings.model';
import { UserProfile } from '../models/user-profile.model';

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

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.UpdateUser),
      exhaustMap((action: ActionPropsUser) => {
        return this.userService.updateUser(action.userRequest).pipe(
          map(() => userActions.updateUserSuccess({ message: UserEventMessage.UPDATE_USER_SUCCESS })),
          catchError(() => of(userActions.updateUserError({ message: UserEventMessage.UPDATE_USER_ERROR }))),
        );
      }),
    ),
  );

  updateUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.UpdateUserProfile),
      exhaustMap((action: ActionPropsUserProfile) => {
        return this.userProfileService.updateProfile(action.userProfile).pipe(
          map((userProfile: UserProfile) => userActions.updateUserProfileSuccess({ userProfile })),
          catchError(() => of(userActions.updateUserProfileError({ message: UserEventMessage.UPDATE_USER_PROFILE_ERROR }))),
        );
      }),
    ),
  );

  updateUserSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.UpdateUserSettings),
      exhaustMap((action: ActionPropsUserSettings) => {
        return this.userSettingsService.updateSettings(action.userSettings).pipe(
          map((userSettings: UserSettings) => userActions.updateUserSettingsSuccess({ userSettings })),
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
