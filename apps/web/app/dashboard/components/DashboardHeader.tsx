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
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { apiLogout } from "../../../actions/apiLogout";
import LogoutConfirmDialog from "../../../components/LogoutConfirmDialog";
import ThemeToggle from "../../../components/ThemeToggle";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useThemeMode } from "../../../provider/ThemeContext";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import Link from "next/link";

const DashboardHeader = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useCurrentUser();
  const theme = useTheme();
  const { resolvedTheme } = useThemeMode();
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
        background: isDark
          ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(255, 255, 255, 0.02) 100%)`
          : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(99, 102, 241, 0.02) 100%)`,
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: isDark
          ? "0 4px 20px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)"
          : "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? "linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.03) 50%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.015) 50%, transparent 100%)",
          zIndex: 0,
        },
        "& .MuiToolbar-root": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          py: 1,
          px: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
            textDecoration: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              opacity: 0.8,
            },
          }}
          component={Link}
          href="/dashboard"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: isDark ? "#ffffff" : "#000000",
              color: isDark ? "#000000" : "#ffffff",
              boxShadow: isDark
                ? "0 2px 8px rgba(255, 255, 255, 0.1)"
                : "0 2px 8px rgba(0, 0, 0, 0.15)",
              border: isDark 
                ? "1px solid rgba(255, 255, 255, 0.2)" 
                : "1px solid rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: isDark
                  ? "0 4px 12px rgba(255, 255, 255, 0.2)"
                  : "0 4px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <DashboardIcon sx={{ fontSize: 24 }} />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              letterSpacing: "0.25px",
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              background: isDark
                ? `linear-gradient(135deg, ${theme.palette.text.primary} 0%, rgba(255, 255, 255, 0.8) 100%)`
                : `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: isDark ? "none" : "0 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            Sprint Flow
          </Typography>
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
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0, 172, 193, 0.2)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Badge
              badgeContent={3}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.75rem",
                  minWidth: 18,
                  height: 18,
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
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
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(233, 30, 99, 0.2)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Badge
              badgeContent={5}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.75rem",
                  minWidth: 18,
                  height: 18,
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
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
                borderColor: isDark ? "#ffffff" : "#000000",
                transform: "translateY(-1px)",
                boxShadow: isDark
                  ? "0 4px 12px rgba(255, 255, 255, 0.2)"
                  : "0 4px 12px rgba(0, 0, 0, 0.2)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                backgroundColor: isDark ? "#ffffff" : "#000000",
                color: isDark ? "#000000" : "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 600,
                border: isDark 
                  ? "2px solid rgba(255, 255, 255, 0.15)" 
                  : "2px solid rgba(0, 0, 0, 0.1)",
                boxShadow: isDark
                  ? "0 2px 8px rgba(255, 255, 255, 0.1)"
                  : "0 2px 8px rgba(0, 0, 0, 0.15)",
                transition: "all 0.3s ease",
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
                boxShadow: isDark
                  ? "0 8px 24px rgba(0, 0, 0, 0.4)"
                  : "0 8px 24px rgba(0, 0, 0, 0.12)",
                "& .MuiMenuItem-root": {
                  color: theme.palette.text.primary,
                  py: 1.5,
                  px: 2,
                  fontSize: "0.9rem",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PersonIcon
                  sx={{
                    color: "#1976d2",
                    fontSize: 20,
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Hồ sơ cá nhân" />
            </MenuItem>
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SettingsIcon
                  sx={{
                    color: "#616161",
                    fontSize: 20,
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Cài đặt" />
            </MenuItem>
            <MenuItem onClick={handleSecurityClick}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SecurityIcon
                  sx={{
                    color: "#2e7d32",
                    fontSize: 20,
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Bảo mật" />
            </MenuItem>
            <Divider
              sx={{
                backgroundColor: theme.palette.divider,
                my: 0.5,
              }}
            />
            <MenuItem
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              sx={{
                opacity: isLoggingOut ? 0.6 : 1,
                pointerEvents: isLoggingOut ? "none" : "auto",
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
                    sx={{
                      color: theme.palette.error.main,
                      fontSize: 20,
                    }}
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
