import { BaseObject } from './shared';
import { User } from './user';

export enum MilestoneStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Delayed = 'Delayed',
  Cancelled = 'Cancelled',
}

export interface Milestone extends BaseObject {
  title: string;
  description?: string;
  projectId: string;
  status: MilestoneStatus;
  progress: number;
  dueDate: string;
  assignedTo?: User;
  tags: string[];
  metadata?: Record<string, unknown>;
  createdBy?: User;
  updatedBy?: User;
}

export interface CreateMilestoneDto {
  title: string;
  description?: string;
  dueDate: string;
  status?: MilestoneStatus;
  progress?: number;
  assignedTo?: string;
  tags?: string[];
}

export interface UpdateMilestoneDto extends Partial<CreateMilestoneDto> {
  status?: MilestoneStatus;
  progress?: number;
}

export interface MilestoneQueryDto {
  search?: string;
  status?: MilestoneStatus;
  projectId?: string;
  assignedTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MilestoneStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  delayed: number;
  cancelled: number;
  overdue: number;
  dueThisWeek: number;
  dueNextWeek: number;
}
