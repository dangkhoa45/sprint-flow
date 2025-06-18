"use client";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useProjectStats } from "../../../../hooks/useProjects";
import { useThemeMode } from "../../../../provider/ThemeContext";

const StatsCard = ({
  title,
  value,
  icon,
  color,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}) => {
  const theme = useTheme();
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === "dark";

  return (
    <Card
      sx={{
        height: "110px",
        width: "100%",
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: isDark
          ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(255, 255, 255, 0.02) 100%)`
          : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(0, 0, 0, 0.02) 100%)`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isDark
            ? `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px ${color}20`
            : `0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px ${color}20`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 3,
              backgroundColor: `${color}15`,
              color: color,
              mr: 2,
              transition: "all 0.3s ease",
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.secondary,
                mb: 0.5,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
            >
              {title}
            </Typography>
            {isLoading ? (
              <Skeleton width={80} height={36} />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  lineHeight: 1,
                }}
              >
                {value}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function ProjectsStats() {
  const { stats, isLoading } = useProjectStats();

  const statsData = [
    {
      title: "Tổng dự án",
      value: stats?.total || 0,
      icon: <AssignmentIcon />,
      color: "#1976d2",
    },
    {
      title: "Đang thực hiện",
      value: stats?.inProgress || 0,
      icon: <TrendingUpIcon />,
      color: "#2196f3",
    },
    {
      title: "Hoàn thành",
      value: stats?.completed || 0,
      icon: <CheckCircleIcon />,
      color: "#4caf50",
    },
    {
      title: "Quá hạn",
      value: stats?.overdue || 0,
      icon: <WarningIcon />,
      color: "#ff9800",
    },
    {
      title: "Tiến độ TB",
      value: stats?.averageProgress
        ? `${Math.round(stats.averageProgress)}%`
        : "0%",
      icon: <TrendingUpIcon />,
      color: "#00acc1",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {statsData.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index}>
          <StatsCard {...stat} isLoading={isLoading} />
        </Grid>
      ))}
    </Grid>
  );
}
