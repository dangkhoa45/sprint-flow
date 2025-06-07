"use client";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Task, TaskStatus } from "../types/task";
import TaskCard from "./TaskCard";

interface TaskBoardProps {
  filter?: string;
}

// Mock data - sẽ thay thế bằng API call
const mockTasks = [
  {
    _id: "1",
    title: "Thiết kế giao diện đăng nhập",
    description: "Tạo giao diện đăng nhập theo mockup đã được approve",
    status: TaskStatus.TODO,
    priority: "HIGH",
    assignee: {
      _id: "user1",
      displayName: "Nguyễn Văn A",
      avatar: "",
      username: "nguyenvana",
      role: "Developer",
    },
    reporter: {
      _id: "user2",
      displayName: "Trần Thị B",
      avatar: "",
      username: "tranthib",
      role: "Manager",
    },
    project: {
      _id: "proj1",
      name: "Sprint Flow",
      key: "SF",
      color: "#10b981",
    },
    dueDate: new Date("2025-06-15"),
    createdAt: new Date("2025-06-08"),
    updatedAt: new Date("2025-06-08"),
    tags: ["UI/UX", "Frontend"],
    attachments: [],
    comments: [],
    estimatedHours: 8,
    loggedHours: 0,
    subtasks: [],
  },
  {
    _id: "2",
    title: "API authentication",
    description: "Xây dựng API cho việc xác thực người dùng",
    status: TaskStatus.IN_PROGRESS,
    priority: "MEDIUM",
    assignee: {
      _id: "user3",
      displayName: "Lê Văn C",
      avatar: "",
      username: "levanc",
      role: "Backend Developer",
    },
    reporter: {
      _id: "user2",
      displayName: "Trần Thị B",
      avatar: "",
      username: "tranthib",
      role: "Manager",
    },
    project: {
      _id: "proj1",
      name: "Sprint Flow",
      key: "SF",
      color: "#10b981",
    },
    dueDate: new Date("2025-06-12"),
    createdAt: new Date("2025-06-05"),
    updatedAt: new Date("2025-06-08"),
    tags: ["Backend", "Security"],
    attachments: [],
    comments: [],
    estimatedHours: 12,
    loggedHours: 4,
    subtasks: [],
  },
  {
    _id: "3",
    title: "Database schema design",
    description: "Thiết kế cơ sở dữ liệu cho hệ thống",
    status: TaskStatus.DONE,
    priority: "HIGH",
    assignee: {
      _id: "user3",
      displayName: "Lê Văn C",
      avatar: "",
      username: "levanc",
      role: "Backend Developer",
    },
    reporter: {
      _id: "user2",
      displayName: "Trần Thị B",
      avatar: "",
      username: "tranthib",
      role: "Manager",
    },
    project: {
      _id: "proj1",
      name: "Sprint Flow",
      key: "SF",
      color: "#10b981",
    },
    dueDate: new Date("2025-06-10"),
    createdAt: new Date("2025-06-01"),
    updatedAt: new Date("2025-06-07"),
    tags: ["Database", "Architecture"],
    attachments: [],
    comments: [],
    estimatedHours: 16,
    loggedHours: 16,
    subtasks: [],
  },
];

const columns = [
  {
    id: TaskStatus.TODO,
    title: "Chưa bắt đầu",
    color: "#6b7280",
    bgColor: "#f9fafb",
    gradient: "linear-gradient(135deg, #6b7280, #4b5563)",
    lightGradient: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
  },
  {
    id: TaskStatus.IN_PROGRESS,
    title: "Đang thực hiện",
    color: "#2563eb",
    bgColor: "#eff6ff",
    gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    lightGradient: "linear-gradient(135deg, #eff6ff, #dbeafe)",
  },
  {
    id: TaskStatus.IN_REVIEW,
    title: "Đang xem xét",
    color: "#f59e0b",
    bgColor: "#fffbeb",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    lightGradient: "linear-gradient(135deg, #fffbeb, #fef3c7)",
  },
  {
    id: TaskStatus.DONE,
    title: "Hoàn thành",
    color: "#059669",
    bgColor: "#f0fdf4",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    lightGradient: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
  },
  {
    id: TaskStatus.BLOCKED,
    title: "Bị chặn",
    color: "#dc2626",
    bgColor: "#fef2f2",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    lightGradient: "linear-gradient(135deg, #fef2f2, #fee2e2)",
  },
];

export default function TaskBoard({ filter }: TaskBoardProps) {
  const [tasks] = useState(mockTasks);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => {
      if (task.status !== status) return false;

      // Apply additional filters
      if (filter === "assigned-to-me") {
        // Mock: current user ID is "user1"
        return task.assignee?._id === "user1";
      }
      if (filter === "created-by-me") {
        // Mock: current user ID is "user1"
        return task.reporter._id === "user1";
      }
      if (filter === "completed") {
        return task.status === TaskStatus.DONE;
      }

      return true;
    });
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        gap: 3, 
        overflowX: "auto", 
        pb: 2,
        "&::-webkit-scrollbar": {
          height: 8,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f5f9",
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#cbd5e1",
          borderRadius: 4,
          "&:hover": {
            backgroundColor: "#94a3b8",
          },
        },
      }}
    >
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);

        return (
          <Paper
            key={column.id}
            sx={{
              minWidth: 340,
              maxWidth: 340,
              background: column.lightGradient,
              border: `2px solid ${column.color}15`,
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: column.gradient,
              },
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 12px 32px ${column.color}20, 0 6px 16px ${column.color}10`,
                border: `2px solid ${column.color}25`,
              },
            }}
          >
            {/* Column Header */}
            <Box
              sx={{
                p: 2.5,
                background: `linear-gradient(135deg, ${column.color}08, ${column.color}05)`,
                borderBottom: `1px solid ${column.color}20`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backdropFilter: "blur(10px)",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: column.gradient,
                  opacity: 0.3,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: column.gradient,
                    boxShadow: `0 2px 8px ${column.color}40`,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: 2,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.3)",
                    },
                  }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    background: column.gradient,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "1rem",
                  }}
                >
                  {column.title}
                </Typography>
                <Badge
                  badgeContent={columnTasks.length}
                  sx={{
                    pl: 1,
                    "& .MuiBadge-badge": {
                      background: column.gradient,
                      color: "white",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      boxShadow: `0 2px 6px ${column.color}40`,
                      border: "2px solid white",
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: column.color,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: `${column.color}15`,
                      transform: "scale(1.1)",
                      color: column.color,
                    },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: column.color,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: `${column.color}15`,
                      transform: "scale(1.1)",
                      color: column.color,
                    },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Column Content */}
            <Box
              sx={{
                p: 2,
                minHeight: 400,
                maxHeight: 600,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {columnTasks.map((task) => (
                <TaskCard key={task._id} task={task as Task} />
              ))}

              {columnTasks.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                    color: "#64748b",
                  }}
                >
                  <Typography variant="body2">
                    Không có công việc nào
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{
                      mt: 1,
                      textTransform: "none",
                      color: column.color,
                    }}
                  >
                    Thêm công việc
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
}
