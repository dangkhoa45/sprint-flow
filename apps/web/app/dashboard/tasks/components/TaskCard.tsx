"use client";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Task, TaskPriority } from "../types/task";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityConfig = {
  [TaskPriority.LOWEST]: {
    label: "Thấp nhất",
    color: "#64748b",
    icon: "▼",
    bgColor: "#f8fafc",
    gradient: "linear-gradient(135deg, #64748b20, #64748b10)",
  },
  [TaskPriority.LOW]: {
    label: "Thấp",
    color: "#06b6d4",
    icon: "▼",
    bgColor: "#f0fdff",
    gradient: "linear-gradient(135deg, #06b6d420, #06b6d410)",
  },
  [TaskPriority.MEDIUM]: {
    label: "Trung bình",
    color: "#10b981",
    icon: "●",
    bgColor: "#f0fdf4",
    gradient: "linear-gradient(135deg, #10b98120, #10b98110)",
  },
  [TaskPriority.HIGH]: {
    label: "Cao",
    color: "#f59e0b",
    icon: "▲",
    bgColor: "#fffbeb",
    gradient: "linear-gradient(135deg, #f59e0b20, #f59e0b10)",
  },
  [TaskPriority.HIGHEST]: {
    label: "Cao nhất",
    color: "#ef4444",
    icon: "▲▲",
    bgColor: "#fef2f2",
    gradient: "linear-gradient(135deg, #ef444420, #ef444410)",
  },
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const priority =
    priorityConfig[task.priority as TaskPriority] ||
    priorityConfig[TaskPriority.MEDIUM];

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueSoon =
    task.dueDate &&
    new Date(task.dueDate) > new Date() &&
    new Date(task.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days

  const progress = task.estimatedHours
    ? Math.round(((task.loggedHours || 0) / task.estimatedHours) * 100)
    : 0;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <Card
      sx={{
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0, 0, 0, 0.2)"
          : "0 8px 24px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 3,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${priority.color} 0%, transparent 100%)`,
          opacity: isHovered ? 1 : 0.7,
          transition: "opacity 0.3s ease",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, pt: 4, "&:last-child": { pb: 3 } }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {task.project && (
              <Chip
                label={task.project.key}
                size="small"
                sx={{
                  background: `linear-gradient(135deg, ${task.project.color}20, ${task.project.color}10)`,
                  color: task.project.color,
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  height: 28,
                  border: `1px solid ${task.project.color}30`,
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    background: `linear-gradient(135deg, ${task.project.color}30, ${task.project.color}20)`,
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              />
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                background: priority.gradient,
                border: `1px solid ${priority.color}30`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: priority.color,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                }}
              >
                {priority.icon}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: priority.color,
                  fontWeight: 600,
                  fontSize: "0.7rem",
                }}
              >
                {priority.label}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            className="task-actions"
            sx={{
              opacity: 0.5,
              transform: "translateX(10px)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "rgba(59, 130, 246, 0.1)",
                color: "#3b82f6",
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            mb: 1.5,
            lineHeight: 1.4,
            fontSize: "1.1rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            transition: "color 0.2s ease",
            "&:hover": {
              color: "#3b82f6",
            },
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
              mb: 2.5,
              fontSize: "0.9rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              "&:hover": {
                color: "#475569",
              },
              transition: "color 0.2s ease",
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Progress Bar */}
        {task.estimatedHours && task.estimatedHours > 0 && (
          <Box sx={{ mb: 2.5 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#64748b", fontWeight: 600 }}
              >
                Tiến độ
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: progress >= 100 ? "#10b981" : "#64748b",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              >
                {task.loggedHours || 0}/{task.estimatedHours}h ({progress}%)
              </Typography>
            </Box>
            <Box sx={{ position: "relative" }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(progress, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e2e8f0",
                  "& .MuiLinearProgress-bar": {
                    background:
                      progress >= 100
                        ? "linear-gradient(90deg, #10b981, #059669)"
                        : "linear-gradient(90deg, #3b82f6, #2563eb)",
                    borderRadius: 4,
                    animation: isHovered
                      ? "pulse 1.5s ease-in-out infinite"
                      : "none",
                  },
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.8 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
              {progress >= 100 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 4,
                    transform: "translateY(-50%)",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 2.5 }}>
            {task.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.7rem",
                  height: 24,
                  fontWeight: 600,
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                    borderColor: "#3b82f6",
                    transform: "scale(1.05)",
                  },
                  "& .MuiChip-label": { px: 1.5 },
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
                  height: 24,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                  color: "#64748b",
                  border: "1px solid #cbd5e1",
                  "& .MuiChip-label": { px: 1.5 },
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
              gap: 1,
              mb: 2.5,
              p: 1.5,
              borderRadius: 2,
              background: isOverdue
                ? "linear-gradient(135deg, #fef2f2, #fee2e2)"
                : isDueSoon
                ? "linear-gradient(135deg, #fffbeb, #fed7aa)"
                : "linear-gradient(135deg, #f8fafc, #f1f5f9)",
              border: `1px solid ${
                isOverdue ? "#fca5a5" : isDueSoon ? "#fbbf24" : "#e2e8f0"
              }`,
              transition: "all 0.2s ease",
            }}
          >
            <CalendarTodayIcon
              sx={{
                fontSize: 16,
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
                fontWeight: 600,
                fontSize: "0.8rem",
              }}
            >
              {formatDate(task.dueDate)}
            </Typography>
            {isOverdue && (
              <Chip
                label="Quá hạn"
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  background: "#dc2626",
                  color: "white",
                  ml: "auto",
                }}
              />
            )}
            {isDueSoon && !isOverdue && (
              <Chip
                label="Sắp hết hạn"
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  background: "#f59e0b",
                  color: "white",
                  ml: "auto",
                }}
              />
            )}
          </Box>
        )}

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          {/* Assignee */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {task.assignee ? (
              <Tooltip title={`Được giao cho: ${task.assignee.displayName}`}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    border: "2px solid white",
                    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                    },
                  }}
                  src={task.assignee.avatar}
                >
                  {task.assignee.displayName.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            ) : (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "#e2e8f0",
                  border: "2px dashed #cbd5e1",
                  color: "#64748b",
                }}
              >
                ?
              </Avatar>
            )}
          </Box>

          {/* Metadata */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {task.subtasks && task.subtasks.length > 0 && (
              <Tooltip title={`${task.subtasks.length} công việc con`}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1.5,
                    background: "rgba(100, 116, 139, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "rgba(100, 116, 139, 0.2)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <SubdirectoryArrowRightIcon
                    sx={{ fontSize: 14, color: "#64748b" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", fontWeight: 600 }}
                  >
                    {task.subtasks.length}
                  </Typography>
                </Box>
              </Tooltip>
            )}

            {task.attachments && task.attachments.length > 0 && (
              <Tooltip title={`${task.attachments.length} tệp đính kèm`}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1.5,
                    background: "rgba(100, 116, 139, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "rgba(100, 116, 139, 0.2)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <AttachFileIcon sx={{ fontSize: 14, color: "#64748b" }} />
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", fontWeight: 600 }}
                  >
                    {task.attachments.length}
                  </Typography>
                </Box>
              </Tooltip>
            )}

            {task.comments && task.comments.length > 0 && (
              <Tooltip title={`${task.comments.length} bình luận`}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1.5,
                    background: "rgba(100, 116, 139, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "rgba(100, 116, 139, 0.2)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CommentIcon sx={{ fontSize: 14, color: "#64748b" }} />
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", fontWeight: 600 }}
                  >
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
