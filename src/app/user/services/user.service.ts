import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { UserInfo, UserData, UserPassword } from '../models/user.model';

import { environment } from '../../../environments/environment';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  loadUserInfo(): Observable<UserInfo> {
    return this.httpClient.get(`${environment.authApi}/user/info`).pipe(map((response: object) => response as UserInfo));
  }

  updateUserData(request: UserData): Observable<UserData> {
    return this.httpClient.put(`${environment.authApi}/user/data`, request).pipe(map((response: object) => response as UserData));
  }

  updateUserPassword(request: UserPassword): Observable<object> {
    return this.httpClient.put(`${environment.authApi}/user/password`, request);
  }
}
