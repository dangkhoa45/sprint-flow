"use client";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import TaskIcon from "@mui/icons-material/Task";
import TodayIcon from "@mui/icons-material/Today";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WeekIcon from "@mui/icons-material/DateRange";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { type TimelineStats } from "../../../../types/timeline";

interface TimelineStatsProps {
  stats: TimelineStats;
}

const statItems = [
  {
    title: "Tổng sự kiện",
    key: "total" as keyof TimelineStats,
    icon: <EventIcon />,
    color: "#2196f3",
    bgColor: "rgba(33, 150, 243, 0.1)",
  },
  {
    title: "Hôm nay",
    key: "today" as keyof TimelineStats,
    icon: <TodayIcon />,
    color: "#ff9800",
    bgColor: "rgba(255, 152, 0, 0.1)",
  },
  {
    title: "Tuần này",
    key: "thisWeek" as keyof TimelineStats,
    icon: <WeekIcon />,
    color: "#4caf50",
    bgColor: "rgba(76, 175, 80, 0.1)",
  },
  {
    title: "Tháng này",
    key: "thisMonth" as keyof TimelineStats,
    icon: <TrendingUpIcon />,
    color: "#8bc34a",
    bgColor: "rgba(139, 195, 74, 0.1)",
  },
  {
    title: "Sự kiện dự án",
    key: "projectEvents" as keyof TimelineStats,
    icon: <AssignmentIcon />,
    color: "#9c27b0",
    bgColor: "rgba(156, 39, 176, 0.1)",
  },
  {
    title: "Sự kiện task",
    key: "taskEvents" as keyof TimelineStats,
    icon: <TaskIcon />,
    color: "#f44336",
    bgColor: "rgba(244, 67, 54, 0.1)",
  },
];

export default function TimelineStats({ stats }: TimelineStatsProps) {
  const todayRate = stats.total > 0 ? (stats.today / stats.total) * 100 : 0;
  const weekRate = stats.total > 0 ? (stats.thisWeek / stats.total) * 100 : 0;

  return (
    <Box sx={{ mb: 3, width: "100%" }}>
      <Grid container spacing={3}>
        {statItems.map((item, index) => {
          const value = stats[item.key];
          const percentage = stats.total > 0 ? (value / stats.total) * 100 : 0;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 3,
                  p: 3,
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
                    background: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                {/* Background gradient */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 60,
                    height: 60,
                    background: `linear-gradient(135deg, ${item.color}20, ${item.color}40)`,
                    borderRadius: "0 12px 0 60px",
                  }}
                />

                {/* Icon */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: item.bgColor,
                    color: item.color,
                    mb: 2,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {item.icon}
                </Box>

                {/* Value */}
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    mb: 0.5,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {value.toLocaleString()}
                </Typography>

                {/* Label */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    mb: 2,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {item.title}
                </Typography>

                {/* Progress bar */}
                {stats.total > 0 && (
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        Tỷ lệ
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}
                      >
                        {percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 3,
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                        },
                      }}
                    />
                  </Box>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
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
            <Typography
              variant="h6"
              sx={{ color: "white", mb: 2, fontWeight: 600 }}
            >
              Hoạt động gần đây
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Hôm nay
              </Typography>
              <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                {stats.today} sự kiện
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={todayRate}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                mb: 2,
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: "linear-gradient(90deg, #ff9800, #ff980080)",
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Tuần này
              </Typography>
              <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                {stats.thisWeek} sự kiện
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={weekRate}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: "linear-gradient(90deg, #4caf50, #4caf5080)",
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
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
            <Typography
              variant="h6"
              sx={{ color: "white", mb: 2, fontWeight: 600 }}
            >
              Phân loại sự kiện
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Dự án
              </Typography>
              <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                {stats.projectEvents} sự kiện
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stats.total > 0 ? (stats.projectEvents / stats.total) * 100 : 0}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                mb: 2,
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: "linear-gradient(90deg, #9c27b0, #9c27b080)",
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Task
              </Typography>
              <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                {stats.taskEvents} sự kiện
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stats.total > 0 ? (stats.taskEvents / stats.total) * 100 : 0}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: "linear-gradient(90deg, #f44336, #f4433680)",
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
