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
      icon: <AssignmentIcon sx={{ fontSize: 24 }} />,
      color: "#64748b",
      bgColor: "#f1f5f9",
    },
    {
      title: "Chưa bắt đầu",
      value: mockStats.todo,
      icon: <HourglassEmptyIcon sx={{ fontSize: 24 }} />,
      color: "#6b7280",
      bgColor: "#f9fafb",
    },
    {
      title: "Đang thực hiện",
      value: mockStats.inProgress,
      icon: <PlayArrowIcon sx={{ fontSize: 24 }} />,
      color: "#2563eb",
      bgColor: "#dbeafe",
    },
    {
      title: "Đã hoàn thành",
      value: mockStats.done,
      icon: <CheckCircleIcon sx={{ fontSize: 24 }} />,
      color: "#059669",
      bgColor: "#d1fae5",
    },
    {
      title: "Bị chặn",
      value: mockStats.blocked,
      icon: <BlockIcon sx={{ fontSize: 24 }} />,
      color: "#dc2626",
      bgColor: "#fee2e2",
    },
  ];

  return (
    <Card
      sx={{
        mb: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: 2,
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
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e2e8f0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#10b981",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
            <Chip
              label={`${mockStats.progress}% hoàn thành`}
              size="small"
              sx={{
                backgroundColor: "#dcfce7",
                color: "#16a34a",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: stat.bgColor,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1.5,
                    backgroundColor: "white",
                    color: stat.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: stat.color,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.875rem",
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
      </CardContent>
    </Card>
  );
}
