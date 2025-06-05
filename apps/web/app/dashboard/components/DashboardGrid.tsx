"use client";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
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
    path: "/dashboard/teams",
    color: "#00796b",
    bgColor: "#e0f2f1",
    gradient: "linear-gradient(135deg, #00796b 0%, #26a69a 100%)",
  },
  {
    title: "Quản lý công việc",
    description: "Tạo, phân công và theo dõi tiến độ công việc",
    icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/tasks",
    color: "#388e3c",
    bgColor: "#e8f5e8",
    gradient: "linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)",
  },
  {
    title: "Theo dõi tiến độ",
    description: "Theo dõi tiến độ dự án theo thời gian thực",
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/timeline",
    color: "#5d4037",
    bgColor: "#efebe9",
    gradient: "linear-gradient(135deg, #5d4037 0%, #8d6e63 100%)",
  },
  {
    title: "Báo cáo & Thống kê",
    description: "Xem báo cáo hiệu suất và thống kê dự án",
    icon: <BarChartIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/reports",
    color: "#f57c00",
    bgColor: "#fff3e0",
    gradient: "linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)",
  },
  {
    title: "Quản lý người dùng",
    description: "Thêm, sửa, xóa và quản lý thông tin người dùng",
    icon: <ManageAccountsIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/users",
    color: "#1976d2",
    bgColor: "#e3f2fd",
    gradient: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
  },
  {
    title: "Quản lý thông báo",
    description: "Cài đặt và quản lý thông báo hệ thống",
    icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/notifications",
    color: "#d32f2f",
    bgColor: "#ffebee",
    gradient: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
  },
  {
    title: "Cài đặt hệ thống",
    description: "Cấu hình và tùy chỉnh hệ thống",
    icon: <SettingsIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/settings",
    color: "#7b1fa2",
    bgColor: "#f3e5f5",
    gradient: "linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)",
  },
];

const DashboardGrid = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4 }}
    >
      <Grid
        container
        spacing={3}
      >
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
