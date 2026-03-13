import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional, IsObject } from 'class-validator';

export class ManageProjectDependenciesDto {
  @ApiProperty({
    type: [String],
    description: 'Array of project IDs that this project depends on',
  })
  @IsArray()
  @IsString({ each: true })
  dependencies: string[];
}

export class ResourceAllocationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  budget?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  spentBudget?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  teamMembers?: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  allocatedResources?: {
    resourceId: string;
    resourceType: string;
    allocation: number;
    startDate?: string;
    endDate?: string;
  }[];
}

export class UpdateResourceAllocationDto {
  @ApiProperty()
  @IsObject()
  resourceAllocation: ResourceAllocationDto;
}

export class ProjectDependencyInfo {
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  progress: number;

  @ApiProperty()
  endDate?: Date;

  @ApiProperty()
  isBlocking: boolean;
}

export class ProjectDependencyAnalysis {
  @ApiProperty({ type: [ProjectDependencyInfo] })
  dependencies: ProjectDependencyInfo[];

  @ApiProperty({ type: [ProjectDependencyInfo] })
  dependents: ProjectDependencyInfo[];

  @ApiProperty()
  canStart: boolean;

  @ApiProperty()
  blockedBy: string[];

  @ApiProperty()
  blocking: string[];

  @ApiProperty()
  criticalPath: string[];
}
