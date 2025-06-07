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
  },
  {
    id: TaskStatus.IN_PROGRESS,
    title: "Đang thực hiện",
    color: "#2563eb",
    bgColor: "#eff6ff",
  },
  {
    id: TaskStatus.IN_REVIEW,
    title: "Đang xem xét",
    color: "#f59e0b",
    bgColor: "#fffbeb",
  },
  {
    id: TaskStatus.DONE,
    title: "Hoàn thành",
    color: "#059669",
    bgColor: "#f0fdf4",
  },
  {
    id: TaskStatus.BLOCKED,
    title: "Bị chặn",
    color: "#dc2626",
    bgColor: "#fef2f2",
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
    <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 2 }}>
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);

        return (
          <Paper
            key={column.id}
            sx={{
              minWidth: 320,
              maxWidth: 320,
              backgroundColor: column.bgColor,
              border: `2px solid ${column.color}20`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {/* Column Header */}
            <Box
              sx={{
                p: 2,
                backgroundColor: column.color + "10",
                borderBottom: `1px solid ${column.color}30`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: column.color,
                  }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: column.color,
                  }}
                >
                  {column.title}
                </Typography>
                <Badge
                  badgeContent={columnTasks.length}
                  sx={{
                    pl: 1,
                    "& .MuiBadge-badge": {
                      backgroundColor: column.color,
                      color: "white",
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </Box>
              <Box>
                <IconButton size="small" sx={{ color: column.color }}>
                  <AddIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: column.color }}>
                  <MoreVertIcon />
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
