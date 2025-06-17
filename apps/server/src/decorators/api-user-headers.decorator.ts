import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiUserHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'x-user-agent',
      description: 'Browser User Agent string (auto-filled in Swagger)',
      required: false,
      schema: {
        type: 'string',
        default: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    }),
    ApiHeader({
      name: 'x-forwarded-for',
      description: 'Client IP address (auto-filled in Swagger)',
      required: false,
      schema: {
        type: 'string',
        default: '127.0.0.1',
        example: '192.168.1.100',
      },
    }),
  );
}
