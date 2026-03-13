import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './entities/project.entity';
import {
  ExportProjectsDto,
  ExportFormat,
  ExportType,
} from './dto/export-projects.dto';
import { ProjectsService } from './projects.service';
import { ProjectQueryDto } from './dto/project-query.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProjectExportService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private projectsService: ProjectsService,
  ) {}

  async exportProjects(
    exportDto: ExportProjectsDto,
    userId: string,
  ): Promise<{ filename: string; filePath: string; fileSize: number }> {
    // Build query based on export filters
    const query: ProjectQueryDto = {
      status: exportDto.status,
      priority: exportDto.priority,
      tags: exportDto.tags,
      startDateFrom: exportDto.startDateFrom,
      startDateTo: exportDto.startDateTo,
      endDateFrom: exportDto.endDateFrom,
      endDateTo: exportDto.endDateTo,
      owner: exportDto.owner,
      member: exportDto.member,
      search: exportDto.search,
      limit: 1000, // Set high limit for export
    };

    let data: any;
    let filename: string;

    switch (exportDto.type) {
      case ExportType.PROJECTS:
        data = await this.getProjectsData(query, userId);
        filename = `projects-${new Date().toISOString().split('T')[0]}`;
        break;
      case ExportType.PROJECT_DETAILS:
        if (!exportDto.projectId) {
          throw new BadRequestException(
            'Project ID is required for project details export',
          );
        }
        data = await this.getProjectDetailsData(exportDto.projectId, userId);
        filename = `project-details-${exportDto.projectId}-${new Date().toISOString().split('T')[0]}`;
        break;
      case ExportType.ANALYTICS:
        data = await this.getAnalyticsData(userId);
        filename = `analytics-${new Date().toISOString().split('T')[0]}`;
        break;
      default:
        throw new BadRequestException('Invalid export type');
    }

    // Generate file based on format
    let filePath: string;
    switch (exportDto.format) {
      case ExportFormat.PDF:
        filePath = this.generatePDF(data, filename, exportDto);
        break;
      case ExportFormat.EXCEL:
        filePath = this.generateExcel(data, filename, exportDto);
        break;
      case ExportFormat.CSV:
        filePath = this.generateCSV(data, filename, exportDto);
        break;
      default:
        throw new BadRequestException('Invalid export format');
    }

    const stats = fs.statSync(filePath);
    return {
      filename: path.basename(filePath),
      filePath,
      fileSize: stats.size,
    };
  }

  private async getProjectsData(query: ProjectQueryDto, userId: string) {
    const result = await this.projectsService.findAllWithQuery(query, userId);
    return result.data;
  }

  private async getProjectDetailsData(projectId: string, userId: string) {
    const project = await this.projectsService.findByIdWithAccess(
      projectId,
      userId,
    );
    return project;
  }

  private async getAnalyticsData(userId: string) {
    const stats = await this.projectsService.getAdvancedProjectStats(userId);
    return stats;
  }

  private generatePDF(
    data: any,
    filename: string,
    exportDto: ExportProjectsDto,
  ): string {
    // For now, return a mock implementation
    // In a real implementation, you would use puppeteer or similar
    const outputPath = path.join('/tmp', `${filename}.pdf`);

    // Mock PDF generation
    const mockPdfContent = `PDF Export: ${exportDto.title || 'Project Export'}\n\nData: ${JSON.stringify(data, null, 2)}`;
    fs.writeFileSync(outputPath, mockPdfContent);

    return outputPath;
  }

  private generateExcel(
    data: any,
    filename: string,
    exportDto: ExportProjectsDto,
  ): string {
    // For now, return a mock implementation
    // In a real implementation, you would use exceljs or similar
    const outputPath = path.join('/tmp', `${filename}.xlsx`);

    // Mock Excel generation
    const mockExcelContent = `Excel Export: ${exportDto.title || 'Project Export'}\n\nData: ${JSON.stringify(data, null, 2)}`;
    fs.writeFileSync(outputPath, mockExcelContent);

    return outputPath;
  }

  private generateCSV(
    data: any,
    filename: string,
    exportDto: ExportProjectsDto,
  ): string {
    const outputPath = path.join('/tmp', `${filename}.csv`);

    if (exportDto.type === ExportType.PROJECTS && Array.isArray(data)) {
      // Generate CSV for projects
      const headers = [
        'Name',
        'Description',
        'Status',
        'Priority',
        'Progress',
        'Owner',
        'Created At',
        'Updated At',
        'Start Date',
        'End Date',
        'Estimated Hours',
        'Actual Hours',
        'Tags',
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(project =>
          [
            `"${project.name || ''}"`,
            `"${project.description || ''}"`,
            `"${project.status || ''}"`,
            `"${project.priority || ''}"`,
            `"${project.progress || 0}"`,
            `"${project.owner?.displayName || project.owner?.username || ''}"`,
            `"${project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}"`,
            `"${project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : ''}"`,
            `"${project.startDate ? new Date(project.startDate).toLocaleDateString() : ''}"`,
            `"${project.endDate ? new Date(project.endDate).toLocaleDateString() : ''}"`,
            `"${project.estimatedHours || 0}"`,
            `"${project.actualHours || 0}"`,
            `"${project.tags ? project.tags.join('; ') : ''}"`,
          ].join(','),
        ),
      ].join('\n');

      fs.writeFileSync(outputPath, csvContent);
    } else {
      // Fallback for other data types
      const mockCsvContent = `CSV Export: ${exportDto.title || 'Project Export'}\n\nData: ${JSON.stringify(data, null, 2)}`;
      fs.writeFileSync(outputPath, mockCsvContent);
    }

    return outputPath;
  }
}
