"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CommentIcon from "@mui/icons-material/Comment";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Task, TaskPriority } from "../types/task";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityConfig = {
  [TaskPriority.LOWEST]: { label: "Thấp nhất", color: "#64748b", icon: "▼" },
  [TaskPriority.LOW]: { label: "Thấp", color: "#06b6d4", icon: "▼" },
  [TaskPriority.MEDIUM]: { label: "Trung bình", color: "#10b981", icon: "●" },
  [TaskPriority.HIGH]: { label: "Cao", color: "#f59e0b", icon: "▲" },
  [TaskPriority.HIGHEST]: { label: "Cao nhất", color: "#ef4444", icon: "▲▲" },
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const priority = priorityConfig[task.priority as TaskPriority] || priorityConfig[TaskPriority.MEDIUM];
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueSoon = task.dueDate && 
    new Date(task.dueDate) > new Date() && 
    new Date(task.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
  
  const progress = task.estimatedHours ? 
    Math.round((task.loggedHours || 0) / task.estimatedHours * 100) : 0;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Card
      sx={{
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered 
          ? "0 8px 25px rgba(0,0,0,0.15)" 
          : "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0",
        "&:hover": {
          borderColor: "#3b82f6",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {task.project && (
              <Chip
                label={task.project.key}
                size="small"
                sx={{
                  backgroundColor: task.project.color + "20",
                  color: task.project.color,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 24,
                }}
              />
            )}
            <Typography
              variant="caption"
              sx={{
                color: priority.color,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {priority.icon} {priority.label}
            </Typography>
          </Box>
          <IconButton size="small" sx={{ opacity: isHovered ? 1 : 0.5 }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Title */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: "#1e293b",
            mb: 1,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.title}
        </Typography>

        {/* Description */}
        {task.description && (
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              mb: 2,
              fontSize: "0.875rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", 
              overflow: "hidden",
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Progress Bar */}
        {task.estimatedHours && task.estimatedHours > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Tiến độ
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {task.loggedHours || 0}/{task.estimatedHours}h ({progress}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(progress, 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "#e2e8f0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: progress >= 100 ? "#10b981" : "#3b82f6",
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {task.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.7rem",
                  height: 20,
                  "& .MuiChip-label": { px: 1 },
                }}
              />
            ))}
            {task.tags.length > 3 && (
              <Chip
                label={`+${task.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.7rem",
                  height: 20,
                  "& .MuiChip-label": { px: 1 },
                }}
              />
            )}
          </Box>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 2,
              p: 1,
              borderRadius: 1,
              backgroundColor: isOverdue 
                ? "#fef2f2" 
                : isDueSoon 
                ? "#fffbeb" 
                : "#f8fafc",
              border: `1px solid ${
                isOverdue 
                  ? "#fecaca" 
                  : isDueSoon 
                  ? "#fed7aa" 
                  : "#e2e8f0"
              }`,
            }}
          >
            <CalendarTodayIcon
              sx={{
                fontSize: 14,
                color: isOverdue 
                  ? "#dc2626" 
                  : isDueSoon 
                  ? "#f59e0b" 
                  : "#64748b",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: isOverdue 
                  ? "#dc2626" 
                  : isDueSoon 
                  ? "#f59e0b" 
                  : "#64748b",
                fontWeight: 500,
              }}
            >
              {isOverdue ? "Quá hạn: " : "Hạn: "}{formatDate(task.dueDate)}
            </Typography>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Assignee */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {task.assignee ? (
              <Tooltip title={`Được giao cho: ${task.assignee.displayName}`}>
                <Avatar
                  sx={{ width: 28, height: 28, fontSize: "0.875rem" }}
                  src={task.assignee.avatar}
                >
                  {task.assignee.displayName.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            ) : (
              <Avatar sx={{ width: 28, height: 28, backgroundColor: "#e2e8f0" }}>
                ?
              </Avatar>
            )}
          </Box>

          {/* Metadata */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {task.subtasks && task.subtasks.length > 0 && (
              <Tooltip title={`${task.subtasks.length} công việc con`}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <SubdirectoryArrowRightIcon sx={{ fontSize: 14, color: "#64748b" }} />
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {task.subtasks.length}
                  </Typography>
                </Box>
              </Tooltip>
            )}
            
            {task.attachments && task.attachments.length > 0 && (
              <Tooltip title={`${task.attachments.length} tệp đính kèm`}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AttachFileIcon sx={{ fontSize: 14, color: "#64748b" }} />
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {task.attachments.length}
                  </Typography>
                </Box>
              </Tooltip>
            )}
            
            {task.comments && task.comments.length > 0 && (
              <Tooltip title={`${task.comments.length} bình luận`}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CommentIcon sx={{ fontSize: 14, color: "#64748b" }} />
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {task.comments.length}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
