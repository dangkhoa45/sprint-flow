export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  reporter: User;
  project?: Project;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  attachments: string[];
  comments: TaskComment[];
  estimatedHours?: number;
  loggedHours?: number;
  subtasks: Task[];
  parentTask?: string;
}

export interface TaskComment {
  _id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar?: string;
  role: string;
}

export interface Project {
  _id: string;
  name: string;
  key: string;
  description?: string;
  color: string;
}

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
  HIGHEST = "HIGHEST"
}

export type TaskViewMode = "board" | "list";

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string[];
  project?: string[];
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  search?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  project?: string;
  dueDate?: Date;
  tags: string[];
  estimatedHours?: number;
  parentTask?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  _id: string;
}
