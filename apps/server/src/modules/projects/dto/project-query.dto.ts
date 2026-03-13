import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { BaseQuery } from 'src/shared/base.input';
import { ProjectPriority, ProjectStatus } from '../entities/project.entity';
import { Project } from '../entities/project.entity';
import { Transform } from 'class-transformer';

export class ProjectQueryDto extends BaseQuery<Project> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ type: [String], enum: ProjectStatus, required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(ProjectStatus, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: ProjectStatus[];

  @ApiProperty({ type: [String], enum: ProjectPriority, required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(ProjectPriority, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  priority?: ProjectPriority[];

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
  @IsDateString()
  startDateFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDateTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDateFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDateTo?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  // Enhanced filtering options
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progressFrom?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progressTo?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHoursFrom?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHoursTo?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actualHoursFrom?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actualHoursTo?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  overdue?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  myProjects?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  myOwnedProjects?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  updatedFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  updatedTo?: string;

  // Advanced search options
  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchFields?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  exactMatch?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  caseSensitive?: boolean;
}

export class ProjectStatsDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  planning: number;

  @ApiProperty()
  inProgress: number;

  @ApiProperty()
  completed: number;

  @ApiProperty()
  onHold: number;

  @ApiProperty()
  cancelled: number;

  @ApiProperty()
  overdue: number;

  @ApiProperty()
  averageProgress: number;
}

export class ProjectAdvancedStatsDto extends ProjectStatsDto {
  @ApiProperty()
  totalEstimatedHours: number;

  @ApiProperty()
  totalActualHours: number;

  @ApiProperty()
  averageEstimatedHours: number;

  @ApiProperty()
  averageActualHours: number;

  @ApiProperty()
  projectsCreatedThisMonth: number;

  @ApiProperty()
  projectsCompletedThisMonth: number;

  @ApiProperty()
  mostUsedTags: { tag: string; count: number }[];

  @ApiProperty()
  projectsByPriority: { priority: string; count: number }[];

  @ApiProperty()
  projectsByStatus: { status: string; count: number }[];

  @ApiProperty()
  efficiencyRatio: number; // actual vs estimated hours ratio
}
