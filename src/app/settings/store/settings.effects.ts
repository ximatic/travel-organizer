import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';

import { SettingsService } from '../services/settings.service';
import { ActionPropsSettings, SettingsAction, settingsActions } from './settings.actions';

import { Settings } from '../models/settings.model';

@Injectable()
export class SettingsEffects {
  loadTrips$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsAction.LoadSettings),
      exhaustMap(() =>
        this.settingsService.loadSettings().pipe(
          map((settings: Settings) => settingsActions.loadSettingsSuccess({ settings, message: `Settings loaded` })),
          catchError(() =>
            of(settingsActions.loadSettingsError({ error: "Can't load settings. Default settings will be used." })),
          ),
        ),
      ),
    ),
  );

  updateTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsAction.UpdateSettings),
      exhaustMap((action: ActionPropsSettings) =>
        this.settingsService.updateSettings(action.settings).pipe(
          map((settings: Settings) => settingsActions.updateSettingsSuccess({ settings, message: `Settings updated` })),
          catchError(() => of(settingsActions.updateSettingsError({ error: `Can't update settings. Please try again later.` }))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private settingsService: SettingsService,
  ) {}
}
