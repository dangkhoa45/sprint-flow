import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsMongoId, IsBoolean } from 'class-validator';
import { TaskPriority } from '../entities/task.entity';
import { BaseQuery } from 'src/shared/base.input';

export class TaskTemplateQueryDto extends BaseQuery<any> {
  @ApiProperty({ description: 'Template name search', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Filter by priority', required: false, enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  defaultPriority?: TaskPriority;

  @ApiProperty({ description: 'Filter by project ID', required: false })
  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @ApiProperty({ description: 'Filter by active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Filter by creator', required: false })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}