import { ApiProperty } from '@nestjs/swagger';
import { BaseQuery } from './base.input';

export class BadRequestResponse {
  @ApiProperty()
  message: string[];

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}

export class ListDataResponse<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  query: BaseQuery<T>;
}
