import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectStatus, ProjectPriority } from '../entities/project.entity';

export enum ExportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
}

export enum ExportType {
  PROJECTS = 'projects',
  PROJECT_DETAILS = 'project-details',
  ANALYTICS = 'analytics',
}

export class ExportProjectsDto {
  @ApiProperty({ enum: ExportFormat })
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @ApiProperty({ enum: ExportType })
  @IsEnum(ExportType)
  type: ExportType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  // Filter options for export
  @ApiProperty({ type: [String], enum: ProjectStatus, required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(ProjectStatus, { each: true })
  status?: ProjectStatus[];

  @ApiProperty({ type: [String], enum: ProjectPriority, required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(ProjectPriority, { each: true })
  priority?: ProjectPriority[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  startDateFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  startDateTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endDateFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endDateTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  owner?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  member?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  projectId?: string; // For single project export
}

export class ExportResponseDto {
  @ApiProperty()
  filename: string;

  @ApiProperty()
  downloadUrl: string;

  @ApiProperty()
  fileSize: number;

  @ApiProperty()
  generatedAt: Date;

  @ApiProperty()
  expiresAt: Date;
}
