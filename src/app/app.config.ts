import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { take } from 'rxjs';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { SettingsService } from './settings/services/settings.service';
import { Settings, SettingsTheme } from './settings/models/settings.model';

import { settingsActions } from './settings/store/settings.actions';
import { SettingsEffects } from './settings/store/settings.effects';

import { selectSettings } from './settings/store/settings.selectors';
import { SettingsActionState } from './settings/store/settings.state';

import { tripsReducer } from './trips/store/trips.reducer';
import { settingsReducer } from './settings/store/settings.reducer';

import { routes } from './app.routes';

export function initializeApplication(store: Store<SettingsActionState>) {
  return () =>
    new Promise<boolean>((resolve) => {
      store.dispatch(settingsActions.loadSettings());
      store
        .select(selectSettings)
        .pipe(take(1))
        .subscribe((settings: Settings) => {
          const htmlElement = document.querySelector('html');
          if (htmlElement) {
            htmlElement.setAttribute('lang', settings.language);

            if (settings.theme === SettingsTheme.Dark) {
              htmlElement?.classList.add('dark-mode');
            }
          }
          resolve(true);
        });
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideEffects([SettingsEffects]),
    provideStore({
      trips: tripsReducer,
      settings: settingsReducer,
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApplication,
      multi: true,
      deps: [Store<SettingsActionState>],
    },
    SettingsService, // required for SettingsEffects
  ],
};
