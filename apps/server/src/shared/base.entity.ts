import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export enum BaseStatus {
  Normal = 'Normal',
  Deleted = 'Deleted',
  Failed = 'Failed',
}

@Schema()
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
  updatedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty()
  createdBy?: Types.ObjectId;
}
