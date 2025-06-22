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
  STATUS_CHANGED = 'status_changed',
}

export enum TimelineEventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface TimelineUser {
  _id: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: 'owner' | 'manager' | 'member' | 'viewer';
}

export interface TimelineProject {
  _id: string;
  name: string;
  status: string;
}

export interface TimelineTask {
  _id: string;
  title: string;
  status: string;
  projectId: string;
}

export interface TimelineEvent {
  _id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  priority: TimelineEventPriority;
  user: TimelineUser;
  project?: TimelineProject;
  task?: TimelineTask;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineFilters {
  type?: TimelineEventType[];
  priority?: TimelineEventPriority[];
  search?: string;
  userId?: string;
  projectId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface TimelineStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  projectEvents: number;
  taskEvents: number;
  userEvents: number;
}

export interface CreateTimelineEventData {
  type: TimelineEventType;
  title: string;
  description: string;
  priority: TimelineEventPriority;
  projectId?: string;
  taskId?: string;
  metadata?: Record<string, any>;
}
