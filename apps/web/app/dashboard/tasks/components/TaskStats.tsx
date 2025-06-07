"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

// Mock data - sẽ thay thế bằng API call
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
    <Card
      sx={{
        mb: 4,
        background: "linear-gradient(135deg, #ffffff 0%, #fafbff 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #ef4444)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "#1e293b",
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
                  backgroundColor: "#e2e8f0",
                  overflow: "hidden",
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(90deg, #3b82f6, #10b981)",
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
                background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                color: "#16a34a",
                fontWeight: 600,
                border: "1px solid #a7f3d0",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 8px rgba(34, 197, 94, 0.2)",
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
                  background: `linear-gradient(135deg, ${stat.bgColor}, ${stat.bgColor}dd)`,
                  border: `1px solid ${stat.color}20`,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: stat.gradient,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: `0 12px 24px ${stat.color}25, 0 6px 12px ${stat.color}15`,
                    border: `1px solid ${stat.color}40`,
                    "&::before": {
                      opacity: 0.05,
                    },
                    "& .stat-icon": {
                      transform: "scale(1.1) rotate(5deg)",
                      background: stat.gradient,
                      color: "white",
                    },
                    "& .stat-value": {
                      color: stat.color,
                      textShadow: `0 2px 4px ${stat.color}20`,
                    },
                  },
                }}
              >
                <Box
                  className="stat-icon"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "white",
                    color: stat.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${stat.color}20`,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      borderRadius: 2,
                      background: stat.gradient,
                      opacity: 0.1,
                    },
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
                      color: stat.color,
                      lineHeight: 1,
                      background: stat.gradient,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.825rem",
                      fontWeight: 500,
                      mt: 0.5,
                      opacity: 0.8,
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
