import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQuery } from 'src/shared/base.input';
import { MilestoneStatus, Milestone } from '../entities/milestone.entity';

export class MilestoneQueryDto extends BaseQuery<Milestone> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: MilestoneStatus, required: false })
  @IsOptional()
  @IsEnum(MilestoneStatus)
  status?: MilestoneStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dueDateFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dueDateTo?: string;
}
