import { jwtDecode } from 'jwt-decode';

import { AuthToken } from '../../auth/model/auth.model';
import { UserRole } from '../../user/models/user.enum';

export class TokenHelper {
  static getTokenRole(authToken: AuthToken): UserRole {
    return jwtDecode<{ role: UserRole }>(authToken.accessToken).role;
  }

  static isAdminToken(authToken: AuthToken): boolean {
    return TokenHelper.getTokenRole(authToken) === UserRole.Admin;
  }
}
