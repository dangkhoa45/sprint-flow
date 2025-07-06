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

export class UpdateTaskTemplateDto {
  @ApiProperty({ description: 'Template name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Default task title', required: false })
  @IsOptional()
  @IsString()
  taskTitle?: string;

  @ApiProperty({ description: 'Default task description', required: false })
  @IsOptional()
  @IsString()
  taskDescription?: string;

  @ApiProperty({
    description: 'Default task priority',
    enum: TaskPriority,
    required: false,
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

  @ApiProperty({ description: 'Template active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}