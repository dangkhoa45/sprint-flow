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

export interface TaskUser {
  _id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

export interface TaskProject {
  _id: string;
  name: string;
  status: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  projectId: TaskProject;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: TaskUser;
  createdBy: TaskUser;
  dueDate?: string;
  estimatedTime?: number;
  actualTime?: number;
  tags: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: string;
  estimatedTime?: number;
  tags?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: string;
  estimatedTime?: number;
  actualTime?: number;
  tags?: string[];
}

export interface TaskQueryDto {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  assignedTo?: string;
  createdBy?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TaskStats {
  total: number;
  overdue: number;
  byStatus: {
    TODO: number;
    IN_PROGRESS: number;
    REVIEW: number;
    DONE: number;
    CANCELLED: number;
  };
}

export interface TaskListResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
} 