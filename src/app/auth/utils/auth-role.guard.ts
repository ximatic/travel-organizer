import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';

import { selectAuthToken } from '../store/auth.selectors';
import { AuthState } from '../store/auth.state';

import { TokenHelper } from '../../common/utils/token.helper';

import { AuthToken } from '../model/auth.model';
import { UserRole } from '../../user/models/user.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthRoleGuard implements CanActivate {
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

        const authRole: UserRole = TokenHelper.getTokenRole(authToken); // jwtDecode<{ role: UserRole }>(authToken.accessToken).role;
        if (!authRole) {
          this.router.navigate(['/auth/login']);
          return false;
        } else if (authRole === UserRole.User) {
          this.router.navigate(['/dashboard']);
          return false;
        }

        return true;
      }),
    );
  }
}
