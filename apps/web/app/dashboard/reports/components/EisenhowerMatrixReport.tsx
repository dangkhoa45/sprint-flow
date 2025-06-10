"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { Task, TaskPriority, TaskStatus } from "../../tasks/types/task";
import ReportWrapper from "./common/ReportWrapper";

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    _id: "1",
    title: "Fix critical security vulnerability",
    description: "Patch SQL injection vulnerability in user authentication",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGHEST,
    assignee: {
      _id: "user1",
      displayName: "John Doe",
      username: "johndoe",
      role: "Senior Developer",
    },
    reporter: {
      _id: "user2",
      displayName: "Jane Smith",
      username: "janesmith",
      role: "Security Lead",
    },
    project: {
      _id: "proj1",
      name: "Security Audit",
      key: "SEC",
      color: "#f44336",
    },
    dueDate: new Date("2025-06-12"),
    createdAt: new Date("2025-06-08"),
    updatedAt: new Date("2025-06-10"),
    tags: ["security", "critical", "urgent"],
    attachments: [],
    comments: [],
    estimatedHours: 8,
    loggedHours: 6,
    subtasks: [],
  },
  {
    _id: "2",
    title: "Implement new dashboard features",
    description: "Add analytics and reporting widgets to admin dashboard",
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    assignee: {
      _id: "user3",
      displayName: "Bob Wilson",
      username: "bobwilson",
      role: "Frontend Developer",
    },
    reporter: {
      _id: "user1",
      displayName: "John Doe",
      username: "johndoe",
      role: "Product Manager",
    },
    project: {
      _id: "proj2",
      name: "Dashboard Enhancement",
      key: "DASH",
      color: "#2196f3",
    },
    dueDate: new Date("2025-06-20"),
    createdAt: new Date("2025-06-05"),
    updatedAt: new Date("2025-06-10"),
    tags: ["dashboard", "analytics", "features"],
    attachments: [],
    comments: [],
    estimatedHours: 16,
    loggedHours: 0,
    subtasks: [],
  },
  {
    _id: "3",
    title: "Update documentation",
    description: "Review and update API documentation for new endpoints",
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    assignee: {
      _id: "user4",
      displayName: "Alice Brown",
      username: "alicebrown",
      role: "Technical Writer",
    },
    reporter: {
      _id: "user1",
      displayName: "John Doe",
      username: "johndoe",
      role: "Product Manager",
    },
    project: {
      _id: "proj3",
      name: "Documentation",
      key: "DOC",
      color: "#4caf50",
    },
    dueDate: new Date("2025-07-01"),
    createdAt: new Date("2025-06-01"),
    updatedAt: new Date("2025-06-10"),
    tags: ["documentation", "api"],
    attachments: [],
    comments: [],
    estimatedHours: 12,
    loggedHours: 2,
    subtasks: [],
  },
  {
    _id: "4",
    title: "Code refactoring - legacy components",
    description: "Refactor old React class components to functional components",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    assignee: {
      _id: "user3",
      displayName: "Bob Wilson",
      username: "bobwilson",
      role: "Frontend Developer",
    },
    reporter: {
      _id: "user2",
      displayName: "Jane Smith",
      username: "janesmith",
      role: "Tech Lead",
    },
    project: {
      _id: "proj4",
      name: "Code Modernization",
      key: "MOD",
      color: "#ff9800",
    },
    dueDate: new Date("2025-06-25"),
    createdAt: new Date("2025-06-03"),
    updatedAt: new Date("2025-06-10"),
    tags: ["refactoring", "react", "modernization"],
    attachments: [],
    comments: [],
    estimatedHours: 20,
    loggedHours: 8,
    subtasks: [],
  },
];

interface EisenhowerQuadrant {
  title: string;
  description: string;
  color: string;
  bgColor: string;
  tasks: Task[];
}

const isUrgent = (task: Task): boolean => {
  if (!task.dueDate) return false;
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilDue <= 3; // Consider urgent if due within 3 days
};

const isImportant = (task: Task): boolean => {
  return (
    task.priority === TaskPriority.HIGH ||
    task.priority === TaskPriority.HIGHEST ||
    task.tags.includes("critical") ||
    task.tags.includes("security")
  );
};

