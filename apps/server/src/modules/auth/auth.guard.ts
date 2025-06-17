import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decor';
import { getAccessTokenFromRequest } from 'src/utils/cookies';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctxHandler = context.getHandler();
    const ctxClass = context.getClass();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctxHandler,
      ctxClass,
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = getAccessTokenFromRequest(request);

    if (!token) {
      console.log('❌ AuthGuard: No token found, request denied');
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      console.log('✅ AuthGuard: Token verified successfully for user:', payload.una);
      return true;
    } catch (error) {
      console.log('❌ AuthGuard: Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
