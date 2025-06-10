"use client";
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import TimelineIcon from "@mui/icons-material/Timeline";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GridViewIcon from "@mui/icons-material/GridView";
import WorkIcon from "@mui/icons-material/Work";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useRouter, usePathname } from "next/navigation";

interface ReportsLayoutProps {
  children: React.ReactNode;
}

const reportTabs = [
  {
    label: "Tổng quan",
    path: "/dashboard/reports",
    icon: <BarChartIcon />,
  },
  {
    label: "Ma trận Eisenhower",
    path: "/dashboard/reports/eisenhower",
    icon: <GridViewIcon />,
  },
  {
    label: "Biểu đồ Gantt",
    path: "/dashboard/reports/gantt-chart",
    icon: <AccountTreeIcon />,
  },
  {
    label: "Phân bổ nguồn lực",
    path: "/dashboard/reports/resource-allocation",
    icon: <WorkIcon />,
  },
  {
    label: "Trạng thái thực hiện",
    path: "/dashboard/reports/task-execution-status",
    icon: <AssignmentIcon />,
  },
  {
    label: "Thời gian thực hiện",
    path: "/dashboard/reports/task-execution-time",
    icon: <TrendingUpIcon />,
  },
  {
    label: "Theo người được giao",
    path: "/dashboard/reports/tasks-by-assignee",
    icon: <PeopleIcon />,
  },
  {
    label: "Theo người liên quan",
    path: "/dashboard/reports/tasks-by-related-person",
    icon: <PeopleIcon />,
  },
  {
    label: "Theo thời gian",
    path: "/dashboard/reports/tasks-by-time",
    icon: <TimelineIcon />,
  },
];

export default function ReportsLayout({ children }: ReportsLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(newValue);
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const currentTab =
    reportTabs.find((tab) => tab.path === pathname)?.path ||
    "/dashboard/reports";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 3,
      }}
    >
      <Container maxWidth={false}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 4,
            p: 3,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton
              onClick={handleBackToDashboard}
              sx={{
                mr: 2,
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #764ba2, #667eea)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 0.5,
                }}
              >
                Báo cáo & Thống kê
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Phân tích hiệu suất và tối ưu hóa quy trình làm việc
              </Typography>
            </Box>
          </Box>

          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  minHeight: "48px",
                  color: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    color: "rgba(255, 255, 255, 0.9)",
                    background: "rgba(255, 255, 255, 0.05)",
                  },
                  "&.Mui-selected": {
                    color: "#42a5f5",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#42a5f5",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                "& .MuiTabs-scrollButtons": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    color: "white",
                  },
                },
              }}
            >
              {reportTabs.map((tab) => (
                <Tab
                  key={tab.path}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {tab.icon}
                      {tab.label}
                    </Box>
                  }
                  value={tab.path}
                />
              ))}
            </Tabs>
          </Box>
        </Paper>

        {/* Content */}
        {children}
      </Container>
    </Box>
  );
}
