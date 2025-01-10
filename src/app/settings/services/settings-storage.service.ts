import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { SettingsService } from './settings.service';

import { DEFAULT_SETTINGS } from '../constants/settings.constants';

import { Settings } from '../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsStorageService extends SettingsService {
  private storageKey = 'to-settings';

  getSettings(): Observable<Settings> {
    return of(this.loadSettings());
  }

  updateSettings(settings: Settings): Observable<Settings> {
    this.saveSettings(settings);
    return of(settings);
  }

  private saveSettings(settings: Settings): void {
    localStorage.setItem(this.storageKey, JSON.stringify(settings));
  }

  private loadSettings(): Settings {
    return JSON.parse(localStorage.getItem(this.storageKey) || JSON.stringify(DEFAULT_SETTINGS));
  }
}
