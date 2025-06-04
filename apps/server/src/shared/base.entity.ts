import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';

export enum BaseStatus {
  Normal = 'Normal',
  Deleted = 'Deleted',
  Failed = 'Failed',
}
export abstract class BaseEntity {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  status: string;

  @Prop({
    type: Date,
  })
  @ApiProperty()
  updatedAt?: Date;

  @Prop({
    type: Date,
  })
  @ApiProperty()
  createdAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty()
  updatedBy?: string | User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty()
  createdBy?: string | User;
}
