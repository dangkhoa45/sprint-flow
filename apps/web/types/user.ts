import { BaseObject, ListOptions } from './shared';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

export enum UserStatus {
  Pending = 'Pending',
  Active = 'Active',
  Banned = 'Banned',
  Deleted = 'Deleted',
}

export interface User extends BaseObject {
  displayName: string;
  username: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  tel?: string;
  address?: string;
  email?: string;
  bankAccount?: string;
  bankName?: string;
  bankCode?: string;
  avatar?: string;
}

export interface UserSession extends BaseObject {
  _id: string;
  startAt: string;
  endAt: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  duration: number;
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  cpu: {
    architecture: string;
  };
  engine: {
    name: string;
    version: string;
  };
}

export interface WithPassword {
  password: string;
}

export interface UserLoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type UserCreateInput = Omit<
  User & WithPassword,
  '_id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>;

export interface UserChangePassword {
  currentPassword: string;
  newPassword: string;
}

export type UserUpdateInput = Partial<UserCreateInput>;
export type UserFilterParams = ListOptions<User>;

export interface UserFilters {
  search?: string;
  role?: UserRole[];
  status?: UserStatus[];
}

export interface UserStats {
  total: number;
  active: number;
  pending: number;
  banned: number;
  admins: number;
  users: number;
}
