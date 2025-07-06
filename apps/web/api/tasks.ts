import { API_HOST } from '../config/env';
import {
  CreateTaskDto,
  Task,
  TaskQueryDto,
  TaskStats,
  UpdateTaskDto,
  TaskListResponse,
  TaskTemplate,
  CreateTaskTemplateDto,
  UpdateTaskTemplateDto,
  CreateTaskFromTemplateDto,
  BulkUpdateTaskDto,
  BulkDeleteTaskDto,
  TaskComment,
  CreateTaskCommentDto,
  UpdateTaskCommentDto,
  TimeEntry,
  CreateTimeEntryDto,
  UpdateTimeEntryDto,
} from '../types/task';
import { Attachment } from '../types/attachment';
import { fetcher } from '../utils/fetcher';

export const tasksApi = {
  // Get all tasks with query
  getTasks: async (query?: TaskQueryDto) => {
    return fetcher<TaskListResponse>({
      path: `${API_HOST}/api/tasks`,
      method: 'GET',
      params: query,
    });
  },

  // Get task by ID
  getTask: async (id: string) => {
    return fetcher<Task>({
      path: `${API_HOST}/api/tasks/${id}`,
      method: 'GET',
    });
  },

  // Create new task
  createTask: async (data: CreateTaskDto) => {
    return fetcher<Task>({
      path: `${API_HOST}/api/tasks`,
      method: 'POST',
      body: data,
    });
  },

  // Update task
  updateTask: async (id: string, data: UpdateTaskDto) => {
    return fetcher<Task>({
      path: `${API_HOST}/api/tasks/${id}`,
      method: 'PATCH',
      body: data,
    });
  },

  // Delete task
  deleteTask: async (id: string) => {
    return fetcher<{ message: string }>({
      path: `${API_HOST}/api/tasks/${id}`,
      method: 'DELETE',
    });
  },

  // Get task statistics
  getTaskStats: async () => {
    return fetcher<TaskStats>({
      path: `${API_HOST}/api/tasks/stats`,
      method: 'GET',
    });
  },

  // Get current user tasks
  getMyTasks: async (status?: string) => {
    return fetcher<Task[]>({
      path: `${API_HOST}/api/tasks/my`,
      method: 'GET',
      params: status ? { status } : undefined,
    });
  },

  // Get project tasks
  getProjectTasks: async (projectId: string) => {
    return fetcher<Task[]>({
      path: `${API_HOST}/api/tasks/project/${projectId}`,
      method: 'GET',
    });
  },

  // Task Templates
  createTaskTemplate: async (data: CreateTaskTemplateDto) => {
    return fetcher<TaskTemplate>({
      path: `${API_HOST}/api/tasks/templates`,
      method: 'POST',
      body: data,
    });
  },

  getTaskTemplates: async (query?: any) => {
    return fetcher<{ data: TaskTemplate[]; total: number; page: number; limit: number }>({
      path: `${API_HOST}/api/tasks/templates`,
      method: 'GET',
      params: query,
    });
  },

  getTaskTemplate: async (id: string) => {
    return fetcher<TaskTemplate>({
      path: `${API_HOST}/api/tasks/templates/${id}`,
      method: 'GET',
    });
  },

  updateTaskTemplate: async (id: string, data: UpdateTaskTemplateDto) => {
    return fetcher<TaskTemplate>({
      path: `${API_HOST}/api/tasks/templates/${id}`,
      method: 'PATCH',
      body: data,
    });
  },

  deleteTaskTemplate: async (id: string) => {
    return fetcher<{ message: string }>({
      path: `${API_HOST}/api/tasks/templates/${id}`,
      method: 'DELETE',
    });
  },

  createTaskFromTemplate: async (data: CreateTaskFromTemplateDto) => {
    return fetcher<Task>({
      path: `${API_HOST}/api/tasks/from-template`,
      method: 'POST',
      body: data,
    });
  },

  // Bulk Operations
  bulkUpdateTasks: async (data: BulkUpdateTaskDto) => {
    return fetcher<{ updated: number; failed: string[] }>({
      path: `${API_HOST}/api/tasks/bulk-update`,
      method: 'POST',
      body: data,
    });
  },

  bulkDeleteTasks: async (data: BulkDeleteTaskDto) => {
    return fetcher<{ deleted: number; failed: string[] }>({
      path: `${API_HOST}/api/tasks/bulk-delete`,
      method: 'POST',
      body: data,
    });
  },

  // Task Comments
  createTaskComment: async (data: CreateTaskCommentDto) => {
    return fetcher<TaskComment>({
      path: `${API_HOST}/api/tasks/comments`,
      method: 'POST',
      body: data,
    });
  },

  getTaskComments: async (taskId: string) => {
    return fetcher<TaskComment[]>({
      path: `${API_HOST}/api/tasks/${taskId}/comments`,
      method: 'GET',
    });
  },

  updateTaskComment: async (commentId: string, data: UpdateTaskCommentDto) => {
    return fetcher<TaskComment>({
      path: `${API_HOST}/api/tasks/comments/${commentId}`,
      method: 'PATCH',
      body: data,
    });
  },

  deleteTaskComment: async (commentId: string) => {
    return fetcher<{ message: string }>({
      path: `${API_HOST}/api/tasks/comments/${commentId}`,
      method: 'DELETE',
    });
  },

  // Time Entries
  createTimeEntry: async (data: CreateTimeEntryDto) => {
    return fetcher<TimeEntry>({
      path: `${API_HOST}/api/tasks/time-entries`,
      method: 'POST',
      body: data,
    });
  },

  getTaskTimeEntries: async (taskId: string) => {
    return fetcher<TimeEntry[]>({
      path: `${API_HOST}/api/tasks/${taskId}/time-entries`,
      method: 'GET',
    });
  },

  updateTimeEntry: async (timeEntryId: string, data: UpdateTimeEntryDto) => {
    return fetcher<TimeEntry>({
      path: `${API_HOST}/api/tasks/time-entries/${timeEntryId}`,
      method: 'PATCH',
      body: data,
    });
  },

  deleteTimeEntry: async (timeEntryId: string) => {
    return fetcher<{ message: string }>({
      path: `${API_HOST}/api/tasks/time-entries/${timeEntryId}`,
      method: 'DELETE',
    });
  },

  getTimeTrackingStats: async (taskId: string) => {
    return fetcher<any>({
      path: `${API_HOST}/api/tasks/${taskId}/time-stats`,
      method: 'GET',
    });
  },

  // Task Attachments
  getTaskAttachments: async (taskId: string) => {
    return fetcher<Attachment[]>({
      path: `${API_HOST}/api/tasks/${taskId}/attachments`,
      method: 'GET',
    });
  },

  deleteTaskAttachment: async (attachmentId: string) => {
    return fetcher<{ message: string }>({
      path: `${API_HOST}/api/tasks/attachments/${attachmentId}`,
      method: 'DELETE',
    });
  },
};
