'use client';
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  AccessTime,
  Assignment,
  Person,
  CalendarToday,
} from '@mui/icons-material';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  index: number;
  onTaskClick?: (task: Task) => void;
}

export default function TaskCard({ task, index, onTaskClick }: TaskCardProps) {
  const theme = useTheme();

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return theme.palette.success.main;
      case TaskPriority.MEDIUM:
        return theme.palette.info.main;
      case TaskPriority.HIGH:
        return theme.palette.warning.main;
      case TaskPriority.URGENT:
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'Thấp';
      case TaskPriority.MEDIUM:
        return 'Trung bình';
      case TaskPriority.HIGH:
        return 'Cao';
      case TaskPriority.URGENT:
        return 'Khẩn cấp';
      default:
        return priority;
    }
  };

  const handleClick = () => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            marginBottom: theme.spacing(1),
          }}
        >
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
                borderColor: theme.palette.primary.main,
              },
              ...(snapshot.isDragging && {
                transform: 'rotate(5deg)',
                boxShadow: theme.shadows[8],
              }),
            }}
            onClick={handleClick}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  mb: 1,
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {task.title}
              </Typography>

              {/* Description */}
              {task.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontSize: '0.75rem',
                  }}
                >
                  {task.description}
                </Typography>
              )}

              {/* Priority */}
              <Box sx={{ mb: 1.5 }}>
                <Chip
                  label={getPriorityLabel(task.priority)}
                  size="small"
                  sx={{
                    bgcolor: `${getPriorityColor(task.priority)}15`,
                    color: getPriorityColor(task.priority),
                    fontWeight: 500,
                    fontSize: '0.6875rem',
                    height: 20,
                  }}
                />
              </Box>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {task.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.625rem',
                          height: 18,
                          '& .MuiChip-label': { px: 0.5 },
                        }}
                      />
                    ))}
                    {task.tags.length > 3 && (
                      <Chip
                        label={`+${task.tags.length - 3}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.625rem',
                          height: 18,
                          '& .MuiChip-label': { px: 0.5 },
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )}

              {/* Footer */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Assignee */}
                  {task.assignedTo && (
                    <Tooltip title={task.assignedTo.displayName}>
                      <Avatar
                        src={task.assignedTo.avatar}
                        sx={{
                          width: 20,
                          height: 20,
                          fontSize: '0.625rem',
                          bgcolor: theme.palette.primary.main,
                        }}
                      >
                        {task.assignedTo.displayName.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  )}

                  {/* Due Date */}
                  {task.dueDate && (
                    <Tooltip title={`Hạn: ${format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: vi })}`}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: new Date(task.dueDate) < new Date() 
                            ? theme.palette.error.main 
                            : theme.palette.text.secondary,
                        }}
                      >
                        <CalendarToday sx={{ fontSize: 12 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.625rem' }}>
                          {format(new Date(task.dueDate), 'dd/MM', { locale: vi })}
                        </Typography>
                      </Box>
                    </Tooltip>
                  )}
                </Box>

                {/* Estimated Time */}
                {task.estimatedTime && (
                  <Tooltip title={`Thời gian ước tính: ${task.estimatedTime}h`}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      <AccessTime sx={{ fontSize: 12 }} />
                      <Typography variant="caption" sx={{ fontSize: '0.625rem' }}>
                        {task.estimatedTime}h
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
              </Box>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}