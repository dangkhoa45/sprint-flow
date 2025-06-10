"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { useState, useEffect } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import { TaskStatus, TaskPriority } from "../types/report.types";
import { STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from "../constants/report.constants";
import ReportWrapper from "./common/ReportWrapper";

interface GanttTask {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  assignedTo: {
    _id: string;
    displayName: string;
    avatar?: string;
  }[];
  dependencies: string[];
  project: {
    _id: string;
    name: string;
    color: string;
  };
  milestone?: boolean;
}

interface ProjectTimeline {
  _id: string;
  name: string;
  color: string;
  startDate: Date;
  endDate: Date;
  tasks: GanttTask[];
  progress: number;
}

// Generate mock data for Gantt chart
const generateMockGanttData = (): ProjectTimeline[] => {
  const projects = [
    { _id: "proj1", name: "Website Redesign", color: "#3b82f6" },
    { _id: "proj2", name: "Mobile App", color: "#10b981" },
    { _id: "proj3", name: "API Development", color: "#f59e0b" },
  ];

  const users = [
    { _id: "user1", displayName: "Nguyễn Văn A", avatar: "" },
    { _id: "user2", displayName: "Trần Thị B", avatar: "" },
    { _id: "user3", displayName: "Lê Văn C", avatar: "" },
    { _id: "user4", displayName: "Phạm Thị D", avatar: "" },
  ];

  const statuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE, TaskStatus.BLOCKED];
  const priorities = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT];

  return projects.map((project, projIndex) => {
    const projectStart = new Date(2024, 11, 1 + projIndex * 10);
    const projectEnd = new Date(2025, 1, 15 + projIndex * 10);
    
    const tasks: GanttTask[] = [];
    const taskCount = 6 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < taskCount; i++) {
      const taskStart = new Date(projectStart.getTime() + i * 5 * 24 * 60 * 60 * 1000);
      const taskDuration = 3 + Math.floor(Math.random() * 10);
      const taskEnd = new Date(taskStart.getTime() + taskDuration * 24 * 60 * 60 * 1000);
      
      const assignedUsers = users
        .sort(() => 0.5 - Math.random())
        .slice(0, 1 + Math.floor(Math.random() * 2));
      
      tasks.push({
        _id: `task_${projIndex}_${i}`,
        title: `Task ${i + 1} - ${project.name}`,
        description: `Description for task ${i + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        startDate: taskStart,
        endDate: taskEnd,
        estimatedHours: taskDuration * 8,
        actualHours: taskDuration * 8 * (0.8 + Math.random() * 0.4),
        progress: Math.floor(Math.random() * 101),
        assignedTo: assignedUsers,
        dependencies: i > 0 && Math.random() > 0.7 ? [`task_${projIndex}_${i-1}`] : [],
        project,
        milestone: i === taskCount - 1, // Last task is milestone
      });
    }
    
    const projectProgress = tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length;
    
    return {
      _id: project._id,
      name: project.name,
      color: project.color,
      startDate: projectStart,
      endDate: projectEnd,
      tasks,
      progress: Math.floor(projectProgress),
    };
  });
};

const statusColors = STATUS_COLORS;
const statusLabels = STATUS_LABELS;
const priorityColors = PRIORITY_COLORS;
const priorityLabels = PRIORITY_LABELS;

export default function GanttChartReport() {
  const [projects, setProjects] = useState<ProjectTimeline[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  useEffect(() => {
    setProjects(generateMockGanttData());
  }, []);

  const filteredProjects = selectedProject === "all" 
    ? projects 
    : projects.filter(p => p._id === selectedProject);

  const getAllTasks = () => {
    return filteredProjects.flatMap(project => project.tasks);
  };

  const getTimelineData = () => {
    const allTasks = getAllTasks();
    const startDate = new Date(Math.min(...allTasks.map(t => t.startDate.getTime())));
    const endDate = new Date(Math.max(...allTasks.map(t => t.endDate.getTime())));
    
    return { startDate, endDate, totalDays: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) };
  };

  const timelineData = getTimelineData();

  const getTaskPosition = (task: GanttTask) => {
    const { startDate } = timelineData;
    const taskStart = Math.ceil((task.startDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const taskDuration = Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      left: `${(taskStart / timelineData.totalDays) * 100}%`,
      width: `${(taskDuration / timelineData.totalDays) * 100}%`,
    };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getOverallStats = () => {
    const allTasks = getAllTasks();
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === "DONE").length;
    const inProgressTasks = allTasks.filter(t => t.status === "IN_PROGRESS").length;
    const blockedTasks = allTasks.filter(t => t.status === "BLOCKED").length;
    const overdueTasks = allTasks.filter(t => t.endDate < new Date() && t.status !== "DONE").length;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  };

  const stats = getOverallStats();

  return (
    <ReportWrapper
      title="Biểu đồ Gantt - Timeline dự án"
      description="Theo dõi tiến độ và phụ thuộc của các công việc theo thời gian"
      actions={
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Dự án</InputLabel>
          <Select
            value={selectedProject}
            label="Dự án"
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <MenuItem value="all">Tất cả dự án</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project._id} value={project._id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
    >

      {/* Controls */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Dự án</InputLabel>
            <Select
              value={selectedProject}
              label="Dự án"
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <MenuItem value="all">Tất cả dự án</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Chế độ xem</InputLabel>
            <Select
              value={viewMode}
              label="Chế độ xem"
              onChange={(e) => setViewMode(e.target.value as "month" | "week" | "day")}
            >
              <MenuItem value="day">Theo ngày</MenuItem>
              <MenuItem value="week">Theo tuần</MenuItem>
              <MenuItem value="month">Theo tháng</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #3b82f620, #3b82f610)",
              border: "1px solid #3b82f630",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <CalendarTodayIcon sx={{ color: "#3b82f6", fontSize: 32, mb: 1 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#3b82f6", mb: 0.5 }}
              >
                {stats.totalTasks}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Tổng công việc
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #10b98120, #10b98110)",
              border: "1px solid #10b98130",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <TrendingUpIcon sx={{ color: "#10b981", fontSize: 32, mb: 1 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#10b981", mb: 0.5 }}
              >
                {stats.completedTasks}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #f59e0b20, #f59e0b10)",
              border: "1px solid #f59e0b30",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <AccountTreeIcon sx={{ color: "#f59e0b", fontSize: 32, mb: 1 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#f59e0b", mb: 0.5 }}
              >
                {stats.inProgressTasks}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Đang thực hiện
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #ef444420, #ef444410)",
              border: "1px solid #ef444430",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#ef4444", mb: 0.5 }}
              >
                {stats.blockedTasks}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Bị chặn
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #8b5cf620, #8b5cf610)",
              border: "1px solid #8b5cf630",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <GroupIcon sx={{ color: "#8b5cf6", fontSize: 32, mb: 1 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#8b5cf6", mb: 0.5 }}
              >
                {stats.completionRate.toFixed(0)}%
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Tiến độ chung
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gantt Chart */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          mb: 4,
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid #e2e8f0" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#1e293b" }}
          >
            Timeline các dự án
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#64748b", mt: 0.5 }}
          >
            {formatDate(timelineData.startDate)} - {formatDate(new Date(timelineData.startDate.getTime() + timelineData.totalDays * 24 * 60 * 60 * 1000))}
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {/* Timeline Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "250px 1fr",
              gap: 2,
              mb: 2,
              borderBottom: "1px solid #e2e8f0",
              pb: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b" }}>
              Công việc
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {formatDate(timelineData.startDate)}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {formatDate(new Date(timelineData.startDate.getTime() + timelineData.totalDays * 24 * 60 * 60 * 1000))}
              </Typography>
            </Box>
          </Box>

          {/* Project Timelines */}
          {filteredProjects.map((project) => (
            <Box key={project._id} sx={{ mb: 4 }}>
              {/* Project Header */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "250px 1fr",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: project.color,
                      borderRadius: "50%",
                    }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1e293b" }}
                    >
                      {project.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      {project.tasks.length} công việc
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ position: "relative", height: 8, mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#f1f5f9",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: project.color,
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: -20,
                      color: "#64748b",
                      fontSize: "0.7rem",
                    }}
                  >
                    {project.progress}%
                  </Typography>
                </Box>
              </Box>

              {/* Project Tasks */}
              {project.tasks.map((task) => (
                <Box
                  key={task._id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "250px 1fr",
                    gap: 2,
                    mb: 1.5,
                    py: 1,
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      borderRadius: 1,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pl: 3 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: statusColors[task.status],
                        borderRadius: "50%",
                      }}
                    />
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#1e293b",
                          mb: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {task.title}
                      </Typography>
                      
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                          size="small"
                          label={priorityLabels[task.priority]}
                          sx={{
                            fontSize: "0.65rem",
                            height: 18,
                            backgroundColor: `${priorityColors[task.priority]}20`,
                            color: priorityColors[task.priority],
                          }}
                        />
                        
                        {task.assignedTo.length > 0 && (
                          <AvatarGroup max={2} sx={{ "& .MuiAvatar-root": { width: 20, height: 20, fontSize: "0.7rem" } }}>
                            {task.assignedTo.map((user) => (
                              <Avatar
                                key={user._id}
                                sx={{
                                  bgcolor: `hsl(${(user.displayName.charCodeAt(0) * 137.5) % 360}, 70%, 50%)`,
                                }}
                              >
                                {user.displayName.charAt(0)}
                              </Avatar>
                            ))}
                          </AvatarGroup>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ position: "relative", height: 32, display: "flex", alignItems: "center" }}>
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="caption" sx={{ display: "block", fontWeight: 600 }}>
                            {task.title}
                          </Typography>
                          <Typography variant="caption" sx={{ display: "block" }}>
                            {formatDate(task.startDate)} - {formatDate(task.endDate)}
                          </Typography>
                          <Typography variant="caption" sx={{ display: "block" }}>
                            Trạng thái: {statusLabels[task.status]}
                          </Typography>
                          <Typography variant="caption" sx={{ display: "block" }}>
                            Tiến độ: {task.progress}%
                          </Typography>
                        </Box>
                      }
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          height: task.milestone ? 16 : 12,
                          backgroundColor: statusColors[task.status],
                          borderRadius: task.milestone ? "50%" : 2,
                          opacity: 0.8,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          minWidth: task.milestone ? 16 : 20,
                          ...getTaskPosition(task),
                          "&:hover": {
                            opacity: 1,
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        {!task.milestone && (
                          <Box
                            sx={{
                              height: "100%",
                              backgroundColor: `${statusColors[task.status]}40`,
                              borderRadius: "2px 0 0 2px",
                              width: `${task.progress}%`,
                            }}
                          />
                        )}
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Project Statistics */}
      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid size={{ xs: 12, md: 4 }} key={project._id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: project.color,
                    borderRadius: "50%",
                    mr: 1.5,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1e293b" }}
                >
                  {project.name}
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Tiến độ tổng thể
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#f1f5f9",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: project.color,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Tổng công việc
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    {project.tasks.length}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Hoàn thành
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#10b981" }}>
                    {project.tasks.filter(t => t.status === "DONE").length}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Đang thực hiện
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#f59e0b" }}>
                    {project.tasks.filter(t => t.status === "IN_PROGRESS").length}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Milestone
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#8b5cf6" }}>
                    {project.tasks.filter(t => t.milestone).length}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </ReportWrapper>
  );
}
