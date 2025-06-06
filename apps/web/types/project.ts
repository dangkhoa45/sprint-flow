export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface ProjectMember {
  _id: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: 'owner' | 'manager' | 'member' | 'viewer';
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Date;
  endDate?: Date;
  progress: number;
  budget?: number;
  owner: ProjectMember;
  members: ProjectMember[];
  tasksCount: number;
  completedTasks: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectData {
  name: string;
  description: string;
  priority: ProjectPriority;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  members: string[];
  tags: string[];
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
