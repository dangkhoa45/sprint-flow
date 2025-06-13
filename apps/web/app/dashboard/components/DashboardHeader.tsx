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
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { apiLogout } from "../../../actions/apiLogout";
import LogoutConfirmDialog from "../../../components/LogoutConfirmDialog";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";

const DashboardHeader = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useCurrentUser();
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

      // Show logout starting notification
      enqueueSnackbar("Đang đăng xuất...", {
        variant: "info",
        autoHideDuration: 2000,
      });

      // Call the logout API to clear cookies and redirect
      await apiLogout();

      // Success notification will be shown briefly before redirect
      enqueueSnackbar("Đăng xuất thành công!", {
        variant: "success",
        autoHideDuration: 1000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);

      // Show error notification
      enqueueSnackbar("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.", {
        variant: "error",
        autoHideDuration: 4000,
      });

      // Fallback: manually redirect to login if API call fails
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
      elevation={1}
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: (theme) => theme.shadows[1],
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <DashboardIcon
            sx={{ fontSize: 32, color: (theme) => theme.palette.primary.main }}
          />
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              color: (theme) => theme.palette.primary.main,
              letterSpacing: "0.5px",
            }}
          >
            SprintFlow
          </Typography>
        </Box>

        {/* Actions section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            sx={{
              color: (theme) => theme.palette.text.primary,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Badge badgeContent={3} color="error">
              <ChatIcon />
            </Badge>
          </IconButton>

          <IconButton
            sx={{
              color: (theme) => theme.palette.text.primary,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Badge badgeContent={5} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            onClick={handleMenuClick}
            sx={{
              ml: 1,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: (theme) => theme.palette.primary.main,
                border: (theme) => `2px solid ${theme.palette.primary.light}`,
                fontSize: "1rem",
                fontWeight: 600,
              }}
              src={user?.avatar}
            >
              {user?.displayName?.charAt(0)?.toUpperCase() || (
                <AccountCircleIcon />
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
                minWidth: 220,
                backgroundColor: (theme) => theme.palette.background.paper,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: (theme) => theme.shadows[8],
                "& .MuiMenuItem-root": {
                  color: (theme) => theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon
                  sx={{ color: (theme) => theme.palette.text.primary }}
                />
              </ListItemIcon>
              <ListItemText primary="Hồ sơ cá nhân" />
            </MenuItem>
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon>
                <SettingsIcon
                  sx={{ color: (theme) => theme.palette.text.primary }}
                />
              </ListItemIcon>
              <ListItemText primary="Cài đặt" />
            </MenuItem>
            <MenuItem onClick={handleSecurityClick}>
              <ListItemIcon>
                <SecurityIcon
                  sx={{ color: (theme) => theme.palette.text.primary }}
                />
              </ListItemIcon>
              <ListItemText primary="Bảo mật" />
            </MenuItem>
            <Divider
              sx={{ backgroundColor: (theme) => theme.palette.divider }}
            />
            <MenuItem
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              sx={{
                opacity: isLoggingOut ? 0.6 : 1,
                pointerEvents: isLoggingOut ? "none" : "auto",
              }}
            >
              <ListItemIcon>
                {isLoggingOut ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: (theme) => theme.palette.text.primary }}
                  />
                ) : (
                  <LogoutIcon
                    sx={{ color: (theme) => theme.palette.text.primary }}
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

      {/* Logout Confirmation Dialog */}
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
