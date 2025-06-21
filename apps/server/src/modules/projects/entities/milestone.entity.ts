import { User } from '@api/modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';

export enum MilestoneStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Delayed = 'Delayed',
  Cancelled = 'Cancelled',
}

@Schema({ timestamps: true })
export class Milestone extends BaseEntity {
  @Prop({ required: true, trim: true })
  @ApiProperty()
  title: string;

  @Prop({ trim: true })
  @ApiProperty()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  @ApiProperty()
  projectId: Types.ObjectId;

  @Prop({ type: String, enum: MilestoneStatus, default: MilestoneStatus.Pending })
  @ApiProperty({ enum: MilestoneStatus })
  status: MilestoneStatus;

  @Prop({ required: true })
  @ApiProperty()
  dueDate: Date;

  @Prop({ min: 0, max: 100, default: 0 })
  @ApiProperty()
  progress: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty()
  assignedTo?: Types.ObjectId;

  @Prop([String])
  @ApiProperty()
  tags: string[];

  @Prop({ type: Object })
  @ApiProperty()
  metadata?: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty()
  createdBy?: string | User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty()
  updatedBy?: string | User;
}

export type MilestoneDocument = HydratedDocument<Milestone>;
export const MilestoneSchema = SchemaFactory.createForClass(Milestone);

// Add indexes for better query performance
MilestoneSchema.index({ projectId: 1 });
MilestoneSchema.index({ status: 1 });
MilestoneSchema.index({ dueDate: 1 });
MilestoneSchema.index({ assignedTo: 1 });
MilestoneSchema.index({ createdAt: -1 }); 