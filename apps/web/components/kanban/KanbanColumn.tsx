'use client';
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import { Task, TaskStatus } from '@/types/task';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export default function KanbanColumn({
  columnId,
  title,
  tasks,
  onTaskClick,
}: KanbanColumnProps) {
  const theme = useTheme();

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return theme.palette.warning.main;
      case TaskStatus.IN_PROGRESS:
        return theme.palette.info.main;
      case TaskStatus.REVIEW:
        return theme.palette.secondary.main;
      case TaskStatus.DONE:
        return theme.palette.success.main;
      case TaskStatus.CANCELLED:
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getColumnTitle = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'Cần làm';
      case TaskStatus.IN_PROGRESS:
        return 'Đang làm';
      case TaskStatus.REVIEW:
        return 'Đang review';
      case TaskStatus.DONE:
        return 'Hoàn thành';
      case TaskStatus.CANCELLED:
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const columnColor = getColumnColor(columnId as TaskStatus);

  return (
    <Box sx={{ minWidth: 300, width: 300, display: 'flex', flexDirection: 'column' }}>
      {/* Column Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          px: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: columnColor,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.primary',
            }}
          >
            {getColumnTitle(columnId as TaskStatus)}
          </Typography>
        </Box>
        <Chip
          label={tasks.length}
          size="small"
          sx={{
            bgcolor: `${columnColor}15`,
            color: columnColor,
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 22,
            minWidth: 22,
            '& .MuiChip-label': { px: 0.5 },
          }}
        />
      </Box>

      {/* Droppable Area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              minHeight: 200,
              p: 1,
              borderRadius: 2,
              bgcolor: snapshot.isDraggingOver
                ? `${columnColor}08`
                : theme.palette.grey[50],
              border: `2px dashed ${
                snapshot.isDraggingOver ? columnColor : theme.palette.divider
              }`,
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onTaskClick={onTaskClick}
              />
            ))}
            {provided.placeholder}
            
            {/* Empty state */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 100,
                  color: 'text.secondary',
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Chưa có công việc nào
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Droppable>
    </Box>
  );
}