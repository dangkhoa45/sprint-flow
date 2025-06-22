import { API_HOST } from "../config/env";
import {
  CreateTaskDto,
  Task,
  TaskQueryDto,
  TaskStats,
  UpdateTaskDto,
  TaskListResponse,
} from "../types/task";
import { fetcher } from "../utils/fetcher";

export const tasksApi = {
  // Get all tasks with query
  getTasks: async (query?: TaskQueryDto) => {
    return fetcher<TaskListResponse>({
      path: `${API_HOST}/api/tasks`,
      method: "GET",
      params: query,
    });
  },

  // Get task by ID
  getTask: async (id: string) => {
    return fetcher<Task>({
      path: `${API_HOST}/api/tasks/${id}`,
      method: "GET",
    });
  },

  // Create new task
  createTask: async (data: CreateTaskDto) => {
    return fetcher<Task>({
      path: `${API_HOST}/api/tasks`,
      method: "POST",
      body: data,
    });
  },

  // Update task
  updateTask: async (id: string, data: UpdateTaskDto) => {
    return fetcher<Task>({
      path: `${API_HOST}/api/tasks/${id}`,
      method: "PATCH",
      body: data,
    });
  },

  // Delete task
  deleteTask: async (id: string) => {
    return fetcher<{ message: string }>({
      path: `${API_HOST}/api/tasks/${id}`,
      method: "DELETE",
    });
  },

  // Get task statistics
  getTaskStats: async () => {
    return fetcher<TaskStats>({
      path: `${API_HOST}/api/tasks/stats`,
      method: "GET",
    });
  },

  // Get current user tasks
  getMyTasks: async (status?: string) => {
    return fetcher<Task[]>({
      path: `${API_HOST}/api/tasks/my`,
      method: "GET",
      params: status ? { status } : undefined,
    });
  },

  // Get project tasks
  getProjectTasks: async (projectId: string) => {
    return fetcher<Task[]>({
      path: `${API_HOST}/api/tasks/project/${projectId}`,
      method: "GET",
    });
  },
}; 