"use client";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { apiLogout } from "@/actions/apiLogout";
import LogoutConfirmDialog from "@/components/LogoutConfirmDialog";
import ThemeToggle from "@/components/ThemeToggle";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useThemeMode } from "@/provider/ThemeContext";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  onToggleSidebarCollapse?: () => void;
  isSidebarCollapsed?: boolean;
}

const DashboardHeader = ({ onMenuClick, onToggleSidebarCollapse, isSidebarCollapsed }: DashboardHeaderProps) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useCurrentUser();
  const theme = useTheme();
  const { resolvedTheme } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const isDark = resolvedTheme === "dark";

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

      enqueueSnackbar("Đăng xuất thành công!", {
        variant: "success",
        autoHideDuration: 1000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    router.push("/dashboard/profile");
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    router.push("/dashboard/settings");
  };

  const handleSecurityClick = () => {
    handleMenuClose();
    router.push("/dashboard/security");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{ justifyContent: "space-between", py: 1, px: { xs: 2, md: 3 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isMobile && onMenuClick && (
            <IconButton
              edge="start"
              onClick={onMenuClick}
              sx={{
                color: theme.palette.text.primary,
                "&:hover": {
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
              edge="start"
              onClick={onToggleSidebarCollapse}
              sx={{
                mx: 1,
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo và tên ứng dụng */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: -0.8 }}>
            <DashboardIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: 1,
                userSelect: 'none',
              }}
            >
              Sprint Flow
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ThemeToggle />

          <IconButton
            size="medium"
            sx={{
              color: theme.palette.text.secondary,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#00acc120",
                borderColor: "#00acc1",
                color: "#00acc1",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Badge
              badgeContent={3}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.7rem",
                  minWidth: 16,
                  height: 16,
                },
              }}
            >
              <ChatIcon fontSize="small" />
            </Badge>
          </IconButton>

          <IconButton
            size="medium"
            sx={{
              color: theme.palette.text.secondary,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#e91e6320",
                borderColor: "#e91e63",
                color: "#e91e63",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Badge
              badgeContent={5}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.7rem",
                  minWidth: 16,
                  height: 16,
                },
              }}
            >
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>

          <IconButton
            onClick={handleMenuClick}
            sx={{
              ml: 1,
              p: 0.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.main,
              },
              transition: "all 0.2s ease",
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: theme.palette.primary.main,
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
              src={user?.avatar}
            >
              {user?.displayName?.charAt(0)?.toUpperCase() || (
                <AccountCircleIcon fontSize="small" />
              )}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                "& .MuiMenuItem-root": {
                  py: 1.5,
                  px: 2,
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PersonIcon sx={{ color: "#1976d2", fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary="Hồ sơ cá nhân" />
            </MenuItem>
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SettingsIcon sx={{ color: "#616161", fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary="Cài đặt" />
            </MenuItem>
            <MenuItem onClick={handleSecurityClick}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SecurityIcon sx={{ color: "#2e7d32", fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary="Bảo mật" />
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              sx={{
                color: theme.palette.error.main,
                "&:hover": {
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
                primary={isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
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
