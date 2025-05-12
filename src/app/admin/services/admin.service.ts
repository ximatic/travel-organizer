import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { AdminUser, CreateAdminUserPayload, UpdateAdminUserPayload } from '../models/admin-user.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpClient: HttpClient) {}

  // users

  loadUsers(): Observable<AdminUser[]> {
    return this.httpClient.get(`${environment.userAdminApi}`).pipe(map((response: object) => response as AdminUser[]));
  }

  loadUser(id: string): Observable<AdminUser> {
    return this.httpClient.get(`${environment.userAdminApi}/${id}`).pipe(map((response: object) => response as AdminUser));
  }

  createUser(createAdminUserPayload: CreateAdminUserPayload): Observable<AdminUser> {
    return this.httpClient
      .post(`${environment.userAdminApi}`, createAdminUserPayload)
      .pipe(map((response: object) => response as AdminUser));
  }

  updateUser(id: string, updateAdminUserPayload: UpdateAdminUserPayload): Observable<AdminUser> {
    return this.httpClient
      .put(`${environment.userAdminApi}/${id}`, updateAdminUserPayload)
      .pipe(map((response: object) => response as AdminUser));
  }

  deleteUser(id: string): Observable<object> {
    return this.httpClient.delete(`${environment.userAdminApi}/${id}`);
  }
}
