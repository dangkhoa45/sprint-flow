import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';
import { TaskPriority } from './task.entity';

@Schema({ timestamps: true })
export class TaskTemplate extends BaseEntity {
  @Prop({ required: true, trim: true })
  @ApiProperty()
  name: string;

  @Prop({ trim: true })
  @ApiProperty()
  description?: string;

  @Prop({ required: true, trim: true })
  @ApiProperty()
  taskTitle: string;

  @Prop({ trim: true })
  @ApiProperty()
  taskDescription?: string;

  @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
  @ApiProperty({ enum: TaskPriority })
  defaultPriority: TaskPriority;

  @Prop({ min: 0 })
  @ApiProperty()
  defaultEstimatedTime?: number; // in hours

  @Prop({ type: [String], default: [] })
  @ApiProperty()
  defaultTags: string[];

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  @ApiProperty()
  projectId?: Types.ObjectId;

  @Prop({ type: Object })
  @ApiProperty()
  metadata?: Record<string, any>;

  @Prop({ default: true })
  @ApiProperty()
  isActive: boolean;
}

export type TaskTemplateDocument = HydratedDocument<TaskTemplate>;
export const TaskTemplateSchema = SchemaFactory.createForClass(TaskTemplate);

// Add indexes for better query performance
TaskTemplateSchema.index({ projectId: 1 });
TaskTemplateSchema.index({ createdBy: 1 });
TaskTemplateSchema.index({ isActive: 1 });
TaskTemplateSchema.index({ name: 'text', description: 'text' });