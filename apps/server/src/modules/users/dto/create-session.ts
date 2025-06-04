import { BaseInput } from 'src/shared/base.input';
import { IBrowser, ICPU, IDevice, IEngine, IOS } from 'ua-parser-js';

export class CreateSessionDto extends BaseInput {
  ip?: string;
  ua?: string;
  startAt?: Date;
  endAt?: Date;
  user?: string;
  browser?: IBrowser;
  device?: IDevice;
  os?: IOS;
  cpu?: ICPU;
  engine?: IEngine;
}
