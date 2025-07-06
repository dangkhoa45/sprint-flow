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
  dependencies: TaskDependency[];
  dependents: TaskDependency[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskDependency {
  _id: string;
  title: string;
  status: TaskStatus;
}

export interface TaskTemplate {
  _id: string;
  name: string;
  description?: string;
  taskTitle: string;
  taskDescription?: string;
  defaultPriority: TaskPriority;
  defaultEstimatedTime?: number;
  defaultTags: string[];
  projectId?: TaskProject;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdBy: TaskUser;
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  _id: string;
  content: string;
  taskId: string;
  parentId?: string;
  mentions: TaskUser[];
  isEdited: boolean;
  editedAt?: string;
  metadata?: Record<string, any>;
  createdBy: TaskUser;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  _id: string;
  duration: number; // in minutes
  startTime: string;
  endTime?: string;
  description?: string;
  type: 'manual' | 'timer' | 'imported';
  taskId: string;
  userId: TaskUser;
  isBillable: boolean;
  hourlyRate?: number;
  tags: string[];
  metadata?: Record<string, any>;
  createdBy: TaskUser;
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
  dependencies?: string[];
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
  dependencies?: string[];
}

export interface CreateTaskTemplateDto {
  name: string;
  description?: string;
  taskTitle: string;
  taskDescription?: string;
  defaultPriority?: TaskPriority;
  defaultEstimatedTime?: number;
  defaultTags?: string[];
  projectId?: string;
  isActive?: boolean;
}

export interface UpdateTaskTemplateDto {
  name?: string;
  description?: string;
  taskTitle?: string;
  taskDescription?: string;
  defaultPriority?: TaskPriority;
  defaultEstimatedTime?: number;
  defaultTags?: string[];
  isActive?: boolean;
}

export interface CreateTaskFromTemplateDto {
  templateId: string;
  projectId: string;
  title?: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
}

export interface BulkUpdateTaskDto {
  taskIds: string[];
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  addTags?: string[];
  removeTags?: string[];
}

export interface BulkDeleteTaskDto {
  taskIds: string[];
  force?: boolean;
}

export interface CreateTaskCommentDto {
  content: string;
  taskId: string;
  parentId?: string;
  mentions?: string[];
}

export interface UpdateTaskCommentDto {
  content?: string;
  mentions?: string[];
}

export interface CreateTimeEntryDto {
  duration: number;
  startTime: string;
  endTime?: string;
  description?: string;
  type?: 'manual' | 'timer' | 'imported';
  taskId: string;
  isBillable?: boolean;
  hourlyRate?: number;
  tags?: string[];
}

export interface UpdateTimeEntryDto {
  duration?: number;
  startTime?: string;
  endTime?: string;
  description?: string;
  isBillable?: boolean;
  hourlyRate?: number;
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
