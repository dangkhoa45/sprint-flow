import useSWR from "swr";
import { projectsApi } from "../api/projects";
import { ProjectQueryDto } from "../types/project";
import { ErrorResponse } from "../types/shared";

// Hook để get danh sách projects
export function useProjects(query?: ProjectQueryDto) {
  const { data, error, mutate, isLoading } = useSWR(
    query ? [`/api/projects`, query] : `/api/projects`,
    () => projectsApi.getProjects(query),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    projects: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    isLoading,
    error: error as ErrorResponse,
    mutate,
  };
}

// Hook để get project detail
export function useProject(id: string | null) {
  const { data, error, mutate, isLoading } = useSWR(
    id ? `/api/projects/${id}` : null,
    () => (id ? projectsApi.getProject(id) : null),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    project: data,
    isLoading,
    error: error as ErrorResponse,
    mutate,
  };
}

// Hook để get project statistics
export function useProjectStats() {
  const { data, error, mutate, isLoading } = useSWR(
    `/api/projects/stats`,
    projectsApi.getProjectStats,
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

// Hook để get recent projects
export function useRecentProjects(limit = 5) {
  const { data, error, mutate, isLoading } = useSWR(
    [`/api/projects/recent`, limit],
    () => projectsApi.getRecentProjects(limit),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    projects: data || [],
    isLoading,
    error: error as ErrorResponse,
    mutate,
  };
}
