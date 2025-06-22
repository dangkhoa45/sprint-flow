import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SwaggerHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Auto-fill headers for Swagger if not provided
    if (!request.headers['x-user-agent']) {
      request.headers['x-user-agent'] =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    }

    if (!request.headers['x-forwarded-for']) {
      request.headers['x-forwarded-for'] = '127.0.0.1';
    }

    return next.handle();
  }
}
