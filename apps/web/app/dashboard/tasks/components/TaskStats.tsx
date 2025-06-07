"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

const mockStats = {
  total: 156,
  todo: 45,
  inProgress: 28,
  inReview: 12,
  done: 63,
  blocked: 8,
  progress: 67.3,
};

export default function TaskStats() {
  const stats = [
    {
      title: "Tổng số",
      value: mockStats.total,
      icon: <AssignmentIcon sx={{ fontSize: 28 }} />,
      color: "#64748b",
      bgColor: "#f1f5f9",
      gradient: "linear-gradient(135deg, #64748b, #475569)",
    },
    {
      title: "Chưa bắt đầu",
      value: mockStats.todo,
      icon: <HourglassEmptyIcon sx={{ fontSize: 28 }} />,
      color: "#6b7280",
      bgColor: "#f9fafb",
      gradient: "linear-gradient(135deg, #6b7280, #4b5563)",
    },
    {
      title: "Đang thực hiện",
      value: mockStats.inProgress,
      icon: <PlayArrowIcon sx={{ fontSize: 28 }} />,
      color: "#2563eb",
      bgColor: "#dbeafe",
      gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    },
    {
      title: "Đã hoàn thành",
      value: mockStats.done,
      icon: <CheckCircleIcon sx={{ fontSize: 28 }} />,
      color: "#059669",
      bgColor: "#d1fae5",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
    },
    {
      title: "Bị chặn",
      value: mockStats.blocked,
      icon: <BlockIcon sx={{ fontSize: 28 }} />,
      color: "#dc2626",
      bgColor: "#fee2e2",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 4,
        p: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 1,
          }}
        >
          Tổng quan tiến độ
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={mockStats.progress}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                overflow: "hidden",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #10b981, #059669)",
                  borderRadius: 5,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                    animation: "shimmer 2s infinite",
                  },
                },
                "@keyframes shimmer": {
                  "0%": { transform: "translateX(-100%)" },
                  "100%": { transform: "translateX(100%)" },
                },
              }}
            />
          </Box>
          <Chip
            label={`${mockStats.progress}% hoàn thành`}
            size="small"
            sx={{
              background: "rgba(16, 185, 129, 0.2)",
              backdropFilter: "blur(10px)",
              color: "white",
              fontWeight: 600,
              border: "1px solid rgba(16, 185, 129, 0.3)",
              boxShadow: "0 4px 16px rgba(16, 185, 129, 0.2)",
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.02)",
                  background: "rgba(255, 255, 255, 0.15)",
                  boxShadow: `0 12px 32px ${stat.color}25, 0 6px 16px ${stat.color}15`,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "& .stat-icon": {
                    transform: "scale(1.1) rotate(5deg)",
                    background: stat.gradient,
                    color: "white",
                  },
                  "& .stat-value": {
                    textShadow: `0 2px 8px ${stat.color}40`,
                  },
                },
              }}
            >
              <Box
                className="stat-icon"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 16px ${stat.color}20`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: `1px solid ${stat.color}30`,
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  component="div"
                  className="stat-value"
                  sx={{
                    fontWeight: 800,
                    color: "white",
                    lineHeight: 1,
                    transition: "all 0.3s ease",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.825rem",
                    fontWeight: 500,
                    mt: 0.5,
                  }}
                >
                  {stat.title}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
