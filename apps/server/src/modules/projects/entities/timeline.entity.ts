import { User } from '@api/modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';

export enum TimelineEventType {
  PROJECT_CREATED = 'project_created',
  PROJECT_UPDATED = 'project_updated',
  PROJECT_COMPLETED = 'project_completed',
  PROJECT_DELETED = 'project_deleted',
  TASK_CREATED = 'task_created',
  TASK_UPDATED = 'task_updated',
  TASK_COMPLETED = 'task_completed',
  TASK_DELETED = 'task_deleted',
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
  MILESTONE_REACHED = 'milestone_reached',
  DEADLINE_APPROACHING = 'deadline_approaching',
  COMMENT_ADDED = 'comment_added',
  FILE_UPLOADED = 'file_uploaded',
  STATUS_CHANGED = 'status_changed'
}

export enum TimelineEventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Schema({ timestamps: true })
export class TimelineEvent extends BaseEntity {
  @Prop({ required: true, trim: true })
  @ApiProperty()
  title: string;

  @Prop({ trim: true })
  @ApiProperty()
  description: string;

  @Prop({ type: String, enum: TimelineEventType, required: true })
  @ApiProperty({ enum: TimelineEventType })
  type: TimelineEventType;

  @Prop({ type: String, enum: TimelineEventPriority, default: TimelineEventPriority.MEDIUM })
  @ApiProperty({ enum: TimelineEventPriority })
  priority: TimelineEventPriority;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  @ApiProperty()
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty()
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty()
  targetUserId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Milestone' })
  @ApiProperty()
  milestoneId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  @ApiProperty()
  taskId?: Types.ObjectId;

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

export type TimelineEventDocument = HydratedDocument<TimelineEvent>;
export const TimelineEventSchema = SchemaFactory.createForClass(TimelineEvent);

// Add indexes for better query performance
TimelineEventSchema.index({ projectId: 1 });
TimelineEventSchema.index({ type: 1 });
TimelineEventSchema.index({ priority: 1 });
TimelineEventSchema.index({ userId: 1 });
TimelineEventSchema.index({ createdAt: -1 }); 