import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseQuery } from 'src/shared/base.input';
import { ProjectPriority, ProjectStatus } from '../entities/project.entity';
import { Project } from '../entities/project.entity';

export class ProjectQueryDto extends BaseQuery<Project> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: ProjectStatus, required: false })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({ enum: ProjectPriority, required: false })
  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;

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
  totalBudget: number;

  @ApiProperty()
  totalActualCost: number;

  @ApiProperty()
  averageProgress: number;
}
