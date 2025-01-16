import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { AuthToken, SignupPayload } from '../model/auth.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageKey = 'x-to-token';

  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string): Observable<AuthToken> {
    return this.httpClient.post(`${environment.authApi}/login`, { email, password }).pipe(
      map((response: object) => response as AuthToken),
      tap((authToken: AuthToken) => {
        this.saveAuthToken(authToken);
      }),
    );
  }

  logout(): Observable<object> {
    return this.httpClient.get(`${environment.authApi}/logout`).pipe(
      tap(() => {
        this.clearAuthToken();
      }),
    );
  }

  verify(): Observable<AuthToken> {
    return this.httpClient.get(`${environment.authApi}/verify`).pipe(
      map((response: object) => response as AuthToken),
      tap((authToken: AuthToken) => {
        this.saveAuthToken(authToken);
      }),
    );
  }

  signup(signupPayload: SignupPayload): Observable<AuthToken> {
    return this.httpClient.post(`${environment.authApi}/signup`, signupPayload).pipe(
      map((response: object) => response as AuthToken),
      tap((authToken: AuthToken) => {
        this.saveAuthToken(authToken);
      }),
    );
  }

  // refresh(): Observable<AuthToken> {
  //   // TODO - attach refresh token if it exists in localStorage
  //   return this.httpClient.get(`${environment.authApi}/refresh`).pipe(
  //     map((response: object) => response as AuthToken),
  //     tap((authToken: AuthToken) => {
  //       this.saveAuthToken(authToken);
  //     }),
  //   );
  // }

  // auth token

  getAuthToken(): AuthToken {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  }

  private saveAuthToken(authToken: AuthToken): void {
    localStorage.setItem(this.storageKey, JSON.stringify(authToken));
  }

  private clearAuthToken(): void {
    localStorage.removeItem(this.storageKey);
  }
}
