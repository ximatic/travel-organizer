import { UserRole } from '../../user/models/user.enum';

export interface AdminUser {
  _id?: string;
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
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
