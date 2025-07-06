# 🚀 Real-time Collaboration System Documentation

## Overview

The real-time collaboration system has been successfully implemented for SprintFlow, providing instant updates and live notifications across the application. This system uses Socket.IO for WebSocket connections between the frontend and backend.

## Architecture

### Backend Components

#### 1. EventsGateway (`/apps/server/src/modules/events/events.gateway.ts`)

- Main WebSocket gateway handling client connections
- JWT-based authentication for WebSocket connections
- Room-based messaging for project collaboration
- Handles events: `join-project-room`, `leave-project-room`

#### 2. EventsService (`/apps/server/src/modules/events/events.service.ts`)

- Manages connected users and their socket connections
- Tracks user presence and online status
- Provides utilities for user connection management

#### 3. WsAuthGuard (`/apps/server/src/modules/events/guards/ws-auth.guard.ts`)

- Authentication guard for WebSocket messages
- Validates JWT tokens for real-time communication
- Ensures secure WebSocket connections

#### 4. Real-time Event DTOs (`/apps/server/src/modules/events/dto/events.dto.ts`)

- Type definitions for real-time events
- Includes: `TaskUpdateDto`, `ProjectUpdateDto`, `NotificationDto`

### Frontend Components

#### 1. WebSocketService (`/apps/web/utils/webSocketService.ts`)

- Singleton service managing Socket.IO client connections
- Handles authentication, reconnection, and event management
- Provides type-safe event listeners

#### 2. RealtimeContext (`/apps/web/contexts/RealtimeContext.tsx`)

- React context for managing real-time state
- Provides hooks for real-time functionality
- Manages notifications and connection status

#### 3. RealtimeNotifications (`/apps/web/components/RealtimeNotifications.tsx`)

- UI component for displaying live notifications
- Shows connection status and notification badges
- Integrated into the main header

#### 4. useRealtimeProject Hook (`/apps/web/hooks/useRealtimeProject.ts`)

- Custom hook for project-specific real-time updates
- Automatically joins/leaves project rooms
- Provides callbacks for task and project updates

## Features Implemented

### 🔐 Authentication

- JWT token-based WebSocket authentication
- Secure connection establishment with user validation
- Automatic token extraction from cookies

### 🏠 Room-based Messaging

- Users automatically join project-specific rooms
- Real-time updates scoped to project members
- Clean room management on connect/disconnect

### 📝 Task Real-time Updates

- Live task creation notifications
- Real-time task status changes
- Assignment notifications for team members
- Automatic UI updates when tasks are modified

### 🚨 Live Notifications

- Real-time notification system in header
- Visual indicators for new notifications
- Categorized notification types with color coding
- Timestamp and message formatting

### 👥 User Presence

- Track online/offline status of team members
- Connection status indicators
- User presence in project rooms

## Real-time Events

### Task Events

- `task-created`: When a new task is created
- `task-updated`: When task details are modified
- `task-assigned`: When a task is assigned to a user
- `status-changed`: When task status is updated

### Project Events

- `project-updated`: When project details change
- `member-added`: When new members join a project
- `user-joined-project`: When user joins project room
- `user-left-project`: When user leaves project room

### Notification Events

- `notification`: General notification system
- Support for different notification types and priorities

## Integration Points

### TasksService Integration

The `TasksService` has been enhanced to emit real-time events:

- Task creation triggers `task-created` event
- Task updates trigger `task-updated` event
- Status changes trigger `status-changed` event
- Assignment changes trigger notifications

### Frontend Integration

- Main layout includes `RealtimeProvider`
- Header component shows live notifications
- Project detail pages automatically join project rooms
- Real-time updates trigger UI refreshes

## Usage Examples

### Backend - Emitting Events

```typescript
// In TasksService
this.eventsGateway.emitTaskUpdate(projectId, {
  taskId: savedTask._id.toString(),
  projectId: createTaskDto.projectId,
  type: 'task-created',
  data: { task: savedTask },
  timestamp: new Date(),
});
```

### Frontend - Listening to Events

```typescript
// In React component
const { onTaskUpdate, joinProjectRoom } = useRealtime();

useEffect(() => {
  joinProjectRoom(projectId);

  const handleTaskUpdate = data => {
    console.log('Task updated:', data);
    // Refresh UI data
  };

  onTaskUpdate(handleTaskUpdate);
}, [projectId]);
```

## Security Considerations

1. **Authentication**: All WebSocket connections require valid JWT tokens
2. **Authorization**: Users can only join rooms for projects they have access to
3. **Data Validation**: All event data is validated using DTOs
4. **Room Isolation**: Project updates are only sent to authorized project members

## Performance Features

1. **Connection Pooling**: Efficient management of WebSocket connections
2. **Event Filtering**: Only relevant events are sent to clients
3. **Automatic Reconnection**: Robust handling of connection failures
4. **Memory Management**: Proper cleanup of event listeners

## Future Enhancements

1. **Typing Indicators**: Show when users are typing in shared spaces
2. **File Upload Progress**: Real-time file upload status
3. **Collaborative Editing**: Real-time document collaboration
4. **Advanced Presence**: Show what users are currently viewing
5. **Message History**: Persistent notification history
6. **Push Notifications**: Browser push notifications for offline users

## Configuration

### Environment Variables

- `APP_SECRET`: JWT secret for WebSocket authentication
- WebSocket server runs on the same port as the main NestJS server

### CORS Configuration

```typescript
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8000',
    credentials: true,
  },
})
```

This real-time collaboration system provides a solid foundation for team collaboration in SprintFlow, with room for future enhancements and scaling.
