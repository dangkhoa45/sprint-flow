import { API_HOST } from "../config/env";
import {
  CreateProjectDto,
  Project,
  ProjectQueryDto,
  ProjectStatsDto,
  UpdateProjectDto,
} from "../types/project";
import { fetcher } from "../utils/fetcher";

export const projectsApi = {
  // Get all projects with query
  getProjects: async (query?: ProjectQueryDto) => {
    return fetcher<{
      data: Project[];
      total: number;
      page: number;
      limit: number;
    }>({
      path: `${API_HOST}/api/projects`,
      method: "GET",
      params: query,
    });
  },

  // Get project by ID
  getProject: async (id: string) => {
    return fetcher<Project>({
      path: `${API_HOST}/api/projects/${id}`,
      method: "GET",
    });
  },

  // Create new project
  createProject: async (data: CreateProjectDto) => {
    return fetcher<Project>({
      path: `${API_HOST}/api/projects`,
      method: "POST",
      body: data,
    });
  },

  // Update project
  updateProject: async (id: string, data: UpdateProjectDto) => {
    return fetcher<Project>({
      path: `${API_HOST}/api/projects/${id}`,
      method: "PATCH",
      body: data,
    });
  },

  // Delete project
  deleteProject: async (id: string) => {
    return fetcher<{ message: string }>({
      path: `${API_HOST}/api/projects/${id}`,
      method: "DELETE",
    });
  },

  // Get project statistics
  getProjectStats: async () => {
    return fetcher<ProjectStatsDto>({
      path: `${API_HOST}/api/projects/stats`,
      method: "GET",
    });
  },

  // Get recent projects
  getRecentProjects: async (limit = 5) => {
    return fetcher<Project[]>({
      path: `${API_HOST}/api/projects/recent`,
      method: "GET",
      params: { limit },
    });
  },

  // Add member to project
  addMember: async (projectId: string, memberId: string) => {
    return fetcher<Project>({
      path: `${API_HOST}/api/projects/${projectId}/members/${memberId}`,
      method: "POST",
    });
  },

  // Remove member from project
  removeMember: async (projectId: string, memberId: string) => {
    return fetcher<Project>({
      path: `${API_HOST}/api/projects/${projectId}/members/${memberId}`,
      method: "DELETE",
    });
  },
};
