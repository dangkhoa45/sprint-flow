"use client";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import { useProjectStats } from "../../../../hooks/useProjects";

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  isLoading 
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  isLoading?: boolean;
}) => (
  <Card
    sx={{
      height: "100%",
      borderRadius: 3,
      border: theme => `1px solid ${theme.palette.divider}`,
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: theme => theme.shadows[8],
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
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: `${color}15`,
            color: color,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          {isLoading ? (
            <Skeleton width={60} height={32} />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
              {value}
            </Typography>
          )}
        </Box>
      </Box>
      {trend && (
        <Chip
          label={trend}
          size="small"
          sx={{
            backgroundColor: `${color}10`,
            color: color,
            fontWeight: 600,
            "& .MuiChip-label": {
              px: 1,
            },
          }}
        />
      )}
    </CardContent>
  </Card>
);

export default function ProjectsStats() {
  const { stats, isLoading } = useProjectStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
      trend: `${stats?.total ? Math.round(((stats.inProgress || 0) / stats.total) * 100) : 0}%`,
    },
    {
      title: "Hoàn thành",
      value: stats?.completed || 0,
      icon: <CheckCircleIcon />,
      color: "#4caf50",
      trend: `${stats?.total ? Math.round(((stats.completed || 0) / stats.total) * 100) : 0}%`,
    },
    {
      title: "Quá hạn",
      value: stats?.overdue || 0,
      icon: <WarningIcon />,
      color: "#ff9800",
    },
    {
      title: "Ngân sách",
      value: stats?.totalBudget ? formatCurrency(stats.totalBudget) : "0₫",
      icon: <AttachMoneyIcon />,
      color: "#9c27b0",
    },
    {
      title: "Tiến độ TB",
      value: stats?.averageProgress ? `${Math.round(stats.averageProgress)}%` : "0%",
      icon: <TrendingUpIcon />,
      color: "#00acc1",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {statsData.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index}>
          <StatsCard {...stat} isLoading={isLoading} />
        </Grid>
      ))}
    </Grid>
  );
}
