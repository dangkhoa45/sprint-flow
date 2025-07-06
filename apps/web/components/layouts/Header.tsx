'use client';
import {
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { apiLogout } from '@/actions/apiLogout';
import LogoutConfirmDialog from '@/components/LogoutConfirmDialog';
import ThemeToggle from '@/components/ThemeToggle';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useThemeMode } from '@/provider/ThemeContext';
import { log } from '@/utils/logger';
import { RealtimeNotifications } from '../RealtimeNotifications';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  onToggleSidebarCollapse?: () => void;
  _isSidebarCollapsed?: boolean;
}

const DashboardHeader = ({
  onMenuClick,
  onToggleSidebarCollapse,
  _isSidebarCollapsed,
}: DashboardHeaderProps) => {
  const router = useRouter();
  const { user } = useCurrentUser();
  const theme = useTheme();
  const { resolvedTheme: _resolvedTheme } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);
      setShowLogoutDialog(false);

      await apiLogout();

      toast.success('Đăng xuất thành công!', { autoClose: 1000 });
    } catch (error) {
      log(
        'Logout error: ' +
          (error instanceof Error ? error.message : String(error))
      );
      setIsLoggingOut(false);

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    router.push('/dashboard/profile');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    router.push('/dashboard/settings');
  };

  const handleSecurityClick = () => {
    handleMenuClose();
    router.push('/dashboard/security');
  };

  return (
    <AppBar
      position='sticky'
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          py: 0.5,
          px: { xs: 1, md: 2 },
          minHeight: 48,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          {isMobile && onMenuClick && (
            <IconButton
              edge='start'
              onClick={onMenuClick}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Sidebar Collapse Toggle Icon (only on desktop) */}
          {!isMobile && onToggleSidebarCollapse && (
            <IconButton
              edge='start'
              onClick={onToggleSidebarCollapse}
              sx={{
                mx: 0.02,
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <MenuIcon fontSize='small' />
            </IconButton>
          )}

          {/* Logo và tên ứng dụng */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.7, ml: -0.5 }}
          >
            <DashboardIcon
              sx={{ fontSize: 20, color: theme.palette.primary.main }}
            />
            <Typography
              variant='h6'
              component='div'
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: 0.5,
                userSelect: 'none',
                fontSize: '1.1rem',
              }}
            >
              Sprint Flow
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
          <ThemeToggle />
          <RealtimeNotifications />

          <IconButton
            onClick={handleMenuClick}
            sx={{
              ml: 1,
              p: 0.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.main,
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
              src={user?.avatar}
            >
              {user?.displayName?.charAt(0)?.toUpperCase() || (
                <AccountCircleIcon fontSize='small' />
              )}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                '& .MuiMenuItem-root': {
                  py: 1.5,
                  px: 2,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PersonIcon sx={{ color: '#1976d2', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary='Hồ sơ cá nhân' />
            </MenuItem>
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SettingsIcon sx={{ color: '#616161', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary='Cài đặt' />
            </MenuItem>
            <MenuItem onClick={handleSecurityClick}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SecurityIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary='Bảo mật' />
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              sx={{
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: `${theme.palette.error.main}08`,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {isLoggingOut ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: theme.palette.error.main }}
                  />
                ) : (
                  <LogoutIcon
                    sx={{ color: theme.palette.error.main, fontSize: 20 }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
              />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onCloseAction={handleLogoutCancel}
        onConfirmAction={handleLogoutConfirm}
        loading={isLoggingOut}
      />
    </AppBar>
  );
};

export default DashboardHeader;
