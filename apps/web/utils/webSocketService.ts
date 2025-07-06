import { io, Socket } from 'socket.io-client';

export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
}

export interface TaskUpdateData {
  taskId: string;
  projectId: string;
  type: string;
  data?: any;
  timestamp: Date;
}

export interface ProjectUpdateData {
  projectId: string;
  type: string;
  data?: any;
  timestamp: Date;
}

export interface UserPresenceData {
  userId: string;
  username: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
}

export class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io('http://localhost:8005', {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚨 WebSocket connection error:', error);
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Real-time event listeners
    this.socket.on('notification', (data: NotificationData) => {
      this.emit('notification', data);
    });

    this.socket.on('task-updated', (data: TaskUpdateData) => {
      this.emit('task-updated', data);
    });

    this.socket.on('project-updated', (data: ProjectUpdateData) => {
      this.emit('project-updated', data);
    });

    this.socket.on('user-joined-project', (data: UserPresenceData) => {
      this.emit('user-joined-project', data);
    });

    this.socket.on('user-left-project', (data: UserPresenceData) => {
      this.emit('user-left-project', data);
    });

    this.socket.on('joined-project-room', (data: { projectId: string }) => {
      this.emit('joined-project-room', data);
    });

    this.socket.on('left-project-room', (data: { projectId: string }) => {
      this.emit('left-project-room', data);
    });
  }

  // Project room methods
  joinProjectRoom(projectId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join-project-room', { projectId });
    }
  }

  leaveProjectRoom(projectId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave-project-room', { projectId });
    }
  }

  // Event listener management
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Connection status
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Get socket instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();