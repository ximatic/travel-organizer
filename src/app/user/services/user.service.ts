import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { UserInfo, UserData, UserPassword } from '../models/user.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  loadUserInfo(): Observable<UserInfo> {
    return this.httpClient.get(`${environment.userApi}/info`).pipe(map((response: object) => response as UserInfo));
  }

  updateUserData(request: UserData): Observable<UserData> {
    return this.httpClient.put(`${environment.userApi}/data`, request).pipe(map((response: object) => response as UserData));
  }

  updateUserPassword(request: UserPassword): Observable<object> {
    return this.httpClient.put(`${environment.userApi}/password`, request);
  }
}
