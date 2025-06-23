import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQuery } from 'src/shared/base.input';
import { AttachmentType, Attachment } from '../entities/attachment.entity';

export class AttachmentQueryDto extends BaseQuery<Attachment> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: AttachmentType, required: false })
  @IsOptional()
  @IsEnum(AttachmentType)
  type?: AttachmentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  uploadedBy?: string;
}
