import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventsService {
  private logger = new Logger('EventsService');
  
  // Store connected users and their socket IDs
  private connectedUsers = new Map<string, Set<string>>();

  handleUserConnection(userId: string, socketId: string) {
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    
    this.connectedUsers.get(userId)!.add(socketId);
    
    this.logger.log(`User ${userId} connected with socket ${socketId}`);
    this.logger.log(`Total connected users: ${this.connectedUsers.size}`);
  }

  handleUserDisconnection(userId: string, socketId: string) {
    if (this.connectedUsers.has(userId)) {
      this.connectedUsers.get(userId)!.delete(socketId);
      
      // Remove user entry if no more connections
      if (this.connectedUsers.get(userId)!.size === 0) {
        this.connectedUsers.delete(userId);
      }
    }
    
    this.logger.log(`User ${userId} disconnected socket ${socketId}`);
    this.logger.log(`Total connected users: ${this.connectedUsers.size}`);
  }

  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId) && this.connectedUsers.get(userId)!.size > 0;
  }

  getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  getUserSocketIds(userId: string): string[] {
    return this.connectedUsers.has(userId) 
      ? Array.from(this.connectedUsers.get(userId)!)
      : [];
  }

  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get online status for multiple users
  getUsersOnlineStatus(userIds: string[]): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    
    userIds.forEach(userId => {
      status[userId] = this.isUserConnected(userId);
    });
    
    return status;
  }
}