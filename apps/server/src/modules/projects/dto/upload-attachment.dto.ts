import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadAttachmentDto {
  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Description of the file.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Comma-separated tags',
  })
  @IsOptional()
  @IsString()
  tags?: string;
}
