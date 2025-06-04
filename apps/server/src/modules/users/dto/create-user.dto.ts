import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseInput } from 'src/shared/base.input';
import { UserRole, UserStatus } from '../entities/user.entity';

export class CreateUserDto extends BaseInput {
  @ApiProperty()
  displayName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ enum: UserStatus, default: UserStatus.Active })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty()
  tel?: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  avatar?: string;
}
