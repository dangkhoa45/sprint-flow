import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ProjectPriority } from '../entities/project.entity';
import { TemplateCategory } from '../entities/project-template.entity';

export class CreateProjectTemplateDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ enum: TemplateCategory })
  @IsEnum(TemplateCategory)
  category: TemplateCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ enum: ProjectPriority, required: false })
  @IsOptional()
  @IsEnum(ProjectPriority)
  defaultPriority?: ProjectPriority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultEstimatedHours?: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  defaultTags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  defaultMetadata?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  tasksTemplate?: {
    title: string;
    description?: string;
    estimatedHours?: number;
    tags?: string[];
    priority?: string;
  }[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  milestonesTemplate?: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
  }[];
}

export class UpdateProjectTemplateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ enum: TemplateCategory, required: false })
  @IsOptional()
  @IsEnum(TemplateCategory)
  category?: TemplateCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ enum: ProjectPriority, required: false })
  @IsOptional()
  @IsEnum(ProjectPriority)
  defaultPriority?: ProjectPriority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultEstimatedHours?: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  defaultTags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  defaultMetadata?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  tasksTemplate?: {
    title: string;
    description?: string;
    estimatedHours?: number;
    tags?: string[];
    priority?: string;
  }[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  milestonesTemplate?: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
  }[];
}

export class RateTemplateDto {
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
