"use client";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChatIcon from "@mui/icons-material/Chat";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "Quản lý người dùng",
    description: "Thêm, sửa, xóa và quản lý thông tin người dùng",
    icon: <ManageAccountsIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/users",
    color: "#1976d2",
    gradient: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
  },
  {
    title: "Quản lý công việc",
    description: "Tạo, phân công và theo dõi tiến độ công việc",
    icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/tasks",
    color: "#388e3c",
    gradient: "linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)",
  },
  {
    title: "Báo cáo & Thống kê",
    description: "Xem báo cáo hiệu suất và thống kê dự án",
    icon: <BarChartIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/reports",
    color: "#f57c00",
    gradient: "linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)",
  },
  {
    title: "Quản lý thông báo",
    description: "Gửi và quản lý thông báo cho người dùng",
    icon: <NotificationsIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/notifications",
    color: "#d32f2f",
    gradient: "linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)",
  },
  {
    title: "Quản lý chat",
    description: "Theo dõi và quản lý tin nhắn trong hệ thống",
    icon: <ChatIcon sx={{ fontSize: 32 }} />,
    path: "/dashboard/chat",
    color: "#7b1fa2",
    gradient: "linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderRadius: 2,
        }}
      >
       

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            textAlign: "center",
            marginBottom: 4,
            color: "#666",
          }}
        >
          Bảng điều khiển quản trị
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
            flex: 1,
            width: "100%",
          }}
        >
          {menuItems.map((item, index) => (
            <Box key={index}>
              <Card
                elevation={0}
                sx={{
                  border: 1,
                  borderRadius: 1,
                  borderColor: "#e0e0e0",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    elevation: 4,
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleCardClick(item.path)}
                  sx={{
                    height: "100%",
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ color: item.color }}>{item.icon}</Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textAlign: "center",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
