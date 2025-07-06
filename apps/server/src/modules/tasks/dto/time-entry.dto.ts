import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsDateString,
  IsString,
  IsEnum,
  IsMongoId,
  IsBoolean,
  IsArray,
  Min,
} from 'class-validator';
import { TimeEntryType } from '../entities/time-entry.entity';

export class CreateTimeEntryDto {
  @ApiProperty({ description: 'Duration in minutes' })
  @IsNumber()
  @Min(0)
  duration: number;

  @ApiProperty({ description: 'Start time' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: 'End time', required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Time entry type', enum: TimeEntryType, required: false })
  @IsOptional()
  @IsEnum(TimeEntryType)
  type?: TimeEntryType;

  @ApiProperty({ description: 'Task ID' })
  @IsMongoId()
  taskId: string;

  @ApiProperty({ description: 'Is billable', required: false })
  @IsOptional()
  @IsBoolean()
  isBillable?: boolean;

  @ApiProperty({ description: 'Hourly rate', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @ApiProperty({ description: 'Tags', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateTimeEntryDto {
  @ApiProperty({ description: 'Duration in minutes', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiProperty({ description: 'Start time', required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ description: 'End time', required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Is billable', required: false })
  @IsOptional()
  @IsBoolean()
  isBillable?: boolean;

  @ApiProperty({ description: 'Hourly rate', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @ApiProperty({ description: 'Tags', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}