"use client";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import TimelineIcon from "@mui/icons-material/Timeline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import MenuCard from "./MenuCard";

const menuItems = [
  {
    title: "Quản lý dự án",
    description: "Tạo và quản lý dự án",
    icon: <AccountTreeIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/projects",
    color: "#1976d2",
  },
  {
    title: "Quản lý công việc",
    description: "Tạo, phân công và theo dõi tiến độ công việc",
    icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/tasks",
    color: "#2e7d32",
  },
  {
    title: "Quản lý lịch làm việc",
    description: "Lập lịch và theo dõi lịch làm việc của team",
    icon: <CalendarTodayIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/calendar",
    color: "#ed6c02",
  },
  {
    title: "Quản lý tài liệu",
    description: "Tạo, chỉnh sửa và quản lý tài liệu dự án",
    icon: <DescriptionIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/documents",
    color: "#9c27b0",
  },
  {
    title: "Theo dõi tiến độ",
    description: "Theo dõi tiến độ dự án theo thời gian thực",
    icon: <TimelineIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/timeline",
    color: "#0288d1",
  },
  {
    title: "Phòng chat",
    description: "Trao đổi thông tin và thảo luận với các thành viên",
    icon: <ChatIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/chat",
    color: "#00acc1",
  },
  {
    title: "Báo cáo & Thống kê",
    description: "Xem báo cáo hiệu suất và thống kê dự án",
    icon: <BarChartIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/reports",
    color: "#f57c00",
  },
  {
    title: "Quản lý người dùng",
    description: "Thêm, sửa, xóa và quản lý thông tin người dùng",
    icon: <ManageAccountsIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/users",
    color: "#5e35b1",
  },
  {
    title: "Quản lý thông báo",
    description: "Cài đặt và quản lý thông báo hệ thống",
    icon: <NotificationsIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/notifications",
    color: "#e91e63",
  },
  {
    title: "Cài đặt hệ thống",
    description: "Cấu hình và tùy chỉnh hệ thống",
    icon: <SettingsIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/settings",
    color: "#616161",
  },
];

const DashboardGrid = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          Quản lý và theo dõi các hoạt động dự án của bạn
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {menuItems.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={index}>
            <MenuCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DashboardGrid;
