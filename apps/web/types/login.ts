import { User } from './user';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: Pick<User, '_id' | 'username' | 'displayName' | 'tel'>;
  token: string;
}

export type LoginApiResponse =
  | {
      success: true;
      user: User;
      accessToken: string;
    }
  | {
      success: false;
      error: string;
    };

export interface ErrorResponse {
  message: string;
  statusCode: number;
}
