// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    token: string;
  }
}
