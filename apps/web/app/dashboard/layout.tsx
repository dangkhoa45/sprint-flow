"use client"
import { ReactNode } from "react";
import Box from '@mui/material/Box';
import DashboardHeader from "./components/DashboardHeader";
import ErrorBoundary from "../../components/ErrorBoundary";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.background.default,
        position: "relative",
      }}
    >
      <DashboardHeader />
      <ErrorBoundary>
        <Box sx={{ position: "relative" }}>
          {children}
        </Box>
      </ErrorBoundary>
    </Box>
  );
}
