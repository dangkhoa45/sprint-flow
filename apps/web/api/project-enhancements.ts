import { api } from '@/utils/axiosConfig';
import {
  ExportProjectsDto,
  ExportResponseDto,
  ResourceAllocation,
  ProjectDependencyAnalysis,
  TimelineVisualizationData,
  AdvancedProjectStats,
  ResourceUtilization,
} from '@/types/project-enhancements';

export class ProjectEnhancementsService {
  private static readonly BASE_URL = '/projects';

  // Export functionality
  static async exportProjects(
    data: ExportProjectsDto
  ): Promise<ExportResponseDto> {
    const response = await api.post(`${this.BASE_URL}/export`, data);
    return response.data;
  }

  static async downloadExport(filename: string): Promise<Blob> {
    const response = await api.get(`${this.BASE_URL}/download/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Advanced analytics
  static async getAdvancedAnalytics(): Promise<AdvancedProjectStats> {
    const response = await api.get(`${this.BASE_URL}/analytics`);
    return response.data;
  }

  // Dependencies management
  static async manageDependencies(projectId: string, dependencies: string[]) {
    const response = await api.post(
      `${this.BASE_URL}/${projectId}/dependencies`,
      {
        dependencies,
      }
    );
    return response.data;
  }

  static async getDependencyAnalysis(
    projectId: string
  ): Promise<ProjectDependencyAnalysis> {
    const response = await api.get(
      `${this.BASE_URL}/${projectId}/dependencies/analysis`
    );
    return response.data;
  }

  // Resource allocation
  static async updateResourceAllocation(
    projectId: string,
    resourceAllocation: ResourceAllocation
  ) {
    const response = await api.put(
      `${this.BASE_URL}/${projectId}/resource-allocation`,
      {
        resourceAllocation,
      }
    );
    return response.data;
  }

  static async getResourceAllocation(
    projectId: string
  ): Promise<ResourceAllocation> {
    const response = await api.get(
      `${this.BASE_URL}/${projectId}/resource-allocation`
    );
    return response.data;
  }

  static async getResourceUtilization(): Promise<ResourceUtilization> {
    const response = await api.get(`${this.BASE_URL}/resource-utilization`);
    return response.data;
  }

  // Timeline visualization
  static async getTimelineVisualization(params?: {
    dateFrom?: string;
    dateTo?: string;
    projectIds?: string[];
  }): Promise<TimelineVisualizationData> {
    const response = await api.get(`${this.BASE_URL}/timeline/visualization`, {
      params,
    });
    return response.data;
  }

  static async getTimelineStats() {
    const response = await api.get(`${this.BASE_URL}/timeline/stats`);
    return response.data;
  }

  static async getProjectTimeline(projectId: string) {
    const response = await api.get(`${this.BASE_URL}/${projectId}/timeline`);
    return response.data;
  }
}
