import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { UserProfile } from '../models/user-profile.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  loadProfile(): Observable<UserProfile> {
    return this.httpClient.get(`${environment.authApi}/user/profile`).pipe(map((response: object) => response as UserProfile));
  }

  updateProfile(profile: UserProfile): Observable<UserProfile> {
    return this.httpClient
      .put(`${environment.authApi}/user/profile`, profile)
      .pipe(map((response: object) => response as UserProfile));
  }
}
