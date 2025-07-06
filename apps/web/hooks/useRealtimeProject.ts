import { useEffect, useRef } from 'react';
import { useRealtime } from '../contexts/RealtimeContext';
import { TaskUpdateData, ProjectUpdateData, NotificationData } from '../utils/webSocketService';

interface UseRealtimeProjectProps {
  projectId: string;
  onTaskUpdate?: (data: TaskUpdateData) => void;
  onProjectUpdate?: (data: ProjectUpdateData) => void;
  onNotification?: (data: NotificationData) => void;
}

export const useRealtimeProject = ({
  projectId,
  onTaskUpdate,
  onProjectUpdate,
  onNotification,
}: UseRealtimeProjectProps) => {
  const { joinProjectRoom, leaveProjectRoom, onTaskUpdate: onTaskUpdateListener, onProjectUpdate: onProjectUpdateListener, onNotification: onNotificationListener, removeListener } = useRealtime();
  
  const callbacksRef = useRef({
    onTaskUpdate,
    onProjectUpdate,
    onNotification,
  });

  // Update callbacks ref when props change
  useEffect(() => {
    callbacksRef.current = {
      onTaskUpdate,
      onProjectUpdate,
      onNotification,
    };
  }, [onTaskUpdate, onProjectUpdate, onNotification]);

  useEffect(() => {
    if (!projectId) return;

    // Join project room
    joinProjectRoom(projectId);

    // Set up task update listener
    const handleTaskUpdate = (data: TaskUpdateData) => {
      if (data.projectId === projectId && callbacksRef.current.onTaskUpdate) {
        callbacksRef.current.onTaskUpdate(data);
      }
    };

    // Set up project update listener
    const handleProjectUpdate = (data: ProjectUpdateData) => {
      if (data.projectId === projectId && callbacksRef.current.onProjectUpdate) {
        callbacksRef.current.onProjectUpdate(data);
      }
    };

    // Set up notification listener
    const handleNotification = (data: NotificationData) => {
      if (callbacksRef.current.onNotification) {
        callbacksRef.current.onNotification(data);
      }
    };

    // Add listeners
    onTaskUpdateListener(handleTaskUpdate);
    onProjectUpdateListener(handleProjectUpdate);
    onNotificationListener(handleNotification);

    // Cleanup
    return () => {
      leaveProjectRoom(projectId);
      removeListener('task-updated', handleTaskUpdate);
      removeListener('project-updated', handleProjectUpdate);
      removeListener('notification', handleNotification);
    };
  }, [projectId, joinProjectRoom, leaveProjectRoom, onTaskUpdateListener, onProjectUpdateListener, onNotificationListener, removeListener]);

  return {
    // Can add more utilities here if needed
  };
};