"use client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import {
  Project,
  ProjectPriority,
  ProjectStatus,
} from "../../../../types/project";
import EditProjectDialog from "../components/EditProjectDialog";

// Mock data - would be replaced with API call
const mockProject: Project = {
  _id: "1",
  name: "SprintFlow Mobile App",
  description:
    "Phát triển ứng dụng mobile cho hệ thống quản lý dự án SprintFlow với React Native. Ứng dụng sẽ hỗ trợ các tính năng quản lý task, theo dõi tiến độ, chat nhóm và thông báo real-time.",
  status: ProjectStatus.IN_PROGRESS,
  priority: ProjectPriority.HIGH,
  startDate: new Date("2024-01-15"),
  endDate: new Date("2024-06-30"),
  progress: 75,
  budget: 50000,
  owner: {
    _id: "user1",
    username: "john_doe",
    displayName: "John Doe",
    role: "owner",
  },
  members: [
    {
      _id: "user1",
      username: "john_doe",
      displayName: "John Doe",
      role: "owner",
    },
    {
      _id: "user2",
      username: "jane_smith",
      displayName: "Jane Smith",
      role: "manager",
    },
    {
      _id: "user3",
      username: "bob_wilson",
      displayName: "Bob Wilson",
      role: "member",
    },
  ],
  tasksCount: 24,
  completedTasks: 18,
  tags: ["React Native", "Mobile", "iOS", "Android"],
  createdAt: new Date("2024-01-10"),
  updatedAt: new Date("2024-05-20"),
};

// Mock recent tasks data
const mockRecentTasks = [
  {
    id: "1",
    title: "Thiết kế UI màn hình đăng nhập",
    status: "completed",
    assignee: "Jane Smith",
    dueDate: new Date("2024-05-15"),
    priority: "high",
  },
  {
    id: "2",
    title: "Implement push notifications",
    status: "in_progress",
    assignee: "Bob Wilson",
    dueDate: new Date("2024-05-25"),
    priority: "medium",
  },
  {
    id: "3",
    title: "Setup CI/CD pipeline",
    status: "pending",
    assignee: "John Doe",
    dueDate: new Date("2024-05-30"),
    priority: "low",
  },
];