export default function EisenhowerMatrixReport() {
  const [tasks] = useState<Task[]>(mockTasks);
  const [quadrants, setQuadrants] = useState<EisenhowerQuadrant[]>([]);

  useEffect(() => {
    const urgentImportant = tasks.filter(
      (task) => isUrgent(task) && isImportant(task)
    );
    const notUrgentImportant = tasks.filter(
      (task) => !isUrgent(task) && isImportant(task)
    );
    const urgentNotImportant = tasks.filter(
      (task) => isUrgent(task) && !isImportant(task)
    );
    const notUrgentNotImportant = tasks.filter(
      (task) => !isUrgent(task) && !isImportant(task)
    );

    setQuadrants([
      {
        title: "Làm ngay (Do First)",
        description: "Khẩn cấp & Quan trọng",
        color: "#d32f2f",
        bgColor: "#ffebee",
        tasks: urgentImportant,
      },
      {
        title: "Lên kế hoạch (Schedule)",
        description: "Không khẩn cấp & Quan trọng",
        color: "#1976d2",
        bgColor: "#e3f2fd",
        tasks: notUrgentImportant,
      },
      {
        title: "Ủy quyền (Delegate)",
        description: "Khẩn cấp & Không quan trọng",
        color: "#f57c00",
        bgColor: "#fff3e0",
        tasks: urgentNotImportant,
      },
      {
        title: "Loại bỏ (Eliminate)",
        description: "Không khẩn cấp & Không quan trọng",
        color: "#388e3c",
        bgColor: "#e8f5e8",
        tasks: notUrgentNotImportant,
      },
    ]);
  }, [tasks]);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return "#6b7280";
      case TaskStatus.IN_PROGRESS:
        return "#2563eb";
      case TaskStatus.IN_REVIEW:
        return "#f59e0b";
      case TaskStatus.DONE:
        return "#059669";
      case TaskStatus.BLOCKED:
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <ReportWrapper
      title="Ma trận Eisenhower"
      description="Phân loại công việc theo mức độ khẩn cấp và quan trọng để ưu tiên hiệu quả"
    >
      <Grid container spacing={3}>
        {quadrants.map((quadrant, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: `2px solid ${quadrant.color}`,
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 40px ${quadrant.color}20`,
                },
              }}
            >
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${quadrant.color} 0%, ${quadrant.color}80 100%)`,
                  color: "white",
                  p: 2,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20zm0 0'/%3E%3C/g%3E%3C/svg%3E")`,
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {quadrant.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {quadrant.description}
                </Typography>
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                  }}
                >
                  {quadrant.tasks.length}
                </Box>
              </Box>

              <CardContent sx={{ p: 0, maxHeight: 400, overflowY: "auto" }}>
                {quadrant.tasks.length === 0 ? (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    <Typography variant="body2">
                      Không có công việc nào trong nhóm này
                    </Typography>
                  </Box>
                ) : (
                  quadrant.tasks.map((task) => (
                    <Box
                      key={task._id}
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #f1f5f9",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: quadrant.bgColor,
                          transform: "translateX(4px)",
                        },
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: "#1e293b",
                            flex: 1,
                            mr: 1,
                          }}
                        >
                          {task.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={task.project?.key}
                          sx={{
                            backgroundColor: `${task.project?.color}20`,
                            color: task.project?.color,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 20,
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Chip
                          size="small"
                          label={task.status.replace("_", " ")}
                          sx={{
                            backgroundColor: `${getStatusColor(task.status)}20`,
                            color: getStatusColor(task.status),
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 20,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b" }}
                        >
                          {task.assignee?.displayName}
                        </Typography>
                      </Box>

                      {task.dueDate && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: getDaysUntilDue(task.dueDate) <= 3 
                                ? "#dc2626" 
                                : getDaysUntilDue(task.dueDate) <= 7
                                ? "#f59e0b"
                                : "#64748b",
                              fontWeight: 600,
                            }}
                          >
                            {getDaysUntilDue(task.dueDate) <= 0
                              ? "Quá hạn"
                              : `${getDaysUntilDue(task.dueDate)} ngày`}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#64748b" }}
                          >
                            • {task.dueDate.toLocaleDateString("vi-VN")}
                          </Typography>
                        </Box>
                      )}

                      {task.estimatedHours && (
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{ color: "#64748b" }}
                          >
                            Ước lượng: {task.estimatedHours}h • Đã làm: {task.loggedHours || 0}h
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Summary Statistics */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, color: "#1e293b" }}
        >
          Tổng quan phân loại
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box
              sx={{
                p: 2,
                background: "linear-gradient(135deg, #d32f2f20, #d32f2f10)",
                borderRadius: 2,
                border: "1px solid #d32f2f30",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#d32f2f", mb: 0.5 }}
              >
                {quadrants[0]?.tasks.length || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Khẩn cấp & Quan trọng
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box
              sx={{
                p: 2,
                background: "linear-gradient(135deg, #1976d220, #1976d210)",
                borderRadius: 2,
                border: "1px solid #1976d230",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#1976d2", mb: 0.5 }}
              >
                {quadrants[1]?.tasks.length || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Quan trọng & Không khẩn cấp
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box
              sx={{
                p: 2,
                background: "linear-gradient(135deg, #f57c0020, #f57c0010)",
                borderRadius: 2,
                border: "1px solid #f57c0030",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#f57c00", mb: 0.5 }}
              >
                {quadrants[2]?.tasks.length || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Khẩn cấp & Không quan trọng
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box
              sx={{
                p: 2,
                background: "linear-gradient(135deg, #388e3c20, #388e3c10)",
                borderRadius: 2,
                border: "1px solid #388e3c30",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#388e3c", mb: 0.5 }}
              >
                {quadrants[3]?.tasks.length || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Không khẩn cấp & Không quan trọng
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ReportWrapper>
  );
}
