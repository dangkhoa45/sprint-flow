"use client";
import Box from "@mui/material/Box";
import DashboardOverview from "./components/DashboardOverview";
import DashboardGrid from "./components/DashboardGrid";

export default function DashboardPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Overview Section */}
      <DashboardOverview />
      
      {/* Quick Actions Grid */}
      <DashboardGrid />
    </Box>
  );
}
