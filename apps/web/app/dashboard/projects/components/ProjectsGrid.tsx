"use client";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
  Project,
  ProjectPriority,
  ProjectStatus,
} from "../../../../types/project";
import { useTheme } from "@mui/material/styles";
import { useThemeMode } from "../../../../provider/ThemeContext";

interface ProjectsGridProps {
  projects: Project[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChangeAction: (offset: number) => void;
  onProjectUpdateAction: () => void;
}

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.Planning:
      return "#757575";
    case ProjectStatus.InProgress:
      return "#2196f3";
    case ProjectStatus.OnHold:
      return "#ff9800";
    case ProjectStatus.Completed:
      return "#4caf50";
    case ProjectStatus.Cancelled:
      return "#f44336";
    default:
      return "#757575";
  }
};

const getPriorityColor = (priority: ProjectPriority) => {
  switch (priority) {
    case ProjectPriority.Low:
      return "#4caf50";
    case ProjectPriority.Medium:
      return "#ff9800";
    case ProjectPriority.High:
      return "#f44336";
    case ProjectPriority.Critical:
      return "#9c27b0";
    default:
      return "#757575";
  }
};

const getStatusLabel = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.Planning:
      return "Lập kế hoạch";
    case ProjectStatus.InProgress:
      return "Đang thực hiện";
    case ProjectStatus.OnHold:
      return "Tạm dừng";
    case ProjectStatus.Completed:
      return "Hoàn thành";
    case ProjectStatus.Cancelled:
      return "Đã hủy";
    default:
      return status;
  }
};

const getPriorityLabel = (priority: ProjectPriority) => {
  switch (priority) {
    case ProjectPriority.Low:
      return "Thấp";
    case ProjectPriority.Medium:
      return "Trung bình";
    case ProjectPriority.High:
      return "Cao";
    case ProjectPriority.Critical:
      return "Khẩn cấp";
    default:
      return priority;
  }
};

const ProjectCard = ({
  project,
}: {
  project: Project;
  onUpdateAction: () => void;
}) => {
  const theme = useTheme();
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === "dark";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const isOverdue =
    project.endDate &&
    new Date(project.endDate) < new Date() &&
    project.status !== ProjectStatus.Completed;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: isDark
          ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(255, 255, 255, 0.02) 100%)`
          : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(0, 0, 0, 0.02) 100%)`,
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: isDark
            ? "0 12px 32px rgba(0, 0, 0, 0.4)"
            : "0 12px 32px rgba(0, 0, 0, 0.15)",
          borderColor: getStatusColor(project.status) + "40",
        },
        ...(isOverdue && {
          borderColor: "#f44336",
          borderWidth: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(45deg, transparent 0%, #f4433610 100%)",
            borderRadius: 3,
            pointerEvents: "none",
          },
        }),
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1, mr: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                color: theme.palette.text.primary,
                fontSize: "1.1rem",
                lineHeight: 1.3,
              }}
            >
              {project.name}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
              <Chip
                label={getStatusLabel(project.status)}
                size="small"
                sx={{
                  backgroundColor: `${getStatusColor(project.status)}15`,
                  color: getStatusColor(project.status),
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 24,
                  border: `1px solid ${getStatusColor(project.status)}30`,
                }}
              />
              <Chip
                label={getPriorityLabel(project.priority)}
                size="small"
                sx={{
                  backgroundColor: `${getPriorityColor(project.priority)}15`,
                  color: getPriorityColor(project.priority),
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 24,
                  border: `1px solid ${getPriorityColor(project.priority)}30`,
                }}
              />
            </Box>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleMenuClick}
            sx={{
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.action.hover,
              "&:hover": {
                backgroundColor: theme.palette.action.selected,
                color: theme.palette.text.primary,
              },
              transition: "all 0.2s ease",
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Description */}
        {project.description && (
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              color: theme.palette.text.secondary,
              lineHeight: 1.5,
              fontSize: "0.9rem",
            }}
          >
            {project.description}
          </Typography>
        )}

        {/* Progress */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Tiến độ
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: "0.9rem",
              }}
            >
              {project.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.grey[200],
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${getStatusColor(project.status)} 0%, ${getStatusColor(project.status)}CC 100%)`,
              },
            }}
          />
        </Box>

        {/* Dates */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon 
              sx={{ 
                fontSize: 16, 
                color: theme.palette.text.secondary 
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: "0.8rem",
                fontWeight: 500,
              }}
            >
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: "auto",
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Owner */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                backgroundColor: getStatusColor(project.status) + "20",
                color: getStatusColor(project.status),
                fontWeight: 600,
                fontSize: "0.8rem",
              }} 
              src={project.owner.avatar}
            >
              {project.owner.displayName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  display: "block",
                  lineHeight: 1.2,
                }}
              >
                {project.owner.displayName}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: "0.7rem",
                }}
              >
                Quản lý
              </Typography>
            </Box>
          </Box>

          {/* Members */}
          {project.members && project.members.length > 0 && (
            <AvatarGroup
              max={3}
              sx={{
                "& .MuiAvatar-root": { 
                  width: 28, 
                  height: 28, 
                  fontSize: "0.75rem",
                  border: `2px solid ${theme.palette.background.paper}`,
                  "&:hover": {
                    transform: "scale(1.1)",
                    zIndex: 10,
                  },
                  transition: "all 0.2s ease",
                },
              }}
            >
              {project.members.map((member) => (
                <Avatar key={member._id} src={member.avatar}>
                  {member.displayName?.charAt(0)}
                </Avatar>
              ))}
            </AvatarGroup>
          )}
        </Box>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleMenuClose}>Xem chi tiết</MenuItem>
          <MenuItem onClick={handleMenuClose}>Chỉnh sửa</MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
            Xóa
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

const ProjectCardSkeleton = () => (
  <Card sx={{ height: "100%", borderRadius: 3 }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton width="70%" height={28} sx={{ mb: 1 }} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton width={80} height={24} />
            <Skeleton width={60} height={24} />
          </Box>
        </Box>
        <Skeleton width={24} height={24} />
      </Box>
      <Skeleton width="100%" height={40} sx={{ mb: 2 }} />
      <Skeleton width="100%" height={6} sx={{ mb: 2 }} />
      <Skeleton width="60%" height={20} sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton width={100} height={24} />
        <Skeleton width={60} height={24} />
      </Box>
    </CardContent>
  </Card>
);

function ProjectsGrid({
  projects,
  isLoading,
  total,
  currentPage,
  pageSize,
  onPageChangeAction,
  onProjectUpdateAction,
}: ProjectsGridProps) {
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    onPageChangeAction((page - 1) * pageSize);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: pageSize }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <ProjectCardSkeleton />
              </Grid>
            ))
          : projects.map((project) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project._id}>
                <ProjectCard
                  project={project}
                  onUpdateAction={onProjectUpdateAction}
                />
              </Grid>
            ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <TrendingUpIcon
            sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Chưa có dự án nào
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tạo dự án đầu tiên để bắt đầu quản lý công việc của bạn
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ProjectsGrid;
