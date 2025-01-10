import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, Observable, of, tap } from 'rxjs';

import { SettingsService } from './settings.service';

import { DEFAULT_SETTINGS } from '../constants/settings.constants';

import { Settings } from '../models/settings.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsHttpService extends SettingsService {
  private storageKey = 'to-settings-id';

  constructor(private httpClient: HttpClient) {
    super();
  }

  getSettings(): Observable<Settings> {
    return this.httpClient.get(this.getSettingsUrl()).pipe(
      map((response: object) => response as Settings),
      tap((settings: Settings) => {
        this.saveSettingsId(settings);
      }),
      catchError(() => of(DEFAULT_SETTINGS)),
    );
  }

  updateSettings(settings: Settings): Observable<Settings> {
    if (this.getSettingsId()) {
      // update settings if settings ID is provided
      return this.httpClient.put(this.getSettingsUrl(), settings).pipe(
        map((response: object) => response as Settings),
        tap((settings: Settings) => {
          this.saveSettingsId(settings);
        }),
      );
    } else {
      // create settings instead if settings ID is not provided
      return this.httpClient.post(this.getSettingsUrl(), settings).pipe(
        map((response: object) => response as Settings),
        tap((settings: Settings) => {
          this.saveSettingsId(settings);
        }),
      );
    }
  }

  private saveSettingsId(settings: Settings): void {
    if (!settings._id) {
      return;
    }

    localStorage.setItem(this.storageKey, settings._id);
  }

  private getSettingsUrl() {
    const id = this.getSettingsId();
    return id ? `${environment.settingsApi}/${id}` : environment.settingsApi;
  }

  private getSettingsId(): string {
    return localStorage.getItem(this.storageKey) || '';
  }
}
