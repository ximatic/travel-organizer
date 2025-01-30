import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, Observable, of } from 'rxjs';

import { DEFAULT_USER_SETTINGS } from '../constants/settings.constants';

import { UserSettings } from '../models/user-settings.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(private httpClient: HttpClient) {}

  loadSettings(): Observable<UserSettings> {
    return this.httpClient.get(`${environment.authApi}/user/settings`).pipe(
      map((response: object) => response as UserSettings),
      catchError(() => of(DEFAULT_USER_SETTINGS)),
    );
  }

  updateSettings(settings: UserSettings): Observable<UserSettings> {
    return this.httpClient
      .put(`${environment.authApi}/user/settings`, settings)
      .pipe(map((response: object) => response as UserSettings));
  }
}
