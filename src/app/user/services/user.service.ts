import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { UserInfo, UserRequest } from '../models/user.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  loadUserInfo(): Observable<UserInfo> {
    return this.httpClient.get(`${environment.authApi}/user/info`).pipe(map((response: object) => response as UserInfo));
  }

  updateUser(request: UserRequest): Observable<object> {
    return this.httpClient.put(`${environment.authApi}/user`, request);
  }
}
