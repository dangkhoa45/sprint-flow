"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TaskPriority, TaskStatus } from "../../tasks/types/task";
import ReportWrapper from "./common/ReportWrapper";

interface TaskExecutionData {
  taskId: string;
  taskTitle: string;
  assignee: string;
  estimatedHours: number;
  actualHours: number;
  variance: number;
  variancePercentage: number;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: Date;
  endDate?: Date;
  duration: number; // in days
}

interface ProjectExecutionSummary {
  projectName: string;
  totalTasks: number;
  avgEstimatedHours: number;
  avgActualHours: number;
  avgVariance: number;
  onTimeDelivery: number;
  efficiency: number;
}

// Mock data generation
const generateMockTaskExecutionData = (): TaskExecutionData[] => {
  const tasks = [
    {
      id: "1",
      title: "Thiết kế giao diện đăng nhập",
      assignee: "Nguyễn Văn A",
    },
    { id: "2", title: "API authentication", assignee: "Trần Thị B" },
    { id: "3", title: "Database schema design", assignee: "Lê Văn C" },
    { id: "4", title: "Frontend dashboard", assignee: "Phạm Thị D" },
    { id: "5", title: "Mobile responsive", assignee: "Hoàng Văn E" },
    { id: "6", title: "Unit testing", assignee: "Nguyễn Văn A" },
    { id: "7", title: "Integration testing", assignee: "Trần Thị B" },
    { id: "8", title: "Performance optimization", assignee: "Lê Văn C" },
    { id: "9", title: "Security audit", assignee: "Phạm Thị D" },
    { id: "10", title: "Documentation", assignee: "Hoàng Văn E" },
  ];

  return tasks.map((task) => {
    const estimatedHours = Math.floor(Math.random() * 40) + 8; // 8-48 hours
    const varianceFactor = (Math.random() - 0.5) * 0.8; // -40% to +40%
    const actualHours = Math.max(
      1,
      estimatedHours + estimatedHours * varianceFactor
    );
    const variance = actualHours - estimatedHours;
    const variancePercentage = (variance / estimatedHours) * 100;

    const startDate = new Date(2025, 5, Math.floor(Math.random() * 20) + 1);
    const duration =
      Math.floor(actualHours / 8) + Math.floor(Math.random() * 3);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    return {
      taskId: task.id,
      taskTitle: task.title,
      assignee: task.assignee,
      estimatedHours,
      actualHours: Math.round(actualHours * 10) / 10,
      variance: Math.round(variance * 10) / 10,
      variancePercentage: Math.round(variancePercentage * 10) / 10,
      status: [TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW][
        Math.floor(Math.random() * 3)
      ],
      priority: [
        TaskPriority.LOW,
        TaskPriority.MEDIUM,
        TaskPriority.HIGH,
        TaskPriority.HIGHEST,
      ][Math.floor(Math.random() * 4)],
      startDate,
      endDate: Math.random() > 0.3 ? endDate : undefined,
      duration,
    };
  });
};

const generateProjectSummary = (
  tasks: TaskExecutionData[]
): ProjectExecutionSummary[] => {
  const projects = ["SprintFlow Mobile", "Website Redesign", "API Integration"];

  return projects.map((projectName) => {
    const projectTasks = tasks.slice(0, Math.floor(Math.random() * 5) + 3);
    const totalTasks = projectTasks.length;
    const avgEstimatedHours =
      projectTasks.reduce((sum, task) => sum + task.estimatedHours, 0) /
      totalTasks;
    const avgActualHours =
      projectTasks.reduce((sum, task) => sum + task.actualHours, 0) /
      totalTasks;
    const avgVariance =
      projectTasks.reduce((sum, task) => sum + task.variance, 0) / totalTasks;
    const onTimeDelivery =
      (projectTasks.filter((task) => task.variance <= 0).length / totalTasks) *
      100;
    const efficiency = (avgEstimatedHours / avgActualHours) * 100;

    return {
      projectName,
      totalTasks,
      avgEstimatedHours: Math.round(avgEstimatedHours * 10) / 10,
      avgActualHours: Math.round(avgActualHours * 10) / 10,
      avgVariance: Math.round(avgVariance * 10) / 10,
      onTimeDelivery: Math.round(onTimeDelivery * 10) / 10,
      efficiency: Math.round(efficiency * 10) / 10,
    };
  });
};

