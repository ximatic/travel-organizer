import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Settings } from '../models/settings.model';
import { DEFAULT_SETTINGS } from '../constants/settings.constants';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private storageKey = 'to-settings';

  updateSettings(settings: Settings): Observable<Settings> {
    this.saveSettings(settings);
    return of(settings);
  }

  loadSettings(): Observable<Settings> {
    return of(this.fetchTrips());
  }

  private saveSettings(settings: Settings): void {
    localStorage.setItem(this.storageKey, JSON.stringify(settings));
  }

  private fetchTrips(): Settings {
    return JSON.parse(localStorage.getItem(this.storageKey) || JSON.stringify(DEFAULT_SETTINGS));
  }
}
