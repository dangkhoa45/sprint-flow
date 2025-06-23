import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';

export enum AttachmentType {
  DOCUMENT = 'document',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  ARCHIVE = 'archive',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Attachment extends BaseEntity {
  @Prop({ required: true, trim: true })
  @ApiProperty()
  filename: string;

  @Prop({ required: true })
  @ApiProperty()
  originalName: string;

  @Prop({ required: true })
  @ApiProperty()
  mimeType: string;

  @Prop({ required: true })
  @ApiProperty()
  size: number;

  @Prop({ required: true })
  @ApiProperty()
  path: string;

  @Prop({ type: String, enum: AttachmentType, required: true })
  @ApiProperty({ enum: AttachmentType })
  type: AttachmentType;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  @ApiProperty()
  projectId: Types.ObjectId;

  @Prop({ trim: true })
  @ApiProperty()
  description?: string;

  @Prop([String])
  @ApiProperty()
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty()
  uploadedBy: Types.ObjectId;
}

export type AttachmentDocument = HydratedDocument<Attachment>;
export const AttachmentSchema = SchemaFactory.createForClass(Attachment);

// Add indexes for better query performance
AttachmentSchema.index({ projectId: 1 });
AttachmentSchema.index({ type: 1 });
AttachmentSchema.index({ uploadedBy: 1 });
AttachmentSchema.index({ createdAt: -1 });
