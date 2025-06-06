"use client";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { UserStats } from "../../../../types/user";

interface UsersStatsProps {
  stats: UserStats;
}

export default function UsersStats({ stats }: UsersStatsProps) {
  const getStatusPercentage = (count: number) => {
    return stats.total > 0 ? (count / stats.total) * 100 : 0;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 4,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: 600,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PeopleIcon />
          Thống kê người dùng
        </Typography>

        <Grid container spacing={3}>
          {/* Tổng số người dùng */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <AccountCircleIcon
                sx={{
                  fontSize: 40,
                  color: "#42a5f5",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {stats.total}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                Tổng người dùng
              </Typography>
            </Box>
          </Grid>

          {/* Người dùng hoạt động */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <PersonIcon
                sx={{
                  fontSize: 40,
                  color: "#4caf50",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {stats.active}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 1,
                }}
              >
                Đang hoạt động
              </Typography>
              <LinearProgress
                variant="determinate"
                value={getStatusPercentage(stats.active)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#4caf50",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Người dùng chờ duyệt */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <PersonIcon
                sx={{
                  fontSize: 40,
                  color: "#ff9800",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {stats.pending}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 1,
                }}
              >
                Chờ duyệt
              </Typography>
              <LinearProgress
                variant="determinate"
                value={getStatusPercentage(stats.pending)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#ff9800",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Quản trị viên */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <AdminPanelSettingsIcon
                sx={{
                  fontSize: 40,
                  color: "#9c27b0",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {stats.admins}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 1,
                }}
              >
                Quản trị viên
              </Typography>
              <LinearProgress
                variant="determinate"
                value={getStatusPercentage(stats.admins)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#9c27b0",
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
