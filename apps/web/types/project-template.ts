import { BaseObject } from './shared';
import { User } from './user';

export enum TemplateCategory {
  Software = 'Software',
  Marketing = 'Marketing',
  Design = 'Design',
  Research = 'Research',
  Business = 'Business',
  Other = 'Other',
}

export interface ProjectTemplate extends BaseObject {
  name: string;
  description?: string;
  category: TemplateCategory;
  createdBy: User;
  isPublic: boolean;
  isDefault: boolean;
  defaultPriority: string;
  defaultEstimatedHours?: number;
  defaultTags: string[];
  defaultMetadata?: Record<string, unknown>;
  tasksTemplate?: {
    title: string;
    description?: string;
    estimatedHours?: number;
    tags?: string[];
    priority?: string;
  }[];
  milestonesTemplate?: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
  }[];
  usageCount: number;
  rating: number;
  ratingCount: number;
}

export interface CreateProjectTemplateDto {
  name: string;
  description?: string;
  category: TemplateCategory;
  isPublic?: boolean;
  defaultPriority?: string;
  defaultEstimatedHours?: number;
  defaultTags?: string[];
  defaultMetadata?: Record<string, unknown>;
  tasksTemplate?: {
    title: string;
    description?: string;
    estimatedHours?: number;
    tags?: string[];
    priority?: string;
  }[];
  milestonesTemplate?: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
  }[];
}

export interface ProjectTemplateQueryDto {
  search?: string;
  category?: TemplateCategory;
  createdBy?: string;
  isPublic?: boolean;
  isDefault?: boolean;
  myTemplates?: boolean;
  offset?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProjectFromTemplateDto {
  templateId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  members?: string[];
}

export interface RateTemplateDto {
  rating: number;
}
