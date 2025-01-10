import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';

import { SettingsService } from '../services/settings.service';
import { ActionPropsSettings, SettingsAction, settingsActions } from './settings.actions';

import { Settings, SettingsEventMessage } from '../models/settings.model';

@Injectable()
export class SettingsEffects {
  loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsAction.LoadSettings),
      exhaustMap(() =>
        this.settingsService.getSettings().pipe(
          map((settings: Settings) => settingsActions.loadSettingsSuccess({ settings })),
          catchError(() => of(settingsActions.loadSettingsError({ message: SettingsEventMessage.LOAD_SETTINGS_ERROR }))),
        ),
      ),
    ),
  );

  updateSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsAction.UpdateSettings),
      exhaustMap((action: ActionPropsSettings) =>
        this.settingsService.updateSettings(action.settings).pipe(
          map((settings: Settings) =>
            settingsActions.updateSettingsSuccess({ settings, message: SettingsEventMessage.UPDATE_SETTINGS_SUCCESS }),
          ),
          catchError(() => of(settingsActions.updateSettingsError({ message: SettingsEventMessage.UPDATE_SETTINGS_ERROR }))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private settingsService: SettingsService,
  ) {}
}
