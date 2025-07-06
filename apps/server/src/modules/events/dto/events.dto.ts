import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class JoinProjectRoomDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;
}

export class LeaveProjectRoomDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;
}

export class NotificationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  data?: any;

  @IsDateString()
  timestamp: Date;
}

export class TaskUpdateDto {
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  data?: any;

  @IsDateString()
  timestamp: Date;
}

export class ProjectUpdateDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  data?: any;

  @IsDateString()
  timestamp: Date;
}

export class UserPresenceDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  status: 'online' | 'offline';

  @IsOptional()
  lastSeen?: Date;
}