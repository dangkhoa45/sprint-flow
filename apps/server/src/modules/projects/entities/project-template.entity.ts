import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';
import { ProjectPriority } from './project.entity';

export enum TemplateCategory {
  Software = 'Software',
  Marketing = 'Marketing',
  Design = 'Design',
  Research = 'Research',
  Business = 'Business',
  Other = 'Other',
}

@Schema({ timestamps: true })
export class ProjectTemplate extends BaseEntity {
  @Prop({ required: true, trim: true })
  @ApiProperty()
  name: string;

  @Prop({ trim: true })
  @ApiProperty()
  description?: string;

  @Prop({
    type: String,
    enum: TemplateCategory,
    default: TemplateCategory.Other,
  })
  @ApiProperty({ enum: TemplateCategory })
  category: TemplateCategory;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty()
  createdBy: Types.ObjectId;

  @Prop({ default: false })
  @ApiProperty()
  isPublic: boolean;

  @Prop({ default: false })
  @ApiProperty()
  isDefault: boolean;

  // Template configuration
  @Prop({
    type: String,
    enum: ProjectPriority,
    default: ProjectPriority.Medium,
  })
  @ApiProperty({ enum: ProjectPriority })
  defaultPriority: ProjectPriority;

  @Prop()
  @ApiProperty()
  defaultEstimatedHours?: number;

  @Prop([String])
  @ApiProperty()
  defaultTags: string[];

  @Prop({ type: Object })
  @ApiProperty()
  defaultMetadata?: Record<string, any>;

  // Template tasks structure
  @Prop({ type: [Object] })
  @ApiProperty()
  tasksTemplate?: {
    title: string;
    description?: string;
    estimatedHours?: number;
    tags?: string[];
    priority?: string;
  }[];

  // Template milestones structure
  @Prop({ type: [Object] })
  @ApiProperty()
  milestonesTemplate?: {
    title: string;
    description?: string;
    dueDate?: string; // Relative date like "+30 days"
    priority?: string;
  }[];

  @Prop({ default: 0 })
  @ApiProperty()
  usageCount: number;

  @Prop({ default: 0 })
  @ApiProperty()
  rating: number;

  @Prop({ default: 0 })
  @ApiProperty()
  ratingCount: number;
}

export type ProjectTemplateDocument = HydratedDocument<ProjectTemplate>;
export const ProjectTemplateSchema =
  SchemaFactory.createForClass(ProjectTemplate);

// Add indexes for better query performance
ProjectTemplateSchema.index({ name: 'text', description: 'text' });
ProjectTemplateSchema.index({ category: 1 });
ProjectTemplateSchema.index({ createdBy: 1 });
ProjectTemplateSchema.index({ isPublic: 1 });
ProjectTemplateSchema.index({ isDefault: 1 });
ProjectTemplateSchema.index({ usageCount: -1 });
ProjectTemplateSchema.index({ rating: -1 });
