import { API_HOST } from "../config/env";
import {
  CreateMilestoneDto,
  Milestone,
  MilestoneQueryDto,
  MilestoneStats,
  UpdateMilestoneDto,
} from "../types/milestone";
import { fetcher } from "../utils/fetcher";

export const milestonesApi = {
  // Get all milestones with query
  getMilestones: async (query?: MilestoneQueryDto) => {
    return fetcher<{
      data: Milestone[];
      total: number;
      page: number;
      limit: number;
    }>({
      path: `${API_HOST}/api/milestones`,
      method: "GET",
      params: query,
    });
  },

  // Get milestone by ID
  getMilestone: async (id: string) => {
    return fetcher<Milestone>({
      path: `${API_HOST}/api/milestones/${id}`,
      method: "GET",
    });
  },

  // Create new milestone
  createMilestone: async (projectId: string, data: CreateMilestoneDto) => {
    return fetcher<Milestone>({
      path: `${API_HOST}/api/milestones/${projectId}`,
      method: "POST",
      body: data,
    });
  },

  // Update milestone
  updateMilestone: async (id: string, data: UpdateMilestoneDto) => {
    return fetcher<Milestone>({
      path: `${API_HOST}/api/milestones/${id}`,
      method: "PATCH",
      body: data,
    });
  },

  // Delete milestone
  deleteMilestone: async (id: string) => {
    return fetcher<{ message: string }>({
      path: `${API_HOST}/api/milestones/${id}`,
      method: "DELETE",
    });
  },

  // Get project milestones
  getProjectMilestones: async (projectId: string) => {
    return fetcher<Milestone[]>({
      path: `${API_HOST}/api/milestones/project/${projectId}`,
      method: "GET",
    });
  },

  // Get milestone statistics
  getMilestoneStats: async (projectId?: string) => {
    return fetcher<MilestoneStats>({
      path: `${API_HOST}/api/milestones/stats`,
      method: "GET",
      params: projectId ? { projectId } : undefined,
    });
  },
}; 