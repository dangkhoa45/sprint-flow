"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import { useRouter } from "next/navigation";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import TimelineIcon from "@mui/icons-material/Timeline";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GridViewIcon from "@mui/icons-material/GridView";
import WorkIcon from "@mui/icons-material/Work";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const reportCards = [
  {
    title: "Ma trận Eisenhower",
    description: "Phân loại công việc theo mức độ khẩn cấp và quan trọng",
    icon: <GridViewIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/reports/eisenhower",
    color: "#1976d2",
    bgColor: "rgba(25, 118, 210, 0.1)",
  },
  {
    title: "Biểu đồ Gantt",
    description: "Timeline dự án và phụ thuộc giữa các công việc",
    icon: <AccountTreeIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/reports/gantt-chart",
    color: "#388e3c",
    bgColor: "rgba(56, 142, 60, 0.1)",
  },
  {
    title: "Phân bổ nguồn lực",
    description: "Quản lý và tối ưu hóa việc phân bổ nhân lực",
    icon: <WorkIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/reports/resource-allocation",
    color: "#f57c00",
    bgColor: "rgba(245, 124, 0, 0.1)",
  },
  {
    title: "Trạng thái thực hiện",
    description: "Theo dõi trạng thái của các công việc",
    icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/reports/task-execution-status",
    color: "#7b1fa2",
    bgColor: "rgba(123, 31, 162, 0.1)",
  },
  {
    title: "Thời gian thực hiện",
    description: "Phân tích thời gian hoàn thành công việc",
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/reports/task-execution-time",
    color: "#d32f2f",
    bgColor: "rgba(211, 47, 47, 0.1)",
  },
  {
    title: "Theo người được giao",
    description: "Báo cáo công việc theo người thực hiện",
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/reports/tasks-by-assignee",
    color: "#00796b",
    bgColor: "rgba(0, 121, 107, 0.1)",
  },
  {
    title: "Theo người liên quan",
    description: "Phân tích công việc theo stakeholder",
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/reports/tasks-by-related-person",
    color: "#5d4037",
    bgColor: "rgba(93, 64, 55, 0.1)",
  },
  {
    title: "Theo thời gian",
    description: "Timeline và xu hướng công việc theo thời gian",
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/reports/tasks-by-time",
    color: "#303f9f",
    bgColor: "rgba(48, 63, 159, 0.1)",
  },
];

export default function ReportsPage() {
  const router = useRouter();

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Paper
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 3,
          p: 4,
          mb: 4,
          textAlign: "center",
        }}
      >
        <BarChartIcon sx={{ fontSize: 60, color: "#42a5f5", mb: 2 }} />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "white",
            mb: 2,
          }}
        >
          Chọn loại báo cáo
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Khám phá các báo cáo chi tiết để hiểu rõ hiệu suất dự án,
          phân tích xu hướng và tối ưu hóa quy trình làm việc của bạn.
        </Typography>
      </Paper>

      {/* Report Cards Grid */}
      <Grid container spacing={3}>
        {reportCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 3,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-8px)",
                  background: "rgba(255, 255, 255, 0.15)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardActionArea
                onClick={() => handleCardClick(card.path)}
                sx={{
                  height: "100%",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <CardContent
                  sx={{
                    p: 0,
                    "&:last-child": { pb: 0 },
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      background: card.bgColor,
                      color: card.color,
                      mb: 3,
                      border: `1px solid ${card.color}30`,
                    }}
                  >
                    {card.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "white",
                      mb: 2,
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: 1.6,
                      flex: 1,
                    }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
