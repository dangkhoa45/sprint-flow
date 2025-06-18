import { BaseObject } from "./shared";
import { User } from "./user";

export enum ProjectStatus {
  Planning = "Planning",
  InProgress = "InProgress",
  OnHold = "OnHold",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum ProjectPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical",
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
  metadata?: Record<string, unknown>;
  createdBy?: User;
  updatedBy?: User;
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
  actualCost?: number;
}

export interface ProjectQueryDto {
  search?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  owner?: string;
  member?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  tags?: string[];
  offset?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

export interface ProjectStatsDto {
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
  onHold: number;
  cancelled: number;
  overdue: number;
  totalBudget: number;
  totalActualCost: number;
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
