"use client";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { format } from "date-fns";
import { useState } from "react";
import { Project, ProjectPriority, ProjectStatus } from "../../../../types/project";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return "#2196f3";
      case ProjectStatus.InProgress:
        return "#4caf50";
      case ProjectStatus.OnHold:
        return "#ff9800";
      case ProjectStatus.Completed:
        return "#8bc34a";
      case ProjectStatus.Cancelled:
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Critical:
        return "#d32f2f";
      case ProjectPriority.High:
        return "#f57c00";
      case ProjectPriority.Medium:
        return "#1976d2";
      case ProjectPriority.Low:
        return "#388e3c";
      default:
        return "#9e9e9e";
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return "Lên kế hoạch";
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

  const getPriorityText = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Critical:
        return "Khẩn cấp";
      case ProjectPriority.High:
        return "Cao";
      case ProjectPriority.Medium:
        return "Trung bình";
      case ProjectPriority.Low:
        return "Thấp";
      default:
        return priority;
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: "all 0.2s",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <AccountTreeIcon sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography
              variant="h6"
              sx={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {project.name}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Description */}
        {project.description && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
              fontSize: "0.8rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.4,
            }}
          >
            {project.description}
          </Typography>
        )}

        {/* Status and Priority */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Chip
            label={getStatusText(project.status)}
            size="small"
            sx={{
              bgcolor: getStatusColor(project.status) + "20",
              color: getStatusColor(project.status),
              border: `1px solid ${getStatusColor(project.status)}40`,
              fontSize: "0.7rem",
              height: 20,
            }}
          />
          <Chip
            label={getPriorityText(project.priority)}
            size="small"
            sx={{
              bgcolor: getPriorityColor(project.priority) + "20",
              color: getPriorityColor(project.priority),
              border: `1px solid ${getPriorityColor(project.priority)}40`,
              fontSize: "0.7rem",
              height: 20,
            }}
          />
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              Tiến độ
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
              {project.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: theme.palette.grey[200],
              "& .MuiLinearProgress-bar": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Members */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              {project.members.length} thành viên
            </Typography>
          </Box>
          <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 20, height: 20, fontSize: "0.6rem" } }}>
            {project.members.map((member) => (
              <Avatar key={member._id} alt={member.displayName} src={member.avatar}>
                {member.displayName.charAt(0).toUpperCase()}
              </Avatar>
            ))}
          </AvatarGroup>
        </Box>

        {/* Dates */}
        {(project.startDate || project.endDate) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              {project.startDate && format(new Date(project.startDate), "dd/MM")}
              {project.startDate && project.endDate && " - "}
              {project.endDate && format(new Date(project.endDate), "dd/MM/yyyy")}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: "0.8rem" }}>
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: "0.8rem" }}>
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: "0.8rem", color: "error.main" }}>
          Xóa
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default ProjectCard;
