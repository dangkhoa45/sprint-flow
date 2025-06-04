import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';
import { User } from './user.entity';
import { IBrowser, ICPU, IDevice, IEngine, IOS } from 'ua-parser-js';

@Schema({ timestamps: true, collection: 'user-sessions' })
export class UserSession extends BaseEntity {
  @Prop()
  @ApiProperty()
  ip?: string;

  @Prop()
  ua?: string;

  @Prop()
  startAt?: Date;

  @Prop()
  endAt?: Date;

  @Prop(
    raw({
      name: { type: String },
      version: { type: String },
    }),
  )
  browser?: IBrowser;

  @Prop(
    raw({
      model: { type: String },
      type: { type: String },
      vendor: { type: String },
    }),
  )
  device?: IDevice;

  @Prop(
    raw({
      name: { type: String },
      version: { type: String },
    }),
  )
  os?: IOS;

  @Prop(
    raw({
      architecture: { type: String },
    }),
  )
  cpu?: ICPU;

  @Prop(
    raw({
      name: { type: String },
      version: { type: String },
    }),
  )
  engine?: IEngine;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  @ApiProperty()
  user?: Types.ObjectId | User;

  docCount?: number;
}

export type UserSessionDocument = HydratedDocument<UserSession>;
export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
