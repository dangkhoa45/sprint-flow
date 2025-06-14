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
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuCard from "./MenuCard";

const menuItems = [
  {
    title: "Quản lý dự án",
    description: "Tạo và quản lý dự án",
    icon: <AccountTreeIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/projects",
    color: "#1976d2",
    bgColor: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
  },
  {
    title: "Quản lý công việc",
    description: "Tạo, phân công và theo dõi tiến độ công việc",
    icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/tasks",
    color: "#2196f3",
    bgColor: "linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)",
  },
  {
    title: "Quản lý lịch làm việc",
    description: "Lập lịch và theo dõi lịch làm việc của team",
    icon: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/calendar",
    color: "#00897b",
    bgColor: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
  },
  {
    title: "Quản lý tài liệu",
    description: "Tạo, chỉnh sửa và quản lý tài liệu dự án",
    icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/documents",
    color: "#43a047",
    bgColor: "linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)",
  },
  {
    title: "Theo dõi tiến độ",
    description: "Theo dõi tiến độ dự án theo thời gian thực",
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/timeline",
    color: "#0288d1",
    bgColor: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
  },
  {
    title: "Phòng chat",
    description: "Trao đổi thông tin và thảo luận với các thành viên",
    icon: <ChatIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/chat",
    color: "#00acc1",
    bgColor: "linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)",
  },
  {
    title: "Báo cáo & Thống kê",
    description: "Xem báo cáo hiệu suất và thống kê dự án",
    icon: <BarChartIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/reports",
    color: "#ff9800",
    bgColor: "linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)",
  },
  {
    title: "Quản lý người dùng",
    description: "Thêm, sửa, xóa và quản lý thông tin người dùng",
    icon: <ManageAccountsIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/users",
    color: "#9c27b0",
    bgColor: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
  },
  {
    title: "Quản lý thông báo",
    description: "Cài đặt và quản lý thông báo hệ thống",
    icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/notifications",
    color: "#e91e63",
    bgColor: "linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)",
  },
  {
    title: "Cài đặt hệ thống",
    description: "Cấu hình và tùy chỉnh hệ thống",
    icon: <SettingsIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/settings",
    color: "#607d8b",
    bgColor: "linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)",
  },
];

const DashboardGrid = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {menuItems.map((item, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}
            key={index}
            sx={{
              minHeight: 200,
            }}
          >
            <MenuCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DashboardGrid;
