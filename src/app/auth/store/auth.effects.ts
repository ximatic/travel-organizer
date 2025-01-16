import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { AuthAction, authActions } from './auth.actions';

import { AuthEventMessage, AuthToken, LoginPayload, SignupPayload } from '../model/auth.model';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.Login),
      exhaustMap((payload: LoginPayload) =>
        this.authService.login(payload.email, payload.password).pipe(
          map((authToken: AuthToken) => authActions.loginSuccess({ authToken })),
          catchError(() => of(authActions.loginError({ message: AuthEventMessage.LOGIN_ERROR }))),
        ),
      ),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.Logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => authActions.logoutSuccess()),
          catchError(() => of(authActions.logoutError({ message: AuthEventMessage.LOGOUT_ERROR }))),
        ),
      ),
    ),
  );

  verify$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.Verify),
      exhaustMap(() =>
        this.authService.verify().pipe(
          map((authToken: AuthToken) => authActions.verifySuccess({ authToken })),
          catchError(() => of(authActions.verifyError({ message: AuthEventMessage.VERIFY_ERROR }))),
        ),
      ),
    ),
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.Signup),
      exhaustMap((payload: SignupPayload) =>
        this.authService.signup(payload).pipe(
          map((authToken: AuthToken) => authActions.signupSuccess({ authToken })),
          catchError(() => of(authActions.signupError({ message: AuthEventMessage.SIGNUP_ERROR }))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
  ) {}
}
