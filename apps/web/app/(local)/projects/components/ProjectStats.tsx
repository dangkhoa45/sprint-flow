"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useProjectStats } from "@/hooks/useProjects";

const ProjectStats = () => {
  const theme = useTheme();
  const { stats, isLoading, error } = useProjectStats();

  // Map dữ liệu API vào UI
  const statCards = [
    {
      label: "Tổng số dự án",
      value: stats?.total ?? 0,
      icon: AssignmentIcon,
      color: "#6366f1",
    },
    {
      label: "Đang thực hiện",
      value: stats?.inProgress ?? 0,
      icon: TrendingUpIcon,
      color: "#10b981",
    },
    {
      label: "Đã hoàn thành",
      value: stats?.completed ?? 0,
      icon: CheckCircleIcon,
      color: "#3b82f6",
    },
    {
      label: "Tạm dừng",
      value: stats?.onHold ?? 0,
      icon: PauseCircleIcon,
      color: "#f59e0b",
    },
    {
      label: "Đã hủy",
      value: stats?.cancelled ?? 0,
      icon: CancelIcon,
      color: "#ef4444",
    },
  ];

  if (isLoading) return <div>Đang tải thống kê...</div>;
  if (error) return <div>Lỗi tải thống kê dự án!</div>;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 2,
      }}
    >
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={index}
            sx={{
              p: 2.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: stat.color,
                transform: "translateY(-2px)",
                boxShadow: `0 8px 25px ${stat.color}15`,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: `${stat.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconComponent sx={{ fontSize: 20, color: stat.color }} />
              </Box>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              {stat.label}
            </Typography>
          </Card>
        );
      })}
    </Box>
  );
};

export default ProjectStats;