export default function TaskExecutionTimeReport() {
  const [filter, setFilter] = useState("all");
  const [tasks] = useState<TaskExecutionData[]>(
    generateMockTaskExecutionData()
  );
  const [projectSummary] = useState<ProjectExecutionSummary[]>(
    generateProjectSummary(generateMockTaskExecutionData())
  );

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "overrun") return task.variance > 0;
    if (filter === "ontime") return task.variance <= 0;
    if (filter === "completed") return task.status === TaskStatus.DONE;
    return true;
  });

  const summaryStats = {
    totalTasks: filteredTasks.length,
    avgEstimated:
      filteredTasks.reduce((sum, task) => sum + task.estimatedHours, 0) /
      filteredTasks.length,
    avgActual:
      filteredTasks.reduce((sum, task) => sum + task.actualHours, 0) /
      filteredTasks.length,
    accuracyRate:
      (filteredTasks.filter((task) => Math.abs(task.variancePercentage) <= 10)
        .length /
        filteredTasks.length) *
      100,
    overrunTasks: filteredTasks.filter((task) => task.variance > 0).length,
  };

  const chartData = filteredTasks.map((task) => ({
    name:
      task.taskTitle.length > 15
        ? task.taskTitle.substring(0, 15) + "..."
        : task.taskTitle,
    estimated: task.estimatedHours,
    actual: task.actualHours,
    variance: task.variance,
    variancePercentage: task.variancePercentage,
    assignee: task.assignee,
  }));

  const scatterData = filteredTasks.map((task) => ({
    x: task.estimatedHours,
    y: task.actualHours,
    z: Math.abs(task.variance),
    title: task.taskTitle,
    assignee: task.assignee,
  }));

  const efficiencyData = Array.from(
    new Set(filteredTasks.map((task) => task.assignee))
  ).map((assignee) => {
    const assigneeTasks = filteredTasks.filter(
      (task) => task.assignee === assignee
    );
    const avgEstimated =
      assigneeTasks.reduce((sum, task) => sum + task.estimatedHours, 0) /
      assigneeTasks.length;
    const avgActual =
      assigneeTasks.reduce((sum, task) => sum + task.actualHours, 0) /
      assigneeTasks.length;
    const efficiency = (avgEstimated / avgActual) * 100;

    return {
      assignee: assignee.split(" ").slice(-1)[0], // Last name only
      efficiency: Math.round(efficiency * 10) / 10,
      tasksCount: assigneeTasks.length,
      avgVariance:
        assigneeTasks.reduce((sum, task) => sum + task.variance, 0) /
        assigneeTasks.length,
    };
  });

  return (
    <ReportWrapper
      title="Thời gian thực hiện công việc"
      description="Phân tích thời gian ước lượng vs thực tế và hiệu suất thực hiện"
      actions={
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Bộ lọc</InputLabel>
          <Select
            value={filter}
            label="Bộ lọc"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="overrun">Vượt ước lượng</MenuItem>
            <MenuItem value="ontime">Đúng/Dưới ước lượng</MenuItem>
            <MenuItem value="completed">Đã hoàn thành</MenuItem>
          </Select>
        </FormControl>
      }
    >
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #3b82f620, #3b82f610)",
              border: "1px solid #3b82f630",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#3b82f6", mb: 1 }}
              >
                {summaryStats.totalTasks}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Tổng số công việc
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #10b98120, #10b98110)",
              border: "1px solid #10b98130",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#10b981", mb: 1 }}
              >
                {summaryStats.accuracyRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Độ chính xác ước lượng
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #f59e0b20, #f59e0b10)",
              border: "1px solid #f59e0b30",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#f59e0b", mb: 1 }}
              >
                {summaryStats.avgEstimated.toFixed(1)}h
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Thời gian ước lượng TB
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #ef444420, #ef444410)",
              border: "1px solid #ef444430",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#ef4444", mb: 1 }}
              >
                {summaryStats.overrunTasks}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Vượt ước lượng
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Estimated vs Actual Comparison */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: 450,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 3, color: "#1e293b" }}
            >
              So sánh thời gian ước lượng vs thực tế
            </Typography>

            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="estimated"
                  fill="#3b82f6"
                  name="Ước lượng (h)"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="actual"
                  fill="#10b981"
                  name="Thực tế (h)"
                  radius={[2, 2, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="variance"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Chênh lệch (h)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Team Efficiency */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: 450,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 3, color: "#1e293b" }}
            >
              Hiệu suất theo thành viên
            </Typography>

            <Box sx={{ maxHeight: 350, overflowY: "auto" }}>
              {efficiencyData.map((member, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid #f1f5f9",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "#1e293b" }}
                    >
                      {member.assignee}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${member.efficiency.toFixed(0)}%`}
                      sx={{
                        backgroundColor:
                          member.efficiency >= 90
                            ? "#10b98120"
                            : member.efficiency >= 70
                            ? "#f59e0b20"
                            : "#ef444420",
                        color:
                          member.efficiency >= 90
                            ? "#10b981"
                            : member.efficiency >= 70
                            ? "#f59e0b"
                            : "#ef4444",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", display: "block", mb: 1 }}
                  >
                    {member.tasksCount} công việc • Chênh lệch TB:{" "}
                    {member.avgVariance.toFixed(1)}h
                  </Typography>

                  <Box
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "#f1f5f9",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${Math.min(member.efficiency, 100)}%`,
                        backgroundColor:
                          member.efficiency >= 90
                            ? "#10b981"
                            : member.efficiency >= 70
                            ? "#f59e0b"
                            : "#ef4444",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Scatter Plot - Estimation Accuracy */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: 400,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 3, color: "#1e293b" }}
            >
              Độ chính xác ước lượng
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Ước lượng"
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Thực tế"
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => [
                    `${value}h`,
                    name === "x" ? "Ước lượng" : "Thực tế",
                  ]}
                />
                <Scatter data={scatterData} fill="#3b82f6" fillOpacity={0.6} />
                {/* Perfect estimation line */}
                <Line
                  type="monotone"
                  dataKey="x"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Project Summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: 400,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 3, color: "#1e293b" }}
            >
              Tóm tắt theo dự án
            </Typography>

            <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
              {projectSummary.map((project, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${
                      index === 0
                        ? "#3b82f6"
                        : index === 1
                        ? "#10b981"
                        : "#f59e0b"
                    }10, ${
                      index === 0
                        ? "#3b82f6"
                        : index === 1
                        ? "#10b981"
                        : "#f59e0b"
                    }05)`,
                    border: `1px solid ${
                      index === 0
                        ? "#3b82f6"
                        : index === 1
                        ? "#10b981"
                        : "#f59e0b"
                    }30`,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}
                  >
                    {project.projectName}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", display: "block" }}
                      >
                        Số công việc
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {project.totalTasks}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", display: "block" }}
                      >
                        Hiệu suất
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color:
                            project.efficiency >= 90
                              ? "#10b981"
                              : project.efficiency >= 70
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      >
                        {project.efficiency.toFixed(1)}%
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", display: "block" }}
                      >
                        TB Ước lượng
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {project.avgEstimatedHours.toFixed(1)}h
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", display: "block" }}
                      >
                        TB Thực tế
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {project.avgActualHours.toFixed(1)}h
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", display: "block", mb: 0.5 }}
                    >
                      Giao hàng đúng hạn: {project.onTimeDelivery.toFixed(1)}%
                    </Typography>
                    <Box
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: "#f1f5f9",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${project.onTimeDelivery}%`,
                          backgroundColor:
                            project.onTimeDelivery >= 80
                              ? "#10b981"
                              : project.onTimeDelivery >= 60
                              ? "#f59e0b"
                              : "#ef4444",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Insights */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, color: "#1e293b" }}
        >
          Nhận xét & Khuyến nghị
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                borderRadius: 3,
                border: "1px solid #bfdbfe",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#1e40af", mb: 1 }}
              >
                📊 Độ chính xác ước lượng
              </Typography>
              <Typography variant="body2" sx={{ color: "#374151" }}>
                Độ chính xác hiện tại là {summaryStats.accuracyRate.toFixed(1)}
                %.
                {summaryStats.accuracyRate >= 80
                  ? " Rất tốt!"
                  : summaryStats.accuracyRate >= 60
                  ? " Cần cải thiện quy trình ước lượng."
                  : " Cần đào tạo và cải thiện kỹ năng ước lượng."}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                borderRadius: 3,
                border: "1px solid #bbf7d0",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#166534", mb: 1 }}
              >
                ⏱️ Thời gian thực hiện
              </Typography>
              <Typography variant="body2" sx={{ color: "#374151" }}>
                Thời gian thực hiện trung bình là{" "}
                {summaryStats.avgActual.toFixed(1)}h,
                {summaryStats.avgActual > summaryStats.avgEstimated
                  ? ` cao hơn ước lượng ${(
                      summaryStats.avgActual - summaryStats.avgEstimated
                    ).toFixed(1)}h.`
                  : ` thấp hơn ước lượng ${(
                      summaryStats.avgEstimated - summaryStats.avgActual
                    ).toFixed(1)}h.`}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
                borderRadius: 3,
                border: "1px solid #fde68a",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#92400e", mb: 1 }}
              >
                🎯 Khuyến nghị
              </Typography>
              <Typography variant="body2" sx={{ color: "#374151" }}>
                {summaryStats.overrunTasks > summaryStats.totalTasks / 2
                  ? "Nhiều task vượt ước lượng. Cần xem xét lại quy trình và đào tạo team."
                  : "Hiệu suất ước lượng tốt. Tiếp tục duy trì và chia sẻ best practices."}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ReportWrapper>
  );
}
