import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';

import { selectAuthToken } from '../store/auth.selectors';
import { AuthState } from '../store/auth.state';

import { AuthToken } from '../model/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authStore: Store<AuthState>,
  ) {}

  canActivate(): Observable<boolean> {
    return this.authStore.select(selectAuthToken).pipe(
      take(1),
      map((authToken: AuthToken | null) => {
        if (!authToken) {
          this.router.navigate(['/auth/login']);
          return false;
        }
        return true;
      }),
    );
  }
}
