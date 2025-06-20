"use client";
import Box from "@mui/material/Box";
import DashboardOverview from "./components/DashboardOverview";

export default function DashboardPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <DashboardOverview />
      {/* <DashboardGrid /> */}
    </Box>
  );
}
