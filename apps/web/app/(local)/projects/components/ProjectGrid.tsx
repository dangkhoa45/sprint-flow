'use client';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TimelineIcon from '@mui/icons-material/Timeline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import { Menu as MuiMenu } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectPriority, ProjectStatus } from '@/types/project';
import { formatDateVN } from '@/utils/time';
import { useToast } from '@/hooks/useToast';
import { projectsApi } from '@/api/projects';
import { ErrorResponse } from '@/types/shared';

interface ProjectGridProps {
  projects: Project[];
  isLoading?: boolean;
  error?: ErrorResponse | undefined;
  onEditProject?: (project: Project) => void;
  mutate?: () => void;
}

const ProjectGrid = ({
  projects,
  isLoading,
  error,
  onEditProject,
  mutate,
}: ProjectGridProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { success, error: toastError } = useToast();

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    project: Project
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleViewProject = () => {
    if (selectedProject) {
      router.push(`/projects/${selectedProject._id}`);
    }
    handleMenuClose();
  };

  const handleEditProject = () => {
    if (selectedProject && onEditProject) {
      onEditProject(selectedProject);
    }
    handleMenuClose();
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      await projectsApi.deleteProject(selectedProject._id);
      success('Xóa project thành công!');
      mutate?.();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Không thể xóa project';
      toastError(errorMessage);
    }
    handleMenuClose();
  };

  const handleCardClick = (project: Project) => {
    router.push(`/projects/${project._id}`);
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return '#f59e0b';
      case ProjectStatus.InProgress:
        return '#10b981';
      case ProjectStatus.OnHold:
        return '#f97316';
      case ProjectStatus.Completed:
        return '#6366f1';
      case ProjectStatus.Cancelled:
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return 'Lập kế hoạch';
      case ProjectStatus.InProgress:
        return 'Đang thực hiện';
      case ProjectStatus.OnHold:
        return 'Tạm dừng';
      case ProjectStatus.Completed:
        return 'Hoàn thành';
      case ProjectStatus.Cancelled:
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Low:
        return '#10b981';
      case ProjectPriority.Medium:
        return '#f59e0b';
      case ProjectPriority.High:
        return '#f97316';
      case ProjectPriority.Critical:
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getPriorityText = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Low:
        return 'Thấp';
      case ProjectPriority.Medium:
        return 'Trung bình';
      case ProjectPriority.High:
        return 'Cao';
      case ProjectPriority.Critical:
        return 'Khẩn cấp';
      default:
        return priority;
    }
  };

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Lỗi tải dữ liệu dự án!</div>;

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 2,
        }}
      >
        {projects.map(project => (
          <Card
            key={project._id}
            onClick={() => handleCardClick(project)}
            sx={{
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                borderColor: getStatusColor(project.status),
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  mb: 1.5,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant='subtitle1'
                    sx={{ fontWeight: 600, mb: 0.5 }}
                  >
                    {project.name}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 1, height: 40, overflow: 'hidden' }}
                  >
                    {project.description}
                  </Typography>
                </Box>
                <IconButton
                  size='small'
                  onClick={e => handleMenuClick(e, project)}
                  sx={{ ml: 1 }}
                >
                  <MoreVertIcon fontSize='small' />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <Chip
                  label={getStatusText(project.status)}
                  size='small'
                  sx={{
                    backgroundColor: `${getStatusColor(project.status)}15`,
                    color: getStatusColor(project.status),
                    fontWeight: 500,
                    height: '24px',
                    fontSize: '0.75rem',
                    '.MuiChip-label': {
                      paddingX: '8px',
                    },
                  }}
                />
                <Chip
                  label={getPriorityText(project.priority)}
                  size='small'
                  sx={{
                    backgroundColor: `${getPriorityColor(project.priority)}15`,
                    color: getPriorityColor(project.priority),
                    fontWeight: 500,
                    height: '24px',
                    fontSize: '0.75rem',
                    '.MuiChip-label': {
                      paddingX: '8px',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 0.5,
                  }}
                >
                  <Typography variant='caption' color='text.secondary'>
                    Tiến độ
                  </Typography>
                  <Typography variant='caption' fontWeight={500}>
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant='determinate'
                  value={project.progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getStatusColor(project.status),
                    },
                  }}
                />
              </Box>

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon fontSize='small' color='action' />
                  <Typography variant='caption' color='text.secondary'>
                    {formatDateVN(project.startDate || '')} -{' '}
                    {formatDateVN(project.endDate || '')}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PersonIcon fontSize='small' color='action' />
                  <Typography variant='caption' color='text.secondary'>
                    {project.owner?.displayName || project.owner?.username}
                  </Typography>
                </Box>
              </Box>

              {/* Milestones and Attachments Info */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TimelineIcon fontSize='small' color='action' />
                  <Typography variant='caption' color='text.secondary'>
                    {project.milestoneCount || 0} mốc công việc
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AttachFileIcon fontSize='small' color='action' />
                  <Typography variant='caption' color='text.secondary'>
                    {project.attachmentCount || 0} tệp
                  </Typography>
                </Box>
              </Box>

              {project.members && project.members.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant='caption' color='text.secondary'>
                    Thành viên:
                  </Typography>
                  <AvatarGroup
                    max={3}
                    sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}
                  >
                    {project.members.slice(0, 3).map(member => (
                      <Avatar
                        key={member._id}
                        sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
                        alt={member.displayName || member.username}
                      >
                        {(member.displayName || member.username || '')
                          .charAt(0)
                          .toUpperCase()}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  {project.members.length > 3 && (
                    <Typography variant='caption' color='text.secondary'>
                      +{project.members.length - 3}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      <MuiMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedProject && onEditProject && (
          <MenuItem onClick={handleEditProject}>
            <ListItemIcon>
              <EditIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Chỉnh sửa' />
          </MenuItem>
        )}
        <MenuItem onClick={handleViewProject}>
          <ListItemIcon>
            <VisibilityIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Xem chi tiết' />
        </MenuItem>
        <MenuItem onClick={handleDeleteProject}>
          <ListItemIcon>
            <DeleteIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Xóa' />
        </MenuItem>
      </MuiMenu>
    </>
  );
};

export default ProjectGrid;
