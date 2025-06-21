import { milestonesApi } from "@/api/milestones";
import { Milestone, MilestoneQueryDto } from "@/types/milestone";
import useSWR from "swr";

export const useMilestones = (query?: MilestoneQueryDto) => {
  const { data, error, isLoading, mutate } = useSWR(
    query ? ['milestones', query] : null,
    () => milestonesApi.getMilestones(query)
  );

  return {
    milestones: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    isLoading,
    error,
    mutate,
  };
};

export const useProjectMilestones = (projectId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    projectId ? ['project-milestones', projectId] : null,
    () => milestonesApi.getProjectMilestones(projectId)
  );

  return {
    milestones: data || [],
    isLoading,
    error,
    mutate,
  };
};

export const useMilestone = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['milestone', id] : null,
    () => milestonesApi.getMilestone(id)
  );

  return {
    milestone: data,
    isLoading,
    error,
    mutate,
  };
};

export const useMilestoneStats = (projectId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    ['milestone-stats', projectId],
    () => milestonesApi.getMilestoneStats(projectId)
  );

  return {
    stats: data,
    isLoading,
    error,
    mutate,
  };
}; 