import { UserRole } from 'src/modules/users/entities/user.entity';

export class TokenPayload {
  /** user id */
  sub: string;

  /** username */
  una: string;

  /** user display name */
  dna: string;

  /** user role */
  rol: UserRole;

  /** user session id */
  ses: string;

  iat?: number;
  exp?: number;
}
