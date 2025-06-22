import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';

@Schema({ timestamps: true })
export class AccessKey extends BaseEntity {
  @Prop()
  @ApiProperty()
  name: string;

  @Prop({ default: 0 })
  @ApiProperty()
  limit: number;

  @Prop({ default: 0 })
  @ApiProperty()
  used: number;

  @Prop({ index: true, unique: true })
  key: string;

  @Prop({ type: [String] })
  @ApiProperty()
  maskDF?: string[];

  @Prop()
  @ApiProperty()
  outputDir?: string;
}

export type AccessKeyDocument = HydratedDocument<AccessKey>;
export const AccessKeySchema = SchemaFactory.createForClass(AccessKey);
