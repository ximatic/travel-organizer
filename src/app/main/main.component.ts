import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { delay, Observable, of, Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';

import { AuthEvent, AuthEventName, AuthEventType, AuthState } from '../auth/store/auth.state';

import { settingsActions } from '../settings/store/settings.actions';
import { selectSettings, selectSettingsEvent } from '../settings/store/settings.selectors';
import { SettingsEvent, SettingsEventName, SettingsState } from '../settings/store/settings.state';

import { authActions } from '../auth/store/auth.actions';
import { selectAuthEvent } from '../auth/store/auth.selectors';

import { DEFAULT_UX_DELAY } from '../common/constants/common.constants';
import { DEFAULT_SETTINGS } from '../settings/constants/settings.constants';

import { Settings, SettingsLanguage, SettingsTheme } from '../settings/models/settings.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
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
  settings$!: Observable<Settings>;
  settingsEvent$!: Observable<SettingsEvent | undefined>;
  authEvent$!: Observable<AuthEvent | undefined>;

  settings: Settings = DEFAULT_SETTINGS;
  darkMode = false;
  sidebarVisible = false;

  language = SettingsLanguage;

  // state flag
  isLoading = true;

  // other
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private authStore: Store<AuthState>,
    private settingsStore: Store<SettingsState>,
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
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleDarkMode(): void {
    const settings = { ...this.settings, theme: this.darkMode ? SettingsTheme.Light : SettingsTheme.Dark };
    this.settingsStore.dispatch(settingsActions.updateSettings({ settings }));
  }

  logout(): void {
    this.authStore.dispatch(authActions.logout());
  }

  // language

  isLanguageEnglish(): boolean {
    return this.settings.language === SettingsLanguage.English;
  }

  isLanguagePolish(): boolean {
    return this.settings.language === SettingsLanguage.Polish;
  }

  switchLanguage(language: SettingsLanguage): void {
    const settings = {
      ...this.settings,
      language,
    };
    this.settingsStore.dispatch(settingsActions.updateSettings({ settings }));
  }

  // initialization

  private init(): void {
    this.initState();
  }

  private initState(): void {
    // settings
    this.settings$ = this.settingsStore.select(selectSettings);
    this.subscription.add(
      this.settings$.subscribe((settings: Settings) => {
        this.settings = { ...settings };
        this.translateService.use(this.settings.language);
        this.darkMode = this.settings.theme === SettingsTheme.Dark;
        const htmlElement = document.querySelector('html');
        if (this.darkMode) {
          htmlElement?.classList.add('dark-mode');
        } else {
          htmlElement?.classList.remove('dark-mode');
        }
      }),
    );

    this.settingsEvent$ = this.settingsStore.select(selectSettingsEvent);
    this.subscription.add(
      this.settingsEvent$.subscribe((settingsEvent: SettingsEvent | undefined) => {
        if (settingsEvent?.name === SettingsEventName.Load) {
          // artificial delay to improve UX
          of({})
            .pipe(delay(DEFAULT_UX_DELAY))
            .subscribe(() => {
              this.isLoading = false;
            });
        }
      }),
    );

    // auth
    this.authEvent$ = this.authStore.select(selectAuthEvent);
    this.subscription.add(
      this.authEvent$.subscribe((authEvent: AuthEvent | undefined) => {
        if (authEvent?.name === AuthEventName.Logout && authEvent?.type === AuthEventType.Success) {
          this.router.navigate(['/auth/login']);
        }
      }),
    );
  }
}
