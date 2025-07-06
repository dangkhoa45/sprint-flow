import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class BulkUpdateTaskDto {
  @ApiProperty({ description: 'Task IDs to update' })
  @IsArray()
  @IsMongoId({ each: true })
  taskIds: string[];

  @ApiProperty({ description: 'Task status', enum: TaskStatus, required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ description: 'Task priority', enum: TaskPriority, required: false })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ description: 'Assigned user ID', required: false })
  @IsOptional()
  @IsMongoId()
  assignedTo?: string;

  @ApiProperty({ description: 'Add tags', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addTags?: string[];

  @ApiProperty({ description: 'Remove tags', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  removeTags?: string[];
}

export class BulkDeleteTaskDto {
  @ApiProperty({ description: 'Task IDs to delete' })
  @IsArray()
  @IsMongoId({ each: true })
  taskIds: string[];

  @ApiProperty({ description: 'Force delete (skip dependency check)', required: false })
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}

export class CreateTaskFromTemplateDto {
  @ApiProperty({ description: 'Template ID' })
  @IsMongoId()
  templateId: string;

  @ApiProperty({ description: 'Project ID' })
  @IsMongoId()
  projectId: string;

  @ApiProperty({ description: 'Override task title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Override task description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Override assigned user', required: false })
  @IsOptional()
  @IsMongoId()
  assignedTo?: string;

  @ApiProperty({ description: 'Override due date', required: false })
  @IsOptional()
  @IsString()
  dueDate?: string;
}