"use client";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseIcon from "@mui/icons-material/Pause";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ProjectStats } from "../../../../types/project";

interface ProjectsStatsProps {
  stats: ProjectStats;
}

const statItems = [
  {
    title: "Tổng dự án",
    key: "total" as keyof ProjectStats,
    icon: <AssignmentIcon />,
    color: "#2196f3",
    bgColor: "rgba(33, 150, 243, 0.1)",
  },
  {
    title: "Đang lập kế hoạch",
    key: "planning" as keyof ProjectStats,
    icon: <ScheduleIcon />,
    color: "#ff9800",
    bgColor: "rgba(255, 152, 0, 0.1)",
  },
  {
    title: "Đang thực hiện",
    key: "inProgress" as keyof ProjectStats,
    icon: <TrendingUpIcon />,
    color: "#4caf50",
    bgColor: "rgba(76, 175, 80, 0.1)",
  },
  {
    title: "Hoàn thành",
    key: "completed" as keyof ProjectStats,
    icon: <CheckCircleIcon />,
    color: "#8bc34a",
    bgColor: "rgba(139, 195, 74, 0.1)",
  },
  {
    title: "Tạm dừng",
    key: "onHold" as keyof ProjectStats,
    icon: <PauseIcon />,
    color: "#9e9e9e",
    bgColor: "rgba(158, 158, 158, 0.1)",
  },
  {
    title: "Đã hủy",
    key: "cancelled" as keyof ProjectStats,
    icon: <CancelIcon />,
    color: "#f44336",
    bgColor: "rgba(244, 67, 54, 0.1)",
  },
];

export default function ProjectsStats({ stats }: ProjectsStatsProps) {
  const completionRate =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const activeRate =
    stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0;

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
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${item.color}20 0%, transparent 70%)`,
                    zIndex: 0,
                  }}
                />

                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        background: item.bgColor,
                        borderRadius: 2,
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ color: item.color, fontSize: 24 }}>
                        {item.icon}
                      </Box>
                    </Box>

                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "white",
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontWeight: 500,
                      mb: 2,
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* Progress bar */}
                  <Box sx={{ mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: item.color,
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {percentage.toFixed(1)}% của tổng số
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Summary stats */}
      <Paper
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 3,
          p: 3,
          mt: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: 600,
            mb: 2,
          }}
        >
          Tổng quan hiệu suất
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Tỷ lệ hoàn thành
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  {completionRate.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#4caf50",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Đang hoạt động
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  {activeRate.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={activeRate}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#ff9800",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
