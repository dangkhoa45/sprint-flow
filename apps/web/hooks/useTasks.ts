import useSWR from 'swr';
import { tasksApi } from '../api/tasks';
import { TaskQueryDto } from '../types/task';
import { ErrorResponse } from '../types/shared';

// Hook để get danh sách tasks
export function useTasks(query?: TaskQueryDto) {
  const { data, error, mutate, isLoading } = useSWR(
    query ? [`/api/tasks`, query] : `/api/tasks`,
    () => tasksApi.getTasks(query),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    tasks: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    isLoading,
    error: error as ErrorResponse,
    mutate,
  };
}

// Hook để get task detail
export function useTask(id: string | null) {
  const { data, error, mutate, isLoading } = useSWR(
    id ? `/api/tasks/${id}` : null,
    () => (id ? tasksApi.getTask(id) : null),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    task: data,
    isLoading,
    error: error as ErrorResponse,
    mutate,
  };
}

// Hook để get task statistics
export function useTaskStats() {
  const { data, error, mutate, isLoading } = useSWR(
    `/api/tasks/stats`,
    tasksApi.getTaskStats,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute
    }
  );

  return {
    stats: data,
    isLoading,
    error: error as ErrorResponse,
    mutate,
  };
}

// Hook để get current user tasks
export function useMyTasks(status?: string) {
  const { data, error, mutate, isLoading } = useSWR(
    [`/api/tasks/my`, status],
    () => tasksApi.getMyTasks(status),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    tasks: data || [],
    isLoading,
    error: error as ErrorResponse,
    mutate,
  };
}

// Hook để get project tasks
export function useProjectTasks(projectId: string | null) {
  const { data, error, mutate, isLoading } = useSWR(
    projectId ? [`/api/tasks/project`, projectId] : null,
    () => (projectId ? tasksApi.getProjectTasks(projectId) : null),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    tasks: data || [],
    isLoading,
    error: error as ErrorResponse,
    mutate,
  };
}
