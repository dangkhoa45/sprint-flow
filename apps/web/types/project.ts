import { BaseObject } from './shared';
import { User } from './user';
import { Milestone } from './milestone';
import { Attachment } from './attachment';

export interface Member {
  _id: string;
  displayName: string;
  avatar?: string;
}

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

export interface Project extends BaseObject {
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  owner: User;
  members: User[];
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
  actualHours: number;
  progress: number;
  actualCost: number;
  tags: string[];
  milestones?: Milestone[];
  attachments?: Attachment[];
  milestoneCount?: number;
  attachmentCount?: number;
  metadata?: Record<string, unknown>;
  createdBy?: User;
  updatedBy?: User;

  // Enhanced features
  dependencies?: string[];
  dependents?: string[];
  resourceAllocation?: {
    budget?: number;
    spentBudget?: number;
    teamMembers?: number;
    requiredSkills?: string[];
    allocatedResources?: {
      resourceId: string;
      resourceType: string;
      allocation: number;
      startDate?: string;
      endDate?: string;
    }[];
  };
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  priority?: ProjectPriority;
  members?: string[];
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  status?: ProjectStatus;
  progress?: number;
  actualHours?: number;
}

export interface ProjectQueryDto {
  search?: string;
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  owner?: string;
  member?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  tags?: string[];

  // Enhanced filtering options
  progressFrom?: number;
  progressTo?: number;
  estimatedHoursFrom?: number;
  estimatedHoursTo?: number;
  actualHoursFrom?: number;
  actualHoursTo?: number;
  overdue?: boolean;
  myProjects?: boolean;
  myOwnedProjects?: boolean;
  createdBy?: string;
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;

  // Advanced search options
  searchFields?: string[];
  exactMatch?: boolean;
  caseSensitive?: boolean;

  // Pagination and sorting
  offset?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectStatsDto {
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
  onHold: number;
  cancelled: number;
  overdue: number;
  averageProgress: number;
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  search?: string;
  owner?: string;
  tags?: string[];
}

export interface ProjectStats {
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
  onHold: number;
  cancelled: number;
}
