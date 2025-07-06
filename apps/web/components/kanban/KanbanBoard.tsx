'use client';
import React, { useState, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Search,
  FilterList,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { tasksApi } from '@/api/tasks';
import { useToast } from '@/hooks/useToast';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  onTaskClick?: (task: Task) => void;
  projectId?: string;
}

const COLUMNS = [
  { id: TaskStatus.TODO, title: 'Cần làm' },
  { id: TaskStatus.IN_PROGRESS, title: 'Đang làm' },
  { id: TaskStatus.REVIEW, title: 'Đang review' },
  { id: TaskStatus.DONE, title: 'Hoàn thành' },
  { id: TaskStatus.CANCELLED, title: 'Đã hủy' },
];

// Demo data for testing when API is not available
const DEMO_TASKS: Task[] = [
  {
    _id: '1',
    title: 'Thiết kế giao diện đăng nhập',
    description: 'Tạo mockup và implement UI cho trang đăng nhập với Material-UI',
    projectId: { _id: 'proj1', name: 'SprintFlow Web', status: 'active' },
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    assignedTo: {
      _id: 'user1',
      username: 'alice',
      displayName: 'Alice Nguyễn',
      avatar: undefined,
    },
    createdBy: {
      _id: 'user2',
      username: 'bob',
      displayName: 'Bob Trần',
      avatar: undefined,
    },
    dueDate: '2024-01-15',
    estimatedTime: 8,
    actualTime: undefined,
    tags: ['frontend', 'ui/ux', 'mui'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '2',
    title: 'Implement Kanban Board',
    description: 'Xây dựng bảng Kanban với drag-and-drop functionality sử dụng @hello-pangea/dnd',
    projectId: { _id: 'proj1', name: 'SprintFlow Web', status: 'active' },
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.URGENT,
    assignedTo: {
      _id: 'user2',
      username: 'bob',
      displayName: 'Bob Trần',
      avatar: undefined,
    },
    createdBy: {
      _id: 'user1',
      username: 'alice',
      displayName: 'Alice Nguyễn',
      avatar: undefined,
    },
    dueDate: '2024-01-10',
    estimatedTime: 16,
    actualTime: 12,
    tags: ['frontend', 'kanban', 'drag-drop'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-05',
  },
  {
    _id: '3',
    title: 'API Authentication',
    description: 'Implement JWT authentication cho backend API với refresh token support',
    projectId: { _id: 'proj1', name: 'SprintFlow Web', status: 'active' },
    status: TaskStatus.REVIEW,
    priority: TaskPriority.HIGH,
    assignedTo: {
      _id: 'user3',
      username: 'charlie',
      displayName: 'Charlie Lê',
      avatar: undefined,
    },
    createdBy: {
      _id: 'user1',
      username: 'alice',
      displayName: 'Alice Nguyễn',
      avatar: undefined,
    },
    dueDate: '2024-01-08',
    estimatedTime: 12,
    actualTime: 10,
    tags: ['backend', 'auth', 'jwt'],
    createdAt: '2023-12-28',
    updatedAt: '2024-01-06',
  },
  {
    _id: '4',
    title: 'Database Schema Design',
    description: 'Thiết kế schema MongoDB cho users, projects, tasks và relationships',
    projectId: { _id: 'proj1', name: 'SprintFlow Web', status: 'active' },
    status: TaskStatus.DONE,
    priority: TaskPriority.MEDIUM,
    assignedTo: {
      _id: 'user4',
      username: 'diana',
      displayName: 'Diana Phạm',
      avatar: undefined,
    },
    createdBy: {
      _id: 'user1',
      username: 'alice',
      displayName: 'Alice Nguyễn',
      avatar: undefined,
    },
    dueDate: '2023-12-30',
    estimatedTime: 6,
    actualTime: 8,
    tags: ['backend', 'database', 'mongodb'],
    createdAt: '2023-12-25',
    updatedAt: '2023-12-30',
  },
  {
    _id: '5',
    title: 'Unit Testing Setup',
    description: 'Setup Jest và testing utilities cho frontend và backend',
    projectId: { _id: 'proj1', name: 'SprintFlow Web', status: 'active' },
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    assignedTo: undefined,
    createdBy: {
      _id: 'user2',
      username: 'bob',
      displayName: 'Bob Trần',
      avatar: undefined,
    },
    dueDate: '2024-01-20',
    estimatedTime: 4,
    actualTime: undefined,
    tags: ['testing', 'jest', 'quality'],
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
];

export default function KanbanBoard({
  tasks,
  onTaskUpdate,
  onTaskClick,
  projectId,
}: KanbanBoardProps) {
  const theme = useTheme();
  const { success, error } = useToast();

  // Use demo data if tasks array is empty (for demonstration)
  const effectiveTasks = tasks.length > 0 ? tasks : DEMO_TASKS;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | ''>('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter tasks based on search and filters
  const filteredTasks = effectiveTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = !selectedPriority || task.priority === selectedPriority;
    
    const matchesAssignee = !selectedAssignee || 
                           task.assignedTo?.displayName.toLowerCase().includes(selectedAssignee.toLowerCase());

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  // Group tasks by status
  const tasksByStatus = COLUMNS.reduce((acc, column) => {
    acc[column.id] = filteredTasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  // Handle drag and drop
  const onDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // If dropped outside or no change in position
    if (!destination || 
        (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    
    try {
      // For demo purposes, show success message even without API
      if (tasks.length === 0) {
        // Demo mode - just show success
        success(`Công việc đã được chuyển sang "${getStatusLabel(newStatus)}" (Demo mode)`);
        return;
      }

      // Update task status via API
      await tasksApi.updateTask(draggableId, {
        status: newStatus,
      });

      success(`Công việc đã được chuyển sang "${getStatusLabel(newStatus)}"`);
      onTaskUpdate(); // Refresh task list
    } catch (err) {
      error('Có lỗi khi cập nhật trạng thái công việc');
      console.error('Error updating task status:', err);
    }
  }, [tasks.length, onTaskUpdate, success, error]);

  const getStatusLabel = (status: TaskStatus) => {
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPriority('');
    setSelectedAssignee('');
  };

  // Get unique assignees from tasks
  const uniqueAssignees = Array.from(
    new Set(effectiveTasks.map(task => task.assignedTo?.displayName).filter(Boolean))
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Demo Mode Notice */}
      {tasks.length === 0 && (
        <Box sx={{ 
          mb: 2, 
          p: 2, 
          bgcolor: theme.palette.info.light, 
          borderRadius: 1,
          border: `1px solid ${theme.palette.info.main}`,
        }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.info.dark }}>
            📋 Demo Mode: Hiển thị dữ liệu mẫu để demo chức năng Kanban Board. 
            Drag-and-drop đã hoạt động!
          </Typography>
        </Box>
      )}

      {/* Header with Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Bảng Kanban
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ textTransform: 'none' }}
          >
            Bộ lọc
          </Button>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm công việc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Filters */}
        <Collapse in={showFilters}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap', 
            alignItems: 'center',
            p: 2,
            bgcolor: theme.palette.grey[50],
            borderRadius: 1,
            mb: 2
          }}>
            {/* Priority Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Độ ưu tiên</InputLabel>
              <Select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as TaskPriority)}
                label="Độ ưu tiên"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value={TaskPriority.LOW}>Thấp</MenuItem>
                <MenuItem value={TaskPriority.MEDIUM}>Trung bình</MenuItem>
                <MenuItem value={TaskPriority.HIGH}>Cao</MenuItem>
                <MenuItem value={TaskPriority.URGENT}>Khẩn cấp</MenuItem>
              </Select>
            </FormControl>

            {/* Assignee Filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Người được giao</InputLabel>
              <Select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                label="Người được giao"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {uniqueAssignees.map((assignee) => (
                  <MenuItem key={assignee} value={assignee}>
                    {assignee}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Clear Filters Button */}
            <Button
              variant="outlined"
              onClick={clearFilters}
              sx={{ textTransform: 'none' }}
            >
              Xóa bộ lọc
            </Button>
          </Box>
        </Collapse>

        {/* Active Filters */}
        {(searchTerm || selectedPriority || selectedAssignee) && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {searchTerm && (
              <Chip
                label={`Tìm kiếm: "${searchTerm}"`}
                size="small"
                onDelete={() => setSearchTerm('')}
                variant="outlined"
              />
            )}
            {selectedPriority && (
              <Chip
                label={`Độ ưu tiên: ${selectedPriority}`}
                size="small"
                onDelete={() => setSelectedPriority('')}
                variant="outlined"
              />
            )}
            {selectedAssignee && (
              <Chip
                label={`Người được giao: ${selectedAssignee}`}
                size="small"
                onDelete={() => setSelectedAssignee('')}
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            overflowY: 'hidden',
            flex: 1,
            pb: 2,
            minHeight: 400,
          }}
        >
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              tasks={tasksByStatus[column.id] || []}
              onTaskClick={onTaskClick}
            />
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
}