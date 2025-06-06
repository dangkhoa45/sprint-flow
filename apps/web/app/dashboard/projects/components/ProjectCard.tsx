"use client";
import TaskIcon from "@mui/icons-material/Assignment";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import ProgressIcon from "@mui/icons-material/TrendingUp";
import ViewIcon from "@mui/icons-material/Visibility";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
  Project,
  ProjectPriority,
  ProjectStatus,
} from "../../../../types/project";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onView?: (project: Project) => void;
}

const statusConfig = {
  [ProjectStatus.PLANNING]: {
    label: "Lập kế hoạch",
    color: "#2196f3",
    bgColor: "rgba(33, 150, 243, 0.1)",
  },
  [ProjectStatus.IN_PROGRESS]: {
    label: "Đang thực hiện",
    color: "#ff9800",
    bgColor: "rgba(255, 152, 0, 0.1)",
  },
  [ProjectStatus.COMPLETED]: {
    label: "Hoàn thành",
    color: "#4caf50",
    bgColor: "rgba(76, 175, 80, 0.1)",
  },
  [ProjectStatus.ON_HOLD]: {
    label: "Tạm dừng",
    color: "#9e9e9e",
    bgColor: "rgba(158, 158, 158, 0.1)",
  },
  [ProjectStatus.CANCELLED]: {
    label: "Đã hủy",
    color: "#f44336",
    bgColor: "rgba(244, 67, 54, 0.1)",
  },
};

const priorityConfig = {
  [ProjectPriority.LOW]: { label: "Thấp", color: "#4caf50" },
  [ProjectPriority.MEDIUM]: { label: "Trung bình", color: "#ff9800" },
  [ProjectPriority.HIGH]: { label: "Cao", color: "#ff5722" },
  [ProjectPriority.URGENT]: { label: "Khẩn cấp", color: "#f44336" },
};

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  onView,
}: ProjectCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(project);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(project);
  };

  const handleView = () => {
    onView?.(project);
  };

  const statusInfo = statusConfig[project.status];
  const priorityInfo = priorityConfig[project.priority];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const getDaysRemaining = () => {
    if (!project.endDate) return null;
    const today = new Date();
    const endDate = new Date(project.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Card
      onClick={handleView}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      elevation={0}
      sx={{
        height: "100%",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 3,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0, 0, 0, 0.2)"
          : "0 8px 24px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.15)",
        },
      }}
    >
      {/* Priority indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          background: `linear-gradient(90deg, ${priorityInfo.color} 0%, transparent 100%)`,
        }}
      />

      <CardContent sx={{ p: 3, pb: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1, mr: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 600,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {project.name}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <Chip
                size="small"
                label={statusInfo.label}
                sx={{
                  backgroundColor: statusInfo.bgColor,
                  color: statusInfo.color,
                  border: `1px solid ${statusInfo.color}30`,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
              <Chip
                size="small"
                label={priorityInfo.label}
                sx={{
                  backgroundColor: "transparent",
                  color: priorityInfo.color,
                  border: `1px solid ${priorityInfo.color}`,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
            </Box>
          </Box>

          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            mb: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "2.5em",
          }}
        >
          {project.description}
        </Typography>

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
                color: "rgba(255, 255, 255, 0.8)",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <ProgressIcon sx={{ fontSize: 16 }} />
              Tiến độ
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", fontWeight: 600 }}
            >
              {project.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: statusInfo.color,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Stats row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TaskIcon
              sx={{ fontSize: 16, color: "rgba(255, 255, 255, 0.7)" }}
            />
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {project.completedTasks}/{project.tasksCount} tasks
            </Typography>
          </Box>

          {daysRemaining && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarIcon
                sx={{ fontSize: 16, color: "rgba(255, 255, 255, 0.7)" }}
              />
              <Typography
                variant="caption"
                sx={{
                  color:
                    daysRemaining < 0
                      ? "#f44336"
                      : daysRemaining < 7
                      ? "#ff9800"
                      : "rgba(255, 255, 255, 0.8)",
                }}
              >
                {daysRemaining < 0 ? "Quá hạn" : `${daysRemaining} ngày`}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Owner and Members */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon
              sx={{ fontSize: 16, color: "rgba(255, 255, 255, 0.7)" }}
            />
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {project.owner.displayName}
            </Typography>
          </Box>

          <Tooltip title={`${project.members.length} thành viên`}>
            <AvatarGroup
              max={3}
              sx={{
                "& .MuiAvatar-root": {
                  width: 24,
                  height: 24,
                  fontSize: "0.75rem",
                },
              }}
            >
              {project.members.map((member, index) => (
                <Avatar
                  key={member._id}
                  src={member.avatar}
                  sx={{
                    bgcolor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {member.displayName.charAt(0).toUpperCase()}
                </Avatar>
              ))}
            </AvatarGroup>
          </Tooltip>
        </Box>

        {/* Tags */}
        {project.tags.length > 0 && (
          <Box sx={{ mt: 2, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {project.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                size="small"
                label={tag}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.7rem",
                  height: 20,
                }}
              />
            ))}
            {project.tags.length > 3 && (
              <Chip
                size="small"
                label={`+${project.tags.length - 3}`}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.7rem",
                  height: 20,
                }}
              />
            )}
          </Box>
        )}
      </CardContent>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1, fontSize: 18 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "#f44336" }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Xóa
        </MenuItem>
      </Menu>
    </Card>
  );
}
