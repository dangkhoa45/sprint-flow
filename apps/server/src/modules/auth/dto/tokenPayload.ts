import { UserRole } from 'src/modules/users/entities/user.entity';

export class TokenPayload {
  /** user id */
  sub: string;

  /** username */
  una: string;

  /** user display name */
  dna: string;

  /** user role */
  role: UserRole;

  /** user session id */
  ses: string;

  ownerId: string;

  iat?: number;
  exp?: number;
}
