import { provideHttpClient, HttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { forkJoin, Subject, take, takeUntil, tap } from 'rxjs';

import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { DEFAULT_USER_LANGUAGE, DEFAULT_USER_SETTINGS } from './user/constants/settings.constants';

import { authInterceptor } from './auth/utils/auth.interceptor';

import { AuthService } from './auth/services/auth.service';

import { authActions } from './auth/store/auth.actions';
import { AuthEffects } from './auth/store/auth.effects';
import { selectAuthEvent } from './auth/store/auth.selectors';
import { AuthEvent, AuthEventName, AuthEventType, AuthState } from './auth/store/auth.state';

import { UserSettings, UserSettingsTheme } from './user/models/user-settings.model';
import { userActions } from './user/store/user.actions';
import { UserEffects } from './user/store/user.effects';
import { selectUserEvent, selectUserSettings } from './user/store/user.selectors';
import { UserEvent, UserEventName, UserEventType, UserState } from './user/store/user.state';

import { authReducer } from './auth/store/auth.reducer';
import { userReducer } from './user/store/user.reducer';
import { tripsReducer } from './trips/store/trips.reducer';

import { routes } from './app.routes';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

function initializeApplication(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const authStore = inject(Store<AuthState>);
    const userStore = inject(Store<UserState>);
    const translateService = inject(TranslateService);

    authStore.dispatch(authActions.verify());
    userStore.dispatch(userActions.loadUserInfo());

    const authVerify$ = new Subject<void>();
    const authEvent$ = authStore.select(selectAuthEvent).pipe(
      takeUntil(authVerify$),
      tap((authEvent: AuthEvent | undefined) => {
        if (authEvent?.name === AuthEventName.Verify && authEvent?.type !== AuthEventType.Loading) {
          authVerify$.next();
          authVerify$.complete();
        }
      }),
    );

    const userVerify$ = new Subject<void>();
    const user$ = userStore.select(selectUserEvent).pipe(
      takeUntil(userVerify$),
      tap((userEvent: UserEvent | undefined) => {
        if (userEvent?.name === UserEventName.LoadUserInfo && userEvent?.type !== UserEventType.Processing) {
          userVerify$.next();
          userVerify$.complete();
        }
      }),
    );

    const userSettings$ = userStore.select(selectUserSettings).pipe(
      take(1),
      tap((userSettings: UserSettings | null) => {
        if (!userSettings) {
          userSettings = DEFAULT_USER_SETTINGS;
        }

        const htmlElement = document.querySelector('html');
        if (htmlElement) {
          htmlElement.setAttribute('lang', userSettings.language);
          translateService.use(userSettings.language);

          if (userSettings.theme === UserSettingsTheme.Dark) {
            htmlElement?.classList.add('dark-mode');
          }
        }
      }),
    );

    forkJoin([authEvent$, user$, userSettings$]).subscribe(() => {
      resolve(true);
    });
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAppInitializer(initializeApplication),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideAnimationsAsync(),
    // ngx-translate
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: DEFAULT_USER_LANGUAGE,
      useDefaultLang: true,
    }),
    // NgRx
    provideEffects([AuthEffects, UserEffects]),
    provideStore({
      auth: authReducer,
      user: userReducer,
      trips: tripsReducer,
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    // PrimeNG
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
    // other
    AuthService,
    MessageService,
  ],
};
