import { UserRole } from '../../user/models/user.enum';

export interface AdminUser {
  id?: string;
  email: string;
  role: UserRole;
  firstname: string;
  lastname: string;
}

// request payload

export interface CreateAdminUserPayload {
  email: string;
  password: string;
  passwordRepeat: string;
  firstname: string;
  lastname: string;
  role: UserRole;
}

export interface UpdateAdminUserPayload extends Partial<CreateAdminUserPayload> {
  _id: string;
}
