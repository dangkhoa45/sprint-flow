"use client";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileIcon from "@mui/icons-material/AttachFile";
import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TaskIcon from "@mui/icons-material/Task";
import UpdateIcon from "@mui/icons-material/Update";
import WarningIcon from "@mui/icons-material/Warning";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
  TimelineEvent,
  TimelineEventType,
  TimelineEventPriority,
} from "../../../../types/timeline";

interface TimelineEventProps {
  event: TimelineEvent;
  onEdit?: (event: TimelineEvent) => void;
  onDelete?: (event: TimelineEvent) => void;
  isCompact?: boolean;
}

const eventTypeConfig = {
  [TimelineEventType.PROJECT_CREATED]: {
    icon: <AssignmentIcon />,
    color: "#2196f3",
    bgColor: "rgba(33, 150, 243, 0.1)",
  },
  [TimelineEventType.PROJECT_UPDATED]: {
    icon: <UpdateIcon />,
    color: "#ff9800",
    bgColor: "rgba(255, 152, 0, 0.1)",
  },
  [TimelineEventType.PROJECT_COMPLETED]: {
    icon: <CheckCircleIcon />,
    color: "#4caf50",
    bgColor: "rgba(76, 175, 80, 0.1)",
  },
  [TimelineEventType.PROJECT_DELETED]: {
    icon: <DeleteIcon />,
    color: "#f44336",
    bgColor: "rgba(244, 67, 54, 0.1)",
  },
  [TimelineEventType.TASK_CREATED]: {
    icon: <TaskIcon />,
    color: "#9c27b0",
    bgColor: "rgba(156, 39, 176, 0.1)",
  },
  [TimelineEventType.TASK_UPDATED]: {
    icon: <UpdateIcon />,
    color: "#ff5722",
    bgColor: "rgba(255, 87, 34, 0.1)",
  },
  [TimelineEventType.TASK_COMPLETED]: {
    icon: <CheckCircleIcon />,
    color: "#00bcd4",
    bgColor: "rgba(0, 188, 212, 0.1)",
  },
  [TimelineEventType.TASK_DELETED]: {
    icon: <DeleteIcon />,
    color: "#795548",
    bgColor: "rgba(121, 85, 72, 0.1)",
  },
  [TimelineEventType.USER_JOINED]: {
    icon: <PersonAddIcon />,
    color: "#8bc34a",
    bgColor: "rgba(139, 195, 74, 0.1)",
  },
  [TimelineEventType.USER_LEFT]: {
    icon: <GroupIcon />,
    color: "#607d8b",
    bgColor: "rgba(96, 125, 139, 0.1)",
  },
  [TimelineEventType.MILESTONE_REACHED]: {
    icon: <CheckCircleIcon />,
    color: "#ff5722",
    bgColor: "rgba(255, 87, 34, 0.1)",
  },
  [TimelineEventType.DEADLINE_APPROACHING]: {
    icon: <WarningIcon />,
    color: "#ffc107",
    bgColor: "rgba(255, 193, 7, 0.1)",
  },
  [TimelineEventType.COMMENT_ADDED]: {
    icon: <CommentIcon />,
    color: "#3f51b5",
    bgColor: "rgba(63, 81, 181, 0.1)",
  },
  [TimelineEventType.FILE_UPLOADED]: {
    icon: <FileIcon />,
    color: "#009688",
    bgColor: "rgba(0, 150, 136, 0.1)",
  },
  [TimelineEventType.STATUS_CHANGED]: {
    icon: <UpdateIcon />,
    color: "#e91e63",
    bgColor: "rgba(233, 30, 99, 0.1)",
  },
};

const priorityConfig = {
  [TimelineEventPriority.LOW]: { 
    label: "Thấp", 
    color: "#4caf50",
    bgColor: "rgba(76, 175, 80, 0.1)"
  },
  [TimelineEventPriority.MEDIUM]: { 
    label: "Trung bình", 
    color: "#ff9800",
    bgColor: "rgba(255, 152, 0, 0.1)"
  },
  [TimelineEventPriority.HIGH]: { 
    label: "Cao", 
    color: "#ff5722",
    bgColor: "rgba(255, 87, 34, 0.1)"
  },
  [TimelineEventPriority.URGENT]: { 
    label: "Khẩn cấp", 
    color: "#f44336",
    bgColor: "rgba(244, 67, 54, 0.1)"
  },
};

export default function TimelineEventCard({
  event,
  onEdit,
  onDelete,
  isCompact = false,
}: TimelineEventProps) {
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
    onEdit?.(event);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(event);
  };

  const eventConfig = eventTypeConfig[event.type];
  const priorityInfo = priorityConfig[event.priority];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        background: isHovered 
          ? "rgba(255, 255, 255, 0.15)" 
          : "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 3,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": {
          transform: isCompact ? "none" : "translateY(-2px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          borderColor: "rgba(255, 255, 255, 0.3)",
        },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Priority indicator bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 4,
          height: "100%",
          background: `linear-gradient(180deg, ${priorityInfo.color}, ${priorityInfo.color}80)`,
        }}
      />

      <CardContent sx={{ p: isCompact ? 2 : 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: isCompact ? 1 : 2,
          }}
        >
          {/* Event Icon and Info */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
            {/* Icon */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: isCompact ? 40 : 48,
                height: isCompact ? 40 : 48,
                borderRadius: 2,
                background: eventConfig.bgColor,
                color: eventConfig.color,
                flexShrink: 0,
              }}
            >
              {eventConfig.icon}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Title and Priority */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant={isCompact ? "body1" : "h6"}
                  component="div"
                  sx={{
                    fontWeight: 600,
                    color: "white",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {event.title}
                </Typography>
                
                <Chip
                  label={priorityInfo.label}
                  size="small"
                  sx={{
                    backgroundColor: priorityInfo.bgColor,
                    color: priorityInfo.color,
                    border: `1px solid ${priorityInfo.color}40`,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: isCompact ? 1 : 2,
                  lineHeight: 1.5,
                }}
              >
                {event.description}
              </Typography>

              {/* Project and Task Info */}
              {!isCompact && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {event.project && (
                    <Chip
                      label={`Dự án: ${event.project.name}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        "&:hover": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
                        },
                      }}
                    />
                  )}
                  
                  {event.task && (
                    <Chip
                      label={`Task: ${event.task.title}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        "&:hover": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
                        },
                      }}
                    />
                  )}
                </Box>
              )}

              {/* User and Time */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={event.user.avatar}
                    sx={{
                      width: isCompact ? 24 : 32,
                      height: isCompact ? 24 : 32,
                      fontSize: isCompact ? "0.75rem" : "1rem",
                    }}
                  >
                    {event.user.displayName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    {event.user.displayName}
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  {formatTimeAgo(event.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Menu */}
          {(onEdit || onDelete) && (
            <Box>
              <Tooltip title="Tùy chọn">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    opacity: isHovered ? 1 : 0.5,
                    transition: "opacity 0.2s",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  sx: {
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 2,
                    "& .MuiMenuItem-root": {
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    },
                  },
                }}
              >
                {onEdit && (
                  <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Chỉnh sửa
                  </MenuItem>
                )}
                {onDelete && (
                  <MenuItem onClick={handleDelete} sx={{ color: "#f44336 !important" }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Xóa
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
