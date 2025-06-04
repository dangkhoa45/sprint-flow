import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';

export const SearchMotorbike = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { search, searchFields } = request.query;

    if (searchFields === 'motorbikes') {
      try {
        request.query.search = new Types.ObjectId(search);
      } catch (error) {
        throw new Error('Invalid ObjectId format');
      }
    }
    return request.query;
  },
);
