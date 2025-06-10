// Common types and interfaces for reports
export interface ReportBaseData {
  _id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskData extends ReportBaseData {
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: UserData[];
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  project: ProjectData;
}

export interface UserData {
  _id: string;
  displayName: string;
  username: string;
  avatar?: string;
  role: string;
  email: string;
}

export interface ProjectData {
  _id: string;
  name: string;
  description: string;
  color: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

// Enums for task status and priority
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS", 
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
  BLOCKED = "BLOCKED"
}

export enum TaskPriority {
  LOWEST = "LOWEST",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}

// Time period types
export interface TimeSeriesData {
  period: string;
  created: number;
  completed: number;
  inProgress: number;
  todo: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

// Report summary statistics
export interface ReportSummaryStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  blockedTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageCompletionTime: number;
}

// Common props for report components
export interface ReportComponentProps {
  data?: ReportBaseData[];
  loading?: boolean;
  error?: string;
  filters?: Record<string, string | number | boolean>;
  onFilterChange?: (filters: Record<string, string | number | boolean>) => void;
}
