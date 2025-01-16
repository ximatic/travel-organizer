import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authStore.select(selectAuthToken).pipe(
      map((authToken: AuthToken | null) => {
        console.log('AuthGuard | canActivate() | authToken:', authToken);
        if (!authToken) {
          this.router.navigate(['/auth/login']);
          return false;
        }
        return true;
      }),
    );
  }
}
