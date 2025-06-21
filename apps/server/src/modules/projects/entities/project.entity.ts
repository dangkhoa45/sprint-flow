import { User } from '@api/modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';

export enum ProjectStatus {
  Planning = 'Planning',
  InProgress = 'InProgress',
  OnHold = 'OnHold',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum ProjectPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

@Schema({ timestamps: true })
export class Project extends BaseEntity {
  @Prop({ required: true, trim: true })
  @ApiProperty()
  name: string;

  @Prop({ trim: true })
  @ApiProperty()
  description?: string;

  @Prop({ type: String, enum: ProjectStatus, default: ProjectStatus.Planning })
  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @Prop({
    type: String,
    enum: ProjectPriority,
    default: ProjectPriority.Medium,
  })
  @ApiProperty({ enum: ProjectPriority })
  priority: ProjectPriority;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty()
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  @ApiProperty()
  members: Types.ObjectId[];

  @Prop()
  @ApiProperty()
  startDate?: Date;

  @Prop()
  @ApiProperty()
  endDate?: Date;

  @Prop()
  @ApiProperty()
  estimatedHours?: number;

  @Prop({ default: 0 })
  @ApiProperty()
  actualHours: number;

  @Prop({ min: 0, max: 100, default: 0 })
  @ApiProperty()
  progress: number;

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

export type ProjectDocument = HydratedDocument<Project>;
export const ProjectSchema = SchemaFactory.createForClass(Project);

// Add indexes for better query performance
ProjectSchema.index({ name: 'text', description: 'text' });
ProjectSchema.index({ status: 1, priority: 1 });
ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ members: 1 });
ProjectSchema.index({ createdAt: -1 });
