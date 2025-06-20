"use client";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactNode, useState } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import SidebarNavigation, {
    DRAWER_WIDTH,
    COLLAPSED_DRAWER_WIDTH,
} from "../dashboard/components/SidebarNavigation";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const currentDrawerWidth = isSidebarCollapsed
    ? COLLAPSED_DRAWER_WIDTH
    : DRAWER_WIDTH;

  return (
    <>
      <DashboardHeader 
        onMenuClick={handleDrawerToggle}
        onToggleSidebarCollapse={handleSidebarToggle}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar Navigation */}
        <Box
          component="nav"
          sx={{ width: { lg: currentDrawerWidth }, flexShrink: { lg: 0 }, transition: 'width 0.3s' }}
        >
          {isMobile ? (
            <SidebarNavigation
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              isCollapsed={false}
              onToggleCollapse={() => {}}
            />
          ) : (
            <SidebarNavigation
              variant="permanent"
              open={true}
              onClose={() => {}}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={handleSidebarToggle}
            />
          )}
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { lg: `calc(100% - ${currentDrawerWidth}px)` },
            minHeight: "100vh",
            backgroundColor: theme.palette.background.default,
            transition: 'width 0.3s',
          }}
        >
          <ErrorBoundary>
            <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
          </ErrorBoundary>
        </Box>
      </Box>
    </>
  );
} 