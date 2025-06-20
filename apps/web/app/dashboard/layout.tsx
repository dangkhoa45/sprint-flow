"use client";
import { ReactNode, useState } from "react";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DashboardHeader from "./components/DashboardHeader";
import SidebarNavigation, { DRAWER_WIDTH } from "./components/SidebarNavigation";
import ErrorBoundary from "../../components/ErrorBoundary";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}
      >
        {isMobile ? (
          <SidebarNavigation
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        ) : (
          <SidebarNavigation
            variant="permanent"
            open={true}
            onClose={() => {}}
          />
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <DashboardHeader onMenuClick={handleDrawerToggle} />
        <ErrorBoundary>
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {children}
          </Box>
        </ErrorBoundary>
      </Box>
    </Box>
  );
}
