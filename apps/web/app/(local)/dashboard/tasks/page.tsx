'use client';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTasks, useTaskStats } from '@/hooks/useTasks';
import { Task, TaskStatus, TaskPriority } from '@/types/task';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '' as TaskStatus | '',
    priority: '' as TaskPriority | '',
    projectId: '',
  });

  const { tasks, isLoading, error } = useTasks({
    search: searchQuery || undefined,
    status: filters.status || undefined,
    priority: filters.priority || undefined,
    projectId: filters.projectId || undefined,
  });
  const { stats } = useTaskStats();

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: 'list' | 'grid'
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      projectId: '',
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 600, mb: 0.5 }}>
            Quản lý công việc
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Tạo, quản lý và theo dõi tiến độ các công việc của bạn
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            // TODO: Open create task dialog
          }}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
          }}
        >
          Tạo công việc mới
        </Button>
      </Box>

      {/* Task Statistics */}
      {stats && (
        <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Thống kê công việc
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant='h4' color='primary'>
                {stats.total}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Tổng cộng
              </Typography>
            </Box>
            <Box>
              <Typography variant='h4' color='error'>
                {stats.overdue}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Quá hạn
              </Typography>
            </Box>
            <Box>
              <Typography variant='h4' color='warning.main'>
                {stats.byStatus.TODO}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Cần làm
              </Typography>
            </Box>
            <Box>
              <Typography variant='h4' color='info.main'>
                {stats.byStatus.IN_PROGRESS}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Đang làm
              </Typography>
            </Box>
            <Box>
              <Typography variant='h4' color='success.main'>
                {stats.byStatus.DONE}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Hoàn thành
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Search and Filters */}
      <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <TextField
            size='small'
            placeholder='Tìm kiếm công việc...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          <Button
            variant='outlined'
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ textTransform: 'none' }}
          >
            Bộ lọc
          </Button>

          <Box sx={{ ml: 'auto' }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size='small'
            >
              <ToggleButton value='grid'>
                <ViewModuleIcon fontSize='small' />
              </ToggleButton>
              <ToggleButton value='list'>
                <ViewListIcon fontSize='small' />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {showFilters && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <TextField
                select
                size='small'
                label='Trạng thái'
                value={filters.status}
                onChange={e => handleFilterChange('status', e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <option value=''>Tất cả</option>
                <option value='TODO'>Cần làm</option>
                <option value='IN_PROGRESS'>Đang làm</option>
                <option value='REVIEW'>Đang review</option>
                <option value='DONE'>Hoàn thành</option>
                <option value='CANCELLED'>Đã hủy</option>
              </TextField>

              <TextField
                select
                size='small'
                label='Độ ưu tiên'
                value={filters.priority}
                onChange={e => handleFilterChange('priority', e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <option value=''>Tất cả</option>
                <option value='LOW'>Thấp</option>
                <option value='MEDIUM'>Trung bình</option>
                <option value='HIGH'>Cao</option>
                <option value='URGENT'>Khẩn cấp</option>
              </TextField>

              <TextField
                size='small'
                label='ID Dự án'
                value={filters.projectId}
                onChange={e => handleFilterChange('projectId', e.target.value)}
                sx={{ minWidth: 200 }}
              />

              <Button
                variant='outlined'
                onClick={clearFilters}
                sx={{ textTransform: 'none' }}
              >
                Xóa bộ lọc
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Tasks List */}
      <Box sx={{ flex: 1 }}>
        {isLoading ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography>Đang tải...</Typography>
          </Paper>
        ) : error ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='error'>
              Có lỗi xảy ra: {error.message}
            </Typography>
          </Paper>
        ) : tasks.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='text.secondary'>
              Không có công việc nào được tìm thấy
            </Typography>
          </Paper>
        ) : (
          <Box>
            {viewMode === 'grid' ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 2,
                }}
              >
                {tasks.map((task: Task) => (
                  <Paper
                    key={task._id}
                    sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1,
                      }}
                    >
                      <Typography variant='h6' sx={{ fontWeight: 500 }}>
                        {task.title}
                      </Typography>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: getStatusColor(task.status).bg,
                          color: getStatusColor(task.status).text,
                        }}
                      >
                        {getStatusLabel(task.status)}
                      </Box>
                    </Box>

                    {task.description && (
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
                        {task.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          backgroundColor: getPriorityColor(task.priority).bg,
                          color: getPriorityColor(task.priority).text,
                        }}
                      >
                        {getPriorityLabel(task.priority)}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant='body2' color='text.secondary'>
                        Dự án: {task.projectId.name}
                      </Typography>
                      {task.assignedTo && (
                        <Typography variant='body2' color='text.secondary'>
                          Giao cho: {task.assignedTo.displayName}
                        </Typography>
                      )}
                    </Box>

                    {task.dueDate && (
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 1 }}
                      >
                        Hạn:{' '}
                        {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Box>
            ) : (
              <Paper sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant='h6'>Danh sách công việc</Typography>
                </Box>
                {tasks.map((task: Task) => (
                  <Box
                    key={task._id}
                    sx={{
                      p: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='h6' sx={{ fontWeight: 500 }}>
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography variant='body2' color='text.secondary'>
                            {task.description}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Typography variant='body2' color='text.secondary'>
                            Dự án: {task.projectId.name}
                          </Typography>
                          {task.assignedTo && (
                            <Typography variant='body2' color='text.secondary'>
                              • Giao cho: {task.assignedTo.displayName}
                            </Typography>
                          )}
                          {task.dueDate && (
                            <Typography variant='body2' color='text.secondary'>
                              • Hạn:{' '}
                              {new Date(task.dueDate).toLocaleDateString(
                                'vi-VN'
                              )}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
                      >
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            backgroundColor: getPriorityColor(task.priority).bg,
                            color: getPriorityColor(task.priority).text,
                          }}
                        >
                          {getPriorityLabel(task.priority)}
                        </Box>
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            backgroundColor: getStatusColor(task.status).bg,
                            color: getStatusColor(task.status).text,
                          }}
                        >
                          {getStatusLabel(task.status)}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// Helper functions
function getStatusLabel(status: TaskStatus): string {
  const labels = {
    [TaskStatus.TODO]: 'Cần làm',
    [TaskStatus.IN_PROGRESS]: 'Đang làm',
    [TaskStatus.REVIEW]: 'Đang review',
    [TaskStatus.DONE]: 'Hoàn thành',
    [TaskStatus.CANCELLED]: 'Đã hủy',
  };
  return labels[status] || status;
}

function getStatusColor(status: TaskStatus) {
  const colors = {
    [TaskStatus.TODO]: { bg: '#fff3cd', text: '#856404' },
    [TaskStatus.IN_PROGRESS]: { bg: '#cce5ff', text: '#004085' },
    [TaskStatus.REVIEW]: { bg: '#d1ecf1', text: '#0c5460' },
    [TaskStatus.DONE]: { bg: '#d4edda', text: '#155724' },
    [TaskStatus.CANCELLED]: { bg: '#f8d7da', text: '#721c24' },
  };
  return colors[status] || { bg: '#f8f9fa', text: '#6c757d' };
}

function getPriorityLabel(priority: TaskPriority): string {
  const labels = {
    [TaskPriority.LOW]: 'Thấp',
    [TaskPriority.MEDIUM]: 'Trung bình',
    [TaskPriority.HIGH]: 'Cao',
    [TaskPriority.URGENT]: 'Khẩn cấp',
  };
  return labels[priority] || priority;
}

function getPriorityColor(priority: TaskPriority) {
  const colors = {
    [TaskPriority.LOW]: { bg: '#d4edda', text: '#155724' },
    [TaskPriority.MEDIUM]: { bg: '#fff3cd', text: '#856404' },
    [TaskPriority.HIGH]: { bg: '#f8d7da', text: '#721c24' },
    [TaskPriority.URGENT]: { bg: '#f8d7da', text: '#721c24' },
  };
  return colors[priority] || { bg: '#f8f9fa', text: '#6c757d' };
}
