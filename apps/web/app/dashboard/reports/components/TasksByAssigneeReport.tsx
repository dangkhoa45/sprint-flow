"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ReportWrapper from "./common/ReportWrapper";

interface UserStats {
  _id: string;
  displayName: string;
  username: string;
  avatar?: string;
  role: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  workload: "light" | "moderate" | "heavy" | "overloaded";
}

// Mock user data
const mockUserStats: UserStats[] = [
  {
    _id: "user1",
    displayName: "Nguyễn Văn A",
    username: "nguyenvana",
    avatar: "",
    role: "Senior Developer",
    totalTasks: 28,
    completedTasks: 22,
    inProgressTasks: 4,
    todoTasks: 2,
    overdueTasks: 1,
    completionRate: 78.6,
    averageCompletionTime: 3.2,
    workload: "heavy",
  },
  {
    _id: "user2",
    displayName: "Trần Thị B",
    username: "tranthib",
    avatar: "",
    role: "Project Manager",
    totalTasks: 15,
    completedTasks: 13,
    inProgressTasks: 2,
    todoTasks: 0,
    overdueTasks: 0,
    completionRate: 86.7,
    averageCompletionTime: 2.8,
    workload: "moderate",
  },
  {
    _id: "user3",
    displayName: "Lê Văn C",
    username: "levanc",
    avatar: "",
    role: "Backend Developer",
    totalTasks: 32,
    completedTasks: 25,
    inProgressTasks: 5,
    todoTasks: 2,
    overdueTasks: 2,
    completionRate: 78.1,
    averageCompletionTime: 4.1,
    workload: "overloaded",
  },
  {
    _id: "user4",
    displayName: "Phạm Thị D",
    username: "phamthid",
    avatar: "",
    role: "Frontend Developer",
    totalTasks: 18,
    completedTasks: 16,
    inProgressTasks: 1,
    todoTasks: 1,
    overdueTasks: 0,
    completionRate: 88.9,
    averageCompletionTime: 2.5,
    workload: "moderate",
  },
  {
    _id: "user5",
    displayName: "Hoàng Văn E",
    username: "hoangvane",
    avatar: "",
    role: "QA Engineer",
    totalTasks: 12,
    completedTasks: 10,
    inProgressTasks: 2,
    todoTasks: 0,
    overdueTasks: 0,
    completionRate: 83.3,
    averageCompletionTime: 1.8,
    workload: "light",
  },
  {
    _id: "user6",
    displayName: "Đỗ Thị F",
    username: "dothif",
    avatar: "",
    role: "UI/UX Designer",
    totalTasks: 14,
    completedTasks: 11,
    inProgressTasks: 2,
    todoTasks: 1,
    overdueTasks: 1,
    completionRate: 78.6,
    averageCompletionTime: 3.5,
    workload: "moderate",
  },
];

const workloadColors = {
  light: "#10b981",
  moderate: "#3b82f6",
  heavy: "#f59e0b",
  overloaded: "#ef4444",
};

const workloadLabels = {
  light: "Nhẹ",
  moderate: "Vừa phải",
  heavy: "Nặng",
  overloaded: "Quá tải",
};

