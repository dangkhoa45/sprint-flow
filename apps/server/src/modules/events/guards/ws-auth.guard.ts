import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { TokenPayload } from '../../auth/dto/tokenPayload';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      
      // Check if user is already authenticated from connection
      if (client.data.user) {
        return true;
      }

      // Fallback: try to extract token from message auth
      const data = context.switchToWs().getData();
      const token = data.token || client.handshake.auth.token;

      if (!token) {
        throw new WsException('No token provided');
      }

      const payload: TokenPayload = await this.jwtService.verifyAsync(token);
      
      // Store user info in socket
      client.data.user = payload;
      
      return true;
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }
}