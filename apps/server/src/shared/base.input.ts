import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export abstract class BaseInput {
  @ApiProperty({ required: false })
  status?: string;
  updatedBy?: Types.ObjectId;
  createdBy?: Types.ObjectId;
}

export enum SortOrder {
  Desc = 'desc',
  Asc = 'asc',
}

export class BaseQuery<T> {
  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  offset?: number;

  @ApiProperty({ required: false })
  limit?: number;

  @ApiProperty({ required: false })
  search?: string;

  @ApiProperty({ required: false, type: String, isArray: true })
  searchFields?: (keyof T)[];

  @ApiProperty({ required: false, type: String, isArray: true })
  populate?: (keyof T)[];

  @ApiProperty({ required: false, type: String })
  sortField?: keyof T;

  @ApiProperty({ required: false, enum: SortOrder })
  sortOrder?: SortOrder;
}

export class TimeFrameQuery<T> extends BaseQuery<T> {
  @ApiProperty({ required: false })
  startTime?: string;

  @ApiProperty({ required: false })
  endTime?: string;

  @ApiProperty({ required: false, type: String })
  timeField?: keyof T;

  @ApiProperty({ required: false })
  timeUnit?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute';
}

// Type aliases for backward compatibility
export type BaseQueryAny = BaseQuery<Record<string, unknown>>;
export type TimeFrameQueryAny = TimeFrameQuery<Record<string, unknown>>;
