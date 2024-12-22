import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { ToolbarModule } from 'primeng/toolbar';

import { settingsActions } from '../settings/store/settings.actions';
import { selectSettings } from '../settings/store/settings.selectors';
import { SettingsActionState } from '../settings/store/settings.state';

import { DEFAULT_SETTINGS } from '../settings/constants/settings.constants';
import { Settings, SettingsTheme } from '../settings/models/settings.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
  imports: [RouterModule, TranslatePipe, ButtonModule, DividerModule, DrawerModule, ToolbarModule],
})
export class MainComponent implements OnInit, OnDestroy {
  // ngrx
  settings$!: Observable<Settings>;

  settings: Settings = DEFAULT_SETTINGS;
  darkMode = false;
  sidebarVisible = false;

  // other
  private subscription = new Subscription();

  constructor(private store: Store<SettingsActionState>) {}

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
    this.store.dispatch(settingsActions.updateSettings({ settings }));
  }

  // initialization

  private init(): void {
    this.initState();
  }

  private initState(): void {
    this.settings$ = this.store.select(selectSettings);
    this.subscription.add(
      this.settings$.subscribe((settings: Settings) => {
        this.settings = { ...settings };
        this.darkMode = this.settings.theme === SettingsTheme.Dark;
        const htmlElement = document.querySelector('html');
        if (this.darkMode) {
          htmlElement?.classList.add('dark-mode');
        } else {
          htmlElement?.classList.remove('dark-mode');
        }
      }),
    );
  }
}
