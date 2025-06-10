"use client";

import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SearchIcon from "@mui/icons-material/Search";
import WarningIcon from "@mui/icons-material/Warning";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import ReportWrapper from "./common/ReportWrapper";
interface Task {
  id: string;
  title: string;
  status:
    | "not_started"
    | "in_progress"
    | "completed"
    | "blocked"
    | "on_hold"
    | "overdue";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  project: string;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  blockedReason?: string;
}

const TaskExecutionStatusReport: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<
    "overview" | "detailed" | "timeline"
  >("overview");

  // Mock data
  const mockTasks: Task[] = useMemo(() => {
    const statuses: Task["status"][] = [
      "not_started",
      "in_progress",
      "completed",
      "blocked",
      "on_hold",
      "overdue",
    ];
    const priorities: Task["priority"][] = ["low", "medium", "high", "urgent"];
    const assignees = [
      "John Doe",
      "Jane Smith",
      "Bob Johnson",
      "Alice Brown",
      "Charlie Wilson",
    ];
    const projects = [
      "Project Alpha",
      "Project Beta",
      "Project Gamma",
      "Project Delta",
    ];

    return Array.from({ length: 150 }, (_, i) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const createdDate = new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28)
      );
      const dueDate = new Date(
        createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
      );
      const estimatedHours = Math.floor(Math.random() * 40) + 5;

      return {
        id: `task-${i + 1}`,
        title: `Task ${i + 1}: ${
          [
            "Implement feature",
            "Fix bug",
            "Review code",
            "Write tests",
            "Update documentation",
          ][Math.floor(Math.random() * 5)]
        }`,
        status:
          status === "overdue"
            ? dueDate < new Date()
              ? "overdue"
              : "in_progress"
            : status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assignee: assignees[Math.floor(Math.random() * assignees.length)],
        project: projects[Math.floor(Math.random() * projects.length)],
        dueDate: dueDate.toISOString().split("T")[0],
        createdAt: createdDate.toISOString().split("T")[0],
        completedAt:
          status === "completed"
            ? new Date(
                dueDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0]
            : undefined,
        estimatedHours,
        actualHours:
          status === "completed"
            ? Math.floor(estimatedHours * (0.8 + Math.random() * 0.4))
            : Math.floor(estimatedHours * Math.random()),
        progress:
          status === "completed"
            ? 100
            : status === "not_started"
            ? 0
            : Math.floor(Math.random() * 90) + 10,
        blockedReason:
          status === "blocked"
            ? [
                "Waiting for approval",
                "Missing resources",
                "Dependencies not ready",
                "Technical issues",
              ][Math.floor(Math.random() * 4)]
            : undefined,
      };
    });
  }, []);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return mockTasks.filter((task) => {
      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;
      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;
      const matchesProject =
        filterProject === "all" || task.project === filterProject;
      const matchesSearch =
        searchTerm === "" ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchesStatus && matchesPriority && matchesProject && matchesSearch
      );
    });
  }, [mockTasks, filterStatus, filterPriority, filterProject, searchTerm]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(
      (t) => t.status === "completed"
    ).length;
    const inProgress = filteredTasks.filter(
      (t) => t.status === "in_progress"
    ).length;
    const blocked = filteredTasks.filter((t) => t.status === "blocked").length;
    const overdue = filteredTasks.filter((t) => t.status === "overdue").length;
    const onTime = filteredTasks.filter(
      (t) =>
        t.status === "completed" &&
        t.completedAt &&
        new Date(t.completedAt) <= new Date(t.dueDate)
    ).length;

    return {
      total,
      completed,
      inProgress,
      blocked,
      overdue,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      onTimeRate: completed > 0 ? (onTime / completed) * 100 : 0,
      blockedRate: total > 0 ? (blocked / total) * 100 : 0,
    };
  }, [filteredTasks]);

  // Status distribution data
  const statusDistribution = useMemo(() => {
    const statusCounts = filteredTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.replace("_", " ").toUpperCase(),
      value: count,
      color: getStatusColor(status as Task["status"]),
    }));
  }, [filteredTasks]);

  // Priority breakdown
  const priorityBreakdown = useMemo(() => {
    const priorityData = filteredTasks.reduce((acc, task) => {
      if (!acc[task.priority]) {
        acc[task.priority] = { total: 0, completed: 0, blocked: 0, overdue: 0 };
      }
      acc[task.priority].total++;
      if (task.status === "completed") acc[task.priority].completed++;
      if (task.status === "blocked") acc[task.priority].blocked++;
      if (task.status === "overdue") acc[task.priority].overdue++;
      return acc;
    }, {} as Record<string, { total: number; completed: number; blocked: number; overdue: number }>);

    return Object.entries(priorityData).map(([priority, data]) => ({
      priority: priority.toUpperCase(),
      ...data,
      completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
    }));
  }, [filteredTasks]);

  // Timeline data
  const timelineData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split("T")[0];
    });

    return last30Days.map((date) => {
      const dayTasks = filteredTasks.filter(
        (task) => task.createdAt === date || task.completedAt === date
      );

      return {
        date,
        created: dayTasks.filter((task) => task.createdAt === date).length,
        completed: dayTasks.filter((task) => task.completedAt === date).length,
        blocked: dayTasks.filter((task) => task.status === "blocked").length,
      };
    });
  }, [filteredTasks]);

  function getStatusColor(status: Task["status"]): string {
    const colors = {
      completed: "#4caf50",
      in_progress: "#2196f3",
      not_started: "#9e9e9e",
      blocked: "#f44336",
      on_hold: "#ff9800",
      overdue: "#d32f2f",
    };
    return colors[status] || "#9e9e9e";
  }

  function getStatusIcon(status: Task["status"]) {
    const icons = {
      completed: <CheckCircleIcon sx={{ color: "#4caf50" }} />,
      in_progress: <PlayArrowIcon sx={{ color: "#2196f3" }} />,
      not_started: <ScheduleIcon sx={{ color: "#9e9e9e" }} />,
      blocked: <ErrorIcon sx={{ color: "#f44336" }} />,
      on_hold: <PauseIcon sx={{ color: "#ff9800" }} />,
      overdue: <WarningIcon sx={{ color: "#d32f2f" }} />,
    };
    return icons[status] || <AssignmentIcon />;
  }

  function getPriorityColor(priority: Task["priority"]): string {
    const colors = {
      low: "#4caf50",
      medium: "#ff9800",
      high: "#f44336",
      urgent: "#d32f2f",
    };
    return colors[priority] || "#9e9e9e";
  }

  const projects = Array.from(new Set(mockTasks.map((t) => t.project)));

  return (
    <ReportWrapper
      title="Task Execution Status Report"
      description="Monitor and analyze task execution status across all projects and teams"
    >

      {/* Filters */}
      <Card
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="not_started">Not Started</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  label="Priority"
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Project</InputLabel>
                <Select
                  value={filterProject}
                  label="Project"
                  onChange={(e) => setFilterProject(e.target.value)}
                >
                  <MenuItem value="all">All Projects</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project} value={project}>
                      {project}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>View Mode</InputLabel>
                <Select
                  value={viewMode}
                  label="View Mode"
                  onChange={(e) => setViewMode(e.target.value as "overview" | "detailed" | "timeline")}
                >
                  <MenuItem value="overview">Overview</MenuItem>
                  <MenuItem value="detailed">Detailed</MenuItem>
                  <MenuItem value="timeline">Timeline</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {summaryStats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Tasks
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {summaryStats.completionRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Completion Rate
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {summaryStats.onTimeRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    On-Time Delivery
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {summaryStats.blocked}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Blocked Tasks
                  </Typography>
                </Box>
                <ErrorIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts for Critical Issues */}
      {summaryStats.overdue > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Overdue Tasks Alert</AlertTitle>
          You have {summaryStats.overdue} overdue tasks that require immediate
          attention.
        </Alert>
      )}

      {summaryStats.blockedRate > 20 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>High Block Rate Warning</AlertTitle>
          {summaryStats.blockedRate.toFixed(1)}% of tasks are currently blocked.
          Consider reviewing and resolving blockers.
        </Alert>
      )}

      {/* Main Content Based on View Mode */}
      {viewMode === "overview" && (
        <Grid container spacing={3}>
          {/* Status Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Priority Breakdown */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Priority Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priorityBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" name="Total" />
                    <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                    <Bar dataKey="blocked" fill="#ff7300" name="Blocked" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {viewMode === "timeline" && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Timeline (Last 30 Days)
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <YAxis />
                    <RechartsTooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="created"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="Created"
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Completed"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {viewMode === "detailed" && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Details
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Task</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Assignee</TableCell>
                        <TableCell>Project</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Due Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTasks.slice(0, 20).map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {task.title}
                            </Typography>
                            {task.blockedReason && (
                              <Typography variant="caption" color="error">
                                Blocked: {task.blockedReason}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {getStatusIcon(task.status)}
                              <Chip
                                label={task.status
                                  .replace("_", " ")
                                  .toUpperCase()}
                                size="small"
                                sx={{
                                  backgroundColor: getStatusColor(task.status),
                                  color: "white",
                                  fontWeight: "bold",
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={task.priority.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: getPriorityColor(
                                  task.priority
                                ),
                                color: "white",
                              }}
                            />
                          </TableCell>
                          <TableCell>{task.assignee}</TableCell>
                          <TableCell>{task.project}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LinearProgress
                                variant="determinate"
                                value={task.progress}
                                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                              />
                              <Typography variant="caption">
                                {task.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color={
                                new Date(task.dueDate) < new Date() &&
                                task.status !== "completed"
                                  ? "error"
                                  : "text.primary"
                              }
                            >
                              {new Date(task.dueDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </ReportWrapper>
  );
};

export default TaskExecutionStatusReport;
