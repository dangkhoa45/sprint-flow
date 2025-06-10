"use client";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Import common components and utilities
import SummaryCard from "./common/SummaryCard";
import ChartContainer from "./common/ChartContainer";
import ReportWrapper from "./common/ReportWrapper";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { TimeSeriesData } from "../types/report.types";
import { 
  generateTimeSeriesData, 
  calculateSummaryStats, 
  generateTrendData 
} from "../utils/mockData.utils";
import { 
  CHART_COLORS, 
  CHART_TOOLTIP_STYLE 
} from "../constants/report.constants";

export default function TasksByTimeReport() {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [summaryStats, setSummaryStats] = useState({
    totalCreated: 0,
    totalCompleted: 0,
    totalInProgress: 0,
    totalTodo: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const mockData = generateTimeSeriesData({ timeRange });
    setData(mockData);
    
    const stats = calculateSummaryStats(mockData);
    setSummaryStats(stats);
  }, [timeRange]);

  const pieData = [
    {
      name: "Hoàn thành",
      value: summaryStats.totalCompleted,
      color: CHART_COLORS.success,
    },
    {
      name: "Đang thực hiện",
      value: summaryStats.totalInProgress,
      color: CHART_COLORS.warning,
    },
    {
      name: "Chưa bắt đầu",
      value: summaryStats.totalTodo,
      color: CHART_COLORS.danger,
    },
  ].filter((item) => item.value > 0);

  const trendData = generateTrendData(data);

  const timeRangeLabel = {
    daily: "ngày",
    weekly: "tuần", 
    monthly: "tháng"
  }[timeRange];

  return (
    <ReportWrapper
      title="Số lượng công việc theo thời gian"
      description="Phân tích xu hướng tạo và hoàn thành công việc theo timeline"
      actions={
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Khoảng thời gian</InputLabel>
          <Select
            value={timeRange}
            label="Khoảng thời gian"
            onChange={(e) => setTimeRange(e.target.value as "daily" | "weekly" | "monthly")}
          >
            <MenuItem value="daily">Theo ngày</MenuItem>
            <MenuItem value="weekly">Theo tuần</MenuItem>
            <MenuItem value="monthly">Theo tháng</MenuItem>
          </Select>
        </FormControl>
      }
    >
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Tổng số tạo mới"
            value={summaryStats.totalCreated}
            color="primary"
            icon={<CalendarTodayIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Đã hoàn thành"
            value={summaryStats.totalCompleted}
            color="success"
            icon={<TrendingUpIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Đang thực hiện"
            value={summaryStats.totalInProgress}
            color="warning"
            icon={<PlayCircleIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Tỷ lệ hoàn thành"
            value={`${summaryStats.completionRate.toFixed(1)}%`}
            color="purple"
            icon={<AssessmentIcon />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Bar Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <ChartContainer
            title={`Thống kê công việc theo ${timeRangeLabel}`}
            height={400}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend />
                <Bar
                  dataKey="created"
                  fill={CHART_COLORS.primary}
                  name="Tạo mới"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  fill={CHART_COLORS.success}
                  name="Hoàn thành"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="inProgress"
                  fill={CHART_COLORS.warning}
                  name="Đang thực hiện"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>

        {/* Pie Chart */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <ChartContainer
            title="Phân bố trạng thái"
            height={400}
          >
            <ResponsiveContainer width="100%" height="60%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 2 }}>
              {pieData.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.color,
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </ChartContainer>
        </Grid>

        {/* Trend Line Chart */}
        <Grid size={{ xs: 12 }}>
          <ChartContainer
            title="Xu hướng tích lũy công việc hoàn thành"
            height={350}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke={CHART_COLORS.success}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.success, strokeWidth: 2, r: 4 }}
                  name="Tích lũy hoàn thành"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 3 }}
                  name="Hoàn thành trong kỳ"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>
      </Grid>

      {/* Insights */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, color: "#1e293b" }}
        >
          Nhận xét & Xu hướng
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
                📈 Xu hướng tạo mới
              </Typography>
              <Typography variant="body2" sx={{ color: "#374151" }}>
                Số lượng công việc được tạo{" "}
                {summaryStats.totalCreated > 100 ? "tăng mạnh" : "ổn định"}{" "}
                trong khoảng thời gian này
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
                ✅ Hiệu suất hoàn thành
              </Typography>
              <Typography variant="body2" sx={{ color: "#374151" }}>
                Tỷ lệ hoàn thành{" "}
                {summaryStats.completionRate > 70
                  ? "rất tốt"
                  : summaryStats.completionRate > 50
                  ? "khá tốt"
                  : "cần cải thiện"}{" "}
                ({summaryStats.completionRate.toFixed(1)}%)
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
                ⚠️ Công việc đang xử lý
              </Typography>
              <Typography variant="body2" sx={{ color: "#374151" }}>
                Có {summaryStats.totalInProgress} công việc đang trong quá trình
                thực hiện
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ReportWrapper>
  );
}