// Mock activity timeline data
const mockActivities = [
  {
    id: "1",
    type: "task_completed",
    title: "Jane Smith đã hoàn thành task 'Thiết kế UI màn hình đăng nhập'",
    time: new Date("2024-05-20T14:30:00"),
    user: "Jane Smith",
  },
  {
    id: "2",
    type: "member_added",
    title: "Bob Wilson đã được thêm vào dự án",
    time: new Date("2024-05-18T10:15:00"),
    user: "John Doe",
  },
  {
    id: "3",
    type: "progress_updated",
    title: "Tiến độ dự án được cập nhật lên 75%",
    time: new Date("2024-05-17T16:45:00"),
    user: "John Doe",
  },
  {
    id: "4",
    type: "task_created",
    title: "Task mới 'Implement push notifications' được tạo",
    time: new Date("2024-05-15T09:20:00"),
    user: "John Doe",
  },
];

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

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params); // unwrap params Promise
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchProject = async () => {
      try {
        // TODO: Replace with actual API call
        console.log("Fetching project with ID:", id);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
        setProject(mockProject);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleEditProject = async (
    projectId: string,
    projectData: Partial<Project>
  ) => {
    try {
      // TODO: API call to update project
      console.log("Updating project:", projectId, projectData);

      // Update local state for demo
      if (project) {
        setProject({ ...project, ...projectData });
      }

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysRemaining = () => {
    if (!project?.endDate) return null;
    const today = new Date();
    const endDate = new Date(project.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "in_progress":
        return "#ff9800";
      case "pending":
        return "#9e9e9e";
      default:
        return "#2196f3";
    }
  };

  const getTaskStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "in_progress":
        return "Đang thực hiện";
      case "pending":
        return "Chờ xử lý";
      default:
        return "Mới";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_completed":
        return <CheckCircleIcon sx={{ color: "#4caf50" }} />;
      case "member_added":
        return <GroupIcon sx={{ color: "#2196f3" }} />;
      case "progress_updated":
        return <TrendingUpIcon sx={{ color: "#ff9800" }} />;
      case "task_created":
        return <AssignmentIcon sx={{ color: "#9c27b0" }} />;
      default:
        return <HistoryIcon sx={{ color: "#757575" }} />;
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Đang tải...
        </Typography>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Không tìm thấy dự án
        </Typography>
      </Box>
    );
  }

  const statusInfo = statusConfig[project.status];
  const priorityInfo = priorityConfig[project.priority];
  const daysRemaining = getDaysRemaining();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        <IconButton
          onClick={() => router.back()}
          sx={{
            mr: 2,
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            color: "white",
            "&:hover": {
              background: "linear-gradient(45deg, #764ba2, #667eea)",
              transform: "scale(1.05)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 0.5,
            }}
          >
            {project.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
            Chi tiết dự án
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => setIsEditDialogOpen(true)}
          sx={{
            background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
            boxShadow: "0 8px 32px rgba(66, 165, 245, 0.3)",
            borderRadius: 3,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 40px rgba(66, 165, 245, 0.4)",
            },
          }}
        >
          Chỉnh sửa dự án
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 3,
              p: 4,
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "white", fontWeight: 600, mb: 3 }}
            >
              Thông tin dự án
            </Typography>

            {/* Status and Priority */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Chip
                label={statusInfo.label}
                sx={{
                  backgroundColor: statusInfo.bgColor,
                  color: statusInfo.color,
                  border: `1px solid ${statusInfo.color}30`,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              />
              <Chip
                label={priorityInfo.label}
                sx={{
                  backgroundColor: "transparent",
                  color: priorityInfo.color,
                  border: `1px solid ${priorityInfo.color}`,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              />
            </Box>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              {project.description}
            </Typography>

            {/* Progress */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 20 }} />
                  Tiến độ dự án
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  {project.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={project.progress}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: statusInfo.color,
                    borderRadius: 6,
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {project.completedTasks} / {project.tasksCount} tasks hoàn
                  thành
                </Typography>
                {daysRemaining && (
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        daysRemaining < 0
                          ? "#f44336"
                          : daysRemaining < 7
                          ? "#ff9800"
                          : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {daysRemaining < 0
                      ? "Quá hạn"
                      : `${daysRemaining} ngày còn lại`}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Tags */}
            {project.tags.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
                  Tags
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {project.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>

          {/* Recent Tasks */}
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 3,
              p: 4,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              <AssignmentIcon sx={{ color: "white" }} />
              <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
                Tasks gần đây
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {mockRecentTasks.map((task) => (
                <Box
                  key={task.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      color: getTaskStatusColor(task.status),
                      fontSize: 20,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "white", fontWeight: 600, mb: 0.5 }}
                    >
                      {task.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        label={getTaskStatusLabel(task.status)}
                        size="small"
                        sx={{
                          backgroundColor: "transparent",
                          color: getTaskStatusColor(task.status),
                          border: `1px solid ${getTaskStatusColor(
                            task.status
                          )}`,
                          fontSize: "0.75rem",
                          height: 20,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {task.assignee} • {formatDate(task.dueDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Activity Timeline */}
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 3,
              p: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              <HistoryIcon sx={{ color: "white" }} />
              <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
                Hoạt động gần đây
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {mockActivities.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    pb: 2,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    "&:last-child": {
                      borderBottom: "none",
                      pb: 0,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.9)",
                        lineHeight: 1.5,
                        mb: 0.5,
                      }}
                    >
                      {activity.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                    >
                      {formatRelativeTime(activity.time)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Project Stats */}
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 3,
              p: 3,
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: 600, mb: 3 }}
            >
              Thống kê
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Timeline */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <CalendarTodayIcon
                    sx={{ fontSize: 16, color: "rgba(255, 255, 255, 0.7)" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    Thời gian
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  {formatDate(project.startDate)} -{" "}
                  {project.endDate
                    ? formatDate(project.endDate)
                    : "Chưa xác định"}
                </Typography>
              </Box>

              {/* Owner */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <PersonIcon
                    sx={{ fontSize: 16, color: "rgba(255, 255, 255, 0.7)" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    Chủ dự án
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: "0.75rem",
                      bgcolor: `hsl(${
                        (project.owner.displayName.charCodeAt(0) * 137.5) % 360
                      }, 70%, 50%)`,
                    }}
                  >
                    {project.owner.displayName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    {project.owner.displayName}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Team Members */}
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 3,
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              <GroupIcon sx={{ color: "white" }} />
              <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                Thành viên ({project.members.length})
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {project.members.map((member) => (
                <Box
                  key={member._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: `hsl(${
                        (member.displayName.charCodeAt(0) * 137.5) % 360
                      }, 70%, 50%)`,
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {member.displayName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "white", fontWeight: 600 }}
                    >
                      {member.displayName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      @{member.username} • {member.role}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <EditProjectDialog
        open={isEditDialogOpen}
        project={project}
        onCloseAction={() => setIsEditDialogOpen(false)}
        onSubmitAction={handleEditProject}
      />
    </Box>
  );
}
