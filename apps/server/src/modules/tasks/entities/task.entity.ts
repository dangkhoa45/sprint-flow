import { User } from '@api/modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Schema({ timestamps: true })
export class Task extends BaseEntity {
  @Prop({ required: true, trim: true })
  @ApiProperty()
  title: string;

  @Prop({ trim: true })
  @ApiProperty()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  @ApiProperty()
  projectId: Types.ObjectId;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO })
  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
  @ApiProperty({ enum: TaskPriority })
  priority: TaskPriority;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty()
  assignedTo?: Types.ObjectId;

  @Prop()
  @ApiProperty()
  dueDate?: Date;

  @Prop({ min: 0 })
  @ApiProperty()
  estimatedTime?: number; // in hours

  @Prop({ min: 0, default: 0 })
  @ApiProperty()
  actualTime?: number; // in hours

  @Prop([String])
  @ApiProperty()
  tags: string[];

  @Prop({ type: Object })
  @ApiProperty()
  metadata?: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty()
  updatedBy?: string | User;
}

export type TaskDocument = HydratedDocument<Task>;
export const TaskSchema = SchemaFactory.createForClass(Task);

// Add indexes for better query performance
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ createdBy: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ createdAt: -1 });
TaskSchema.index({ title: 'text', description: 'text' });
