import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';

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

@Schema({ timestamps: true })
export class User extends BaseEntity {
  @Prop({ required: true })
  @ApiProperty()
  displayName: string;

  @Prop({ unique: true })
  @ApiProperty()
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, required: true })
  @ApiProperty()
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.Active })
  @ApiProperty()
  status: UserStatus;

  @Prop()
  @ApiProperty()
  lastLogin?: Date;

  @Prop()
  @ApiProperty()
  tel?: string;

  @Prop()
  @ApiProperty()
  address?: string;

  @Prop()
  @ApiProperty()
  email?: string;

  @Prop()
  @ApiProperty()
  avatar?: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
