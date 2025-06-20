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

const ProjectStats = () => {
  const theme = useTheme();

  const stats = [
    {
      label: "Tổng số dự án",
      value: "24",
      change: "+3",
      trend: "up",
      icon: AssignmentIcon,
      color: "#6366f1",
    },
    {
      label: "Đang thực hiện",
      value: "12",
      change: "+2",
      trend: "up",
      icon: TrendingUpIcon,
      color: "#10b981",
    },
    {
      label: "Đã hoàn thành",
      value: "8",
      change: "+1",
      trend: "up",
      icon: CheckCircleIcon,
      color: "#3b82f6",
    },
    {
      label: "Tạm dừng",
      value: "3",
      change: "0",
      trend: "neutral",
      icon: PauseCircleIcon,
      color: "#f59e0b",
    },
    {
      label: "Đã hủy",
      value: "1",
      change: "0",
      trend: "neutral",
      icon: CancelIcon,
      color: "#ef4444",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 2,
      }}
    >
      {stats.map((stat, index) => {
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
              {stat.change !== "0" && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: stat.trend === "up" ? "#10b981" : "#ef4444",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {stat.change}
                </Box>
              )}
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
