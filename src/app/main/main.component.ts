import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { delay, Observable, of, Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';

import { DEFAULT_UX_DELAY } from '../common/constants/common.constants';
import { DEFAULT_USER_SETTINGS } from '../user/constants/settings.constants';

import { AuthToken } from '../auth/model/auth.model';
import { authActions } from '../auth/store/auth.actions';
import { selectAuthEvent, selectAuthToken } from '../auth/store/auth.selectors';
import { AuthEvent, AuthEventName, AuthEventType, AuthState } from '../auth/store/auth.state';

import { userActions } from '../user/store/user.actions';
import { selectUserEvent, selectUserSettings } from '../user/store/user.selectors';
import { UserEvent, UserEventName, UserState } from '../user/store/user.state';

import { UserSettings, UserSettingsLanguage, UserSettingsTheme } from '../user/models/user-settings.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    ButtonModule,
    DividerModule,
    DrawerModule,
    ProgressSpinnerModule,
    ToolbarModule,
  ],
  providers: [TranslateService],
})
export class MainComponent implements OnInit, OnDestroy {
  // ngrx
  authEvent$!: Observable<AuthEvent | undefined>;
  authToken$!: Observable<AuthToken | null>;
  userSettings$!: Observable<UserSettings | null>;
  userEvent$!: Observable<UserEvent | undefined>;

  settings: UserSettings = DEFAULT_USER_SETTINGS;
  darkMode = signal<boolean>(false);
  sidebarVisible = signal<boolean>(false);
  isLoggedIn = signal<boolean>(false);

  language = UserSettingsLanguage;

  // state flag
  isLoading = signal(true);

  // other
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private authStore: Store<AuthState>,
    private userStore: Store<UserState>,
  ) {}

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // toolbar

  toggleSidebar(): void {
    this.sidebarVisible.update((value: boolean) => !value);
  }

  toggleDarkMode(): void {
    const userSettings = { ...this.settings, theme: this.darkMode() ? UserSettingsTheme.Light : UserSettingsTheme.Dark };
    this.userStore.dispatch(userActions.updateUserSettings({ userSettings }));
  }

  logout(): void {
    this.authStore.dispatch(authActions.logout());
  }

  // language

  isLanguageEnglish(): boolean {
    return this.settings.language === UserSettingsLanguage.English;
  }

  isLanguagePolish(): boolean {
    return this.settings.language === UserSettingsLanguage.Polish;
  }

  switchLanguage(language: UserSettingsLanguage): void {
    const userSettings = {
      ...this.settings,
      language,
    };
    this.userStore.dispatch(userActions.updateUserSettings({ userSettings }));
  }

  // initialization

  private init(): void {
    this.initState();
  }

  private initState(): void {
    // settings
    this.userSettings$ = this.userStore.select(selectUserSettings);
    this.subscription.add(
      this.userSettings$.subscribe((userSettings: UserSettings | null) => {
        if (!userSettings) {
          return;
        }
        this.settings = { ...userSettings };
        this.translateService.use(this.settings.language);
        this.darkMode.set(this.settings.theme === UserSettingsTheme.Dark);
        const htmlElement = document.querySelector('html');
        if (this.darkMode()) {
          htmlElement?.classList.add('dark-mode');
        } else {
          htmlElement?.classList.remove('dark-mode');
        }
      }),
    );

    this.userEvent$ = this.userStore.select(selectUserEvent);
    this.subscription.add(
      this.userEvent$.subscribe((userEvent: UserEvent | undefined) => {
        if (userEvent?.name === UserEventName.LoadUserInfo) {
          // artificial delay to improve UX
          of({})
            .pipe(delay(DEFAULT_UX_DELAY))
            .subscribe(() => {
              this.isLoading.set(false);
            });
        }
      }),
    );

    // auth
    this.authToken$ = this.authStore.select(selectAuthToken);
    this.subscription.add(
      this.authToken$.subscribe((authToken: AuthToken | null) => {
        this.isLoggedIn.set(!!authToken);
      }),
    );

    this.authEvent$ = this.authStore.select(selectAuthEvent);
    this.subscription.add(
      this.authEvent$.subscribe((authEvent: AuthEvent | undefined) => {
        if (authEvent?.name === AuthEventName.Logout && authEvent?.type === AuthEventType.Success) {
          this.isLoggedIn.set(false);
          this.router.navigate(['/auth/login']);
        } else if (authEvent?.name === AuthEventName.Login && authEvent?.type === AuthEventType.Success) {
          this.isLoggedIn.set(true);
          this.userStore.dispatch(userActions.loadUserInfo());
        }
      }),
    );
  }
}
