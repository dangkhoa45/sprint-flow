import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../auth/dto/tokenPayload';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { EventsService } from './events.service';
import {
  JoinProjectRoomDto,
  LeaveProjectRoomDto,
  NotificationDto,
  TaskUpdateDto,
  ProjectUpdateDto,
} from './dto/events.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8000',
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  constructor(
    private jwtService: JwtService,
    private eventsService: EventsService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake auth
      const token = client.handshake.auth.token;
      
      if (!token) {
        this.logger.warn('Client connecting without token');
        client.disconnect();
        return;
      }

      const payload: TokenPayload = await this.jwtService.verifyAsync(token);
      
      // Store user info in socket
      client.data.user = payload;
      
      this.logger.log(`Client connected: ${payload.una} (${client.id})`);
      
      // Join user-specific room for notifications
      client.join(`user:${payload.sub}`);
      
      // Notify about user connection
      this.eventsService.handleUserConnection(payload.sub, client.id);
      
    } catch (error) {
      this.logger.error('Connection authentication failed', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.user) {
      this.logger.log(`Client disconnected: ${client.data.user.una} (${client.id})`);
      this.eventsService.handleUserDisconnection(client.data.user.sub, client.id);
    }
  }

  @SubscribeMessage('join-project-room')
  @UseGuards(WsAuthGuard)
  handleJoinProjectRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinProjectRoomDto,
  ) {
    const { projectId } = data;
    const user = client.data.user;

    // Join project room
    client.join(`project:${projectId}`);
    
    this.logger.log(`User ${user.una} joined project room: ${projectId}`);
    
    // Notify others in the project room
    client.to(`project:${projectId}`).emit('user-joined-project', {
      userId: user.sub,
      username: user.una,
      projectId,
    });

    // Send confirmation to client
    client.emit('joined-project-room', { projectId });
  }

  @SubscribeMessage('leave-project-room')
  @UseGuards(WsAuthGuard)
  handleLeaveProjectRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LeaveProjectRoomDto,
  ) {
    const { projectId } = data;
    const user = client.data.user;

    // Leave project room
    client.leave(`project:${projectId}`);
    
    this.logger.log(`User ${user.una} left project room: ${projectId}`);
    
    // Notify others in the project room
    client.to(`project:${projectId}`).emit('user-left-project', {
      userId: user.sub,
      username: user.una,
      projectId,
    });

    // Send confirmation to client
    client.emit('left-project-room', { projectId });
  }

  // Server-side methods for emitting events

  emitTaskUpdate(projectId: string, taskUpdate: TaskUpdateDto) {
    this.server.to(`project:${projectId}`).emit('task-updated', taskUpdate);
  }

  emitProjectUpdate(projectId: string, projectUpdate: ProjectUpdateDto) {
    this.server.to(`project:${projectId}`).emit('project-updated', projectUpdate);
  }

  emitNotification(userId: string, notification: NotificationDto) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  emitTaskAssigned(userId: string, taskId: string, projectId: string) {
    const notification: NotificationDto = {
      id: Date.now().toString(),
      type: 'task-assigned',
      title: 'Task Assigned',
      message: 'You have been assigned a new task',
      data: { taskId, projectId },
      timestamp: new Date(),
    };

    this.emitNotification(userId, notification);
  }

  emitTaskStatusChanged(projectId: string, taskId: string, newStatus: string, updatedBy: string) {
    const taskUpdate: TaskUpdateDto = {
      taskId,
      projectId,
      type: 'status-changed',
      data: { status: newStatus, updatedBy },
      timestamp: new Date(),
    };

    this.emitTaskUpdate(projectId, taskUpdate);
  }

  emitProjectMemberAdded(projectId: string, userId: string, addedBy: string) {
    const projectUpdate: ProjectUpdateDto = {
      projectId,
      type: 'member-added',
      data: { userId, addedBy },
      timestamp: new Date(),
    };

    this.emitProjectUpdate(projectId, projectUpdate);
  }

  getConnectedUsers(): string[] {
    return this.eventsService.getConnectedUsers();
  }

  getUserStatus(userId: string): boolean {
    return this.eventsService.isUserConnected(userId);
  }
}