import { ApiProperty } from '@nestjs/swagger';

export class AvatarUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  avatar?: Express.Multer.File;
}
