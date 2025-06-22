import { ReactNode, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DashboardHeader from '@/components/layouts/Header';
import SidebarNavigation, {
  DRAWER_WIDTH,
  COLLAPSED_DRAWER_WIDTH,
} from '@/components/layouts/SidebarNavigation';
import ErrorBoundary from '../ErrorBoundary';

interface AppLayoutProps {
  children: ReactNode;
}

const SIDEBAR_COLLAPSE_KEY = 'sprintflow_sidebar_collapsed';

export default function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Đọc trạng thái sidebar từ localStorage khi mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
    if (stored === 'true') setSidebarCollapsed(true);
    if (stored === 'false') setSidebarCollapsed(false);
  }, []);

  // Lưu trạng thái sidebar vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
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
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar Navigation */}
        <Box
          component='nav'
          sx={{
            width: { lg: currentDrawerWidth },
            flexShrink: { lg: 0 },
            transition: 'width 0.3s',
          }}
        >
          {isMobile ? (
            <SidebarNavigation
              variant='temporary'
              open={mobileOpen}
              onClose={handleDrawerToggle}
              isCollapsed={false}
              onToggleCollapse={() => {}}
            />
          ) : (
            <SidebarNavigation
              variant='permanent'
              open={true}
              onClose={() => {}}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={handleSidebarToggle}
            />
          )}
        </Box>

        {/* Main Content */}
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            width: { lg: `calc(100% - ${currentDrawerWidth}px)` },
            minHeight: '100vh',
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
