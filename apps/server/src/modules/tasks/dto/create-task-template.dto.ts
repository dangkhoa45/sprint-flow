import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
  IsMongoId,
  IsBoolean,
} from 'class-validator';
import { TaskPriority } from '../entities/task.entity';

export class CreateTaskTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Default task title' })
  @IsString()
  taskTitle: string;

  @ApiProperty({ description: 'Default task description', required: false })
  @IsOptional()
  @IsString()
  taskDescription?: string;

  @ApiProperty({
    description: 'Default task priority',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  defaultPriority?: TaskPriority;

  @ApiProperty({ description: 'Default estimated time in hours', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultEstimatedTime?: number;

  @ApiProperty({ description: 'Default task tags', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  defaultTags?: string[];

  @ApiProperty({ description: 'Project ID (optional for global templates)', required: false })
  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @ApiProperty({ description: 'Template active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}