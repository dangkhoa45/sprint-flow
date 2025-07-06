import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId, IsArray } from 'class-validator';

export class CreateTaskCommentDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Task ID' })
  @IsMongoId()
  taskId: string;

  @ApiProperty({ description: 'Parent comment ID for replies', required: false })
  @IsOptional()
  @IsMongoId()
  parentId?: string;

  @ApiProperty({ description: 'Mentioned user IDs', required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  mentions?: string[];
}

export class UpdateTaskCommentDto {
  @ApiProperty({ description: 'Comment content', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'Mentioned user IDs', required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  mentions?: string[];
}