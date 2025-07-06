import { api } from '@/utils/axiosConfig';
import {
  ProjectTemplate,
  CreateProjectTemplateDto,
  ProjectTemplateQueryDto,
  CreateProjectFromTemplateDto,
} from '@/types/project-template';
import { Project } from '@/types/project';

export class ProjectTemplateService {
  private static readonly BASE_URL = '/project-templates';

  static async getTemplates(query?: ProjectTemplateQueryDto) {
    const response = await api.get(this.BASE_URL, { params: query });
    return response.data;
  }

  static async getTemplate(id: string): Promise<ProjectTemplate> {
    const response = await api.get(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  static async createTemplate(
    data: CreateProjectTemplateDto
  ): Promise<ProjectTemplate> {
    const response = await api.post(this.BASE_URL, data);
    return response.data;
  }

  static async updateTemplate(
    id: string,
    data: Partial<CreateProjectTemplateDto>
  ): Promise<ProjectTemplate> {
    const response = await api.patch(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  static async deleteTemplate(id: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`);
  }

  static async getPopularTemplates(): Promise<ProjectTemplate[]> {
    const response = await api.get(`${this.BASE_URL}/popular`);
    return response.data;
  }

  static async getDefaultTemplates(): Promise<ProjectTemplate[]> {
    const response = await api.get(`${this.BASE_URL}/default`);
    return response.data;
  }

  static async rateTemplate(
    id: string,
    rating: number
  ): Promise<ProjectTemplate> {
    const response = await api.post(`${this.BASE_URL}/${id}/rate`, { rating });
    return response.data;
  }

  static async createProjectFromTemplate(
    templateId: string,
    data: Omit<CreateProjectFromTemplateDto, 'templateId'>
  ): Promise<Project> {
    const response = await api.post(
      `${this.BASE_URL}/${templateId}/create-project`,
      data
    );
    return response.data;
  }
}
