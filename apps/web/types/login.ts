import { User } from "./user";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  user: Pick<User, "_id" | "username" | "displayName" | "tel">;
  token: string;
};

export type LoginApiResponse = {
  success: true;
  user: User;
  accessToken: string;
} | {
  success: false;
  error: string;
};

export type ErrorResponse = {
  message: string;
  statusCode: number;
};
