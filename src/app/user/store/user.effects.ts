import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';

import { ProfileService } from '../services/profile.service';
import { ActionPropsUser, UserAction, userActions } from './user.actions';

import { UserProfile, UserEventMessage } from '../models/user.model';

@Injectable()
export class UserEffects {
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.LoadUser),
      exhaustMap(() =>
        this.profileService.loadProfile().pipe(
          map((profile: UserProfile) => userActions.loadUserSuccess({ profile })),
          catchError(() => of(userActions.loadUserError({ message: UserEventMessage.LOAD_USER_ERROR }))),
        ),
      ),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.UpdateUser),
      exhaustMap((action: ActionPropsUser) => {
        console.log(action);
        return this.profileService.updateProfile(action.profile).pipe(
          map((profile: UserProfile) =>
            userActions.updateUserSuccess({ profile, message: UserEventMessage.UPDATE_USER_SUCCESS }),
          ),
          catchError(() => of(userActions.updateUserError({ message: UserEventMessage.UPDATE_USER_ERROR }))),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private profileService: ProfileService,
  ) {}
}
