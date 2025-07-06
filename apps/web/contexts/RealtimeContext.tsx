'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { webSocketService, NotificationData, TaskUpdateData, ProjectUpdateData } from '../utils/webSocketService';

interface RealtimeContextType {
  isConnected: boolean;
  notifications: NotificationData[];
  joinProjectRoom: (projectId: string) => void;
  leaveProjectRoom: (projectId: string) => void;
  clearNotifications: () => void;
  onTaskUpdate: (callback: (data: TaskUpdateData) => void) => void;
  onProjectUpdate: (callback: (data: ProjectUpdateData) => void) => void;
  onNotification: (callback: (data: NotificationData) => void) => void;
  removeListener: (event: string, callback: Function) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    
    const initWebSocket = () => {
      // Get token from cookie
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {} as Record<string, string>);

      const host = window.location.host;
      const accessToken = cookies[`${host}:at`];

      if (accessToken) {
        webSocketService.connect(accessToken);
        
        // Set up connection status listener
        webSocketService.on('connect', () => {
          setIsConnected(true);
          console.log('🔌 Real-time connection established');
        });

        webSocketService.on('disconnect', () => {
          setIsConnected(false);
          console.log('❌ Real-time connection lost');
        });

        // Set up notification listener
        webSocketService.on('notification', (data: NotificationData) => {
          setNotifications(prev => [data, ...prev.slice(0, 49)]); // Keep max 50 notifications
        });

        isInitialized.current = true;
      }
    };

    initWebSocket();

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const joinProjectRoom = (projectId: string) => {
    webSocketService.joinProjectRoom(projectId);
  };

  const leaveProjectRoom = (projectId: string) => {
    webSocketService.leaveProjectRoom(projectId);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const onTaskUpdate = (callback: (data: TaskUpdateData) => void) => {
    webSocketService.on('task-updated', callback);
  };

  const onProjectUpdate = (callback: (data: ProjectUpdateData) => void) => {
    webSocketService.on('project-updated', callback);
  };

  const onNotification = (callback: (data: NotificationData) => void) => {
    webSocketService.on('notification', callback);
  };

  const removeListener = (event: string, callback: Function) => {
    webSocketService.off(event, callback);
  };

  const value: RealtimeContextType = {
    isConnected,
    notifications,
    joinProjectRoom,
    leaveProjectRoom,
    clearNotifications,
    onTaskUpdate,
    onProjectUpdate,
    onNotification,
    removeListener,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};