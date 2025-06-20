"use client";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GroupIcon from "@mui/icons-material/Group";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const DashboardOverview = () => {
  const theme = useTheme();
  const { user } = useCurrentUser();

  const stats = [
    {
      label: "Dự án đang hoạt động",
      value: "12",
      change: "+2",
      trend: "up",
      icon: TrendingUpIcon,
      color: "#6366f1",
    },
    {
      label: "Công việc hết hạn hôm nay",
      value: "8",
      change: "-3",
      trend: "down",
      icon: AccessTimeIcon,
      color: "#f59e0b",
    },
    {
      label: "Hoàn thành tuần này",
      value: "24",
      change: "+12",
      trend: "up",
      icon: CheckCircleIcon,
      color: "#10b981",
    },
    {
      label: "Thành viên nhóm",
      value: "16",
      change: "+1",
      trend: "up",
      icon: GroupIcon,
      color: "#8b5cf6",
    },
  ];

  const recentProjects = [
    {
      name: "Nền tảng Thương mại điện tử",
      progress: 85,
      dueDate: "25 Th12",
      status: "Đúng tiến độ",
      team: [
        { name: "Alice", avatar: "/avatars/alice.jpg" },
        { name: "Bob", avatar: "/avatars/bob.jpg" },
        { name: "Carol", avatar: "/avatars/carol.jpg" },
      ],
    },
    {
      name: "Thiết kế lại Ứng dụng di động",
      progress: 60,
      dueDate: "15 Th01",
      status: "Có rủi ro",
      team: [
        { name: "David", avatar: "/avatars/david.jpg" },
        { name: "Eve", avatar: "/avatars/eve.jpg" },
      ],
    },
    {
      name: "Tích hợp API",
      progress: 95,
      dueDate: "20 Th12",
      status: "Vượt tiến độ",
      team: [
        { name: "Frank", avatar: "/avatars/frank.jpg" },
        { name: "Grace", avatar: "/avatars/grace.jpg" },
        { name: "Henry", avatar: "/avatars/henry.jpg" },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đúng tiến độ":
        return "#10b981";
      case "Có rủi ro":
        return "#f59e0b";
      case "Vượt tiến độ":
        return "#6366f1";
      default:
        return "#64748b";
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Chào mừng trở lại, {user?.displayName?.split(" ")[0] || "Bạn"}! 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đây là những gì đang diễn ra với dự án của bạn hôm nay
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              px: 2.5,
            }}
          >
            Dự án mới
          </Button>
        </Box>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                  mb: 2,
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
                  <NorthEastIcon
                    sx={{
                      fontSize: 12,
                      transform:
                        stat.trend === "down" ? "rotate(90deg)" : "none",
                    }}
                  />
                  {stat.change}
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.875rem" }}
              >
                {stat.label}
              </Typography>
            </Card>
          );
        })}
      </Box>

      <Card
        sx={{
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Dự án gần đây
          </Typography>
          <Button
            variant="text"
            size="small"
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Xem tất cả
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {recentProjects.map((project, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1.5,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  transform: "translateX(4px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 0.5 }}
                  >
                    {project.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        backgroundColor: `${getStatusColor(project.status)}15`,
                        color: getStatusColor(project.status),
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      {project.status}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      <CalendarTodayIcon sx={{ fontSize: 12 }} />
                      <Typography variant="caption">
                        Due {project.dueDate}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{
                        flex: 1,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: theme.palette.divider,
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 3,
                          backgroundColor: getStatusColor(project.status),
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ minWidth: 40 }}>
                      {project.progress}%
                    </Typography>
                  </Box>
                </Box>
                <AvatarGroup
                  max={3}
                  sx={{
                    "& .MuiAvatar-root": {
                      width: 28,
                      height: 28,
                      fontSize: "0.75rem",
                      border: `2px solid ${theme.palette.background.paper}`,
                    },
                  }}
                >
                  {project.team.map((member, idx) => (
                    <Avatar key={idx} alt={member.name} src={member.avatar}>
                      {member.name.charAt(0)}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
};

export default DashboardOverview;