export default function TasksByAssigneeReport() {
  const [userStats] = useState<UserStats[]>(mockUserStats);

  const sortedUsers = [...userStats].sort((a, b) => {
    return b.totalTasks - a.totalTasks;
  });

  const chartData = userStats.map(user => ({
    name: user.displayName.split(" ").slice(-1)[0], // Last name only for chart
    totalTasks: user.totalTasks,
    completed: user.completedTasks,
    inProgress: user.inProgressTasks,
    todo: user.todoTasks,
    completionRate: user.completionRate,
  }));

  const workloadDistribution = Object.entries(
    userStats.reduce((acc, user) => {
      acc[user.workload] = (acc[user.workload] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([workload, count]) => ({
    name: workloadLabels[workload as keyof typeof workloadLabels],
    value: count,
    color: workloadColors[workload as keyof typeof workloadColors],
  }));

  const getTotalStats = () => {
    const totalTasks = userStats.reduce((sum, user) => sum + user.totalTasks, 0);
    const totalCompleted = userStats.reduce((sum, user) => sum + user.completedTasks, 0);
    const totalInProgress = userStats.reduce((sum, user) => sum + user.inProgressTasks, 0);
    const totalOverdue = userStats.reduce((sum, user) => sum + (user.overdueTasks || 0), 0);
    
    return {
      totalTasks,
      totalCompleted,
      totalInProgress,
      totalOverdue,
      averageCompletionRate: totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0,
    };
  };

  const totalStats = getTotalStats();

  return (
    <ReportWrapper
      title="Số lượng công việc theo người thực hiện"
      description="Phân tích phân bổ công việc và hiệu suất làm việc của từng thành viên"
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
                {totalStats.totalTasks}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Tổng công việc
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
                {totalStats.totalCompleted}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Đã hoàn thành
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
                {totalStats.totalInProgress}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Đang thực hiện
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #8b5cf620, #8b5cf610)",
              border: "1px solid #8b5cf630",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#8b5cf6", mb: 1 }}
              >
                {totalStats.averageCompletionRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Tỷ lệ hoàn thành TB
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* User Performance List */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 3, borderBottom: "1px solid #e2e8f0" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1e293b" }}
              >
                Hiệu suất làm việc của từng thành viên
              </Typography>
            </Box>
            
            <Box sx={{ maxHeight: 600, overflowY: "auto" }}>
              {sortedUsers.map((user, index) => (
                <Box
                  key={user._id}
                  sx={{
                    p: 3,
                    borderBottom: index < sortedUsers.length - 1 ? "1px solid #f1f5f9" : "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "#f8fafc",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        bgcolor: `hsl(${(user.displayName.charCodeAt(0) * 137.5) % 360}, 70%, 50%)`,
                        fontSize: "1.2rem",
                        fontWeight: 600,
                      }}
                    >
                      {user.displayName.charAt(0)}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {user.displayName}
                        </Typography>
                        <Chip
                          size="small"
                          label={workloadLabels[user.workload]}
                          sx={{
                            backgroundColor: `${workloadColors[user.workload]}20`,
                            color: workloadColors[user.workload],
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b" }}
                        >
                          {user.role}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 1 }}>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Tổng: <strong>{user.totalTasks}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#10b981" }}>
                          Hoàn thành: <strong>{user.completedTasks}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#f59e0b" }}>
                          Đang làm: <strong>{user.inProgressTasks}</strong>
                        </Typography>
                        {user.overdueTasks > 0 && (
                          <Typography variant="body2" sx={{ color: "#ef4444" }}>
                            Quá hạn: <strong>{user.overdueTasks}</strong>
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ textAlign: "right", minWidth: 80 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: user.completionRate >= 80 ? "#10b981" : user.completionRate >= 60 ? "#f59e0b" : "#ef4444",
                          mb: 0.5,
                        }}
                      >
                        {user.completionRate.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Hoàn thành
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Progress bar */}
                  <Box sx={{ mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={user.completionRate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: user.completionRate >= 80 ? "#10b981" : user.completionRate >= 60 ? "#f59e0b" : "#ef4444",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Thời gian hoàn thành trung bình: {user.averageCompletionTime} ngày
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Grid container spacing={3}>
            {/* Workload Distribution */}
            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  height: 300,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: "#1e293b" }}
                >
                  Phân bổ mức độ công việc
                </Typography>
                
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={workloadDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {workloadDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <Box sx={{ mt: 1 }}>
                  {workloadDistribution.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            backgroundColor: item.color,
                            borderRadius: "50%",
                            mr: 1,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          {item.name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Task Distribution Chart */}
        <Grid size={{ xs: 12 }}>
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
              Phân bổ công việc theo từng thành viên
            </Typography>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  fontSize={12}
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
                  dataKey="completed" 
                  stackId="a"
                  fill="#10b981" 
                  name="Hoàn thành"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="inProgress" 
                  stackId="a"
                  fill="#f59e0b" 
                  name="Đang thực hiện"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="todo" 
                  stackId="a"
                  fill="#6b7280" 
                  name="Chưa bắt đầu"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </ReportWrapper>
  );
}
