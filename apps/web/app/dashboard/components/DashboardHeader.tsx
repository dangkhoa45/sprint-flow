"use client";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Implement logout logic here
    handleMenuClose();
    router.push("/login");
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
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <DashboardIcon sx={{ fontSize: 32, color: "#ffffff" }} />
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
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
              color: "#ffffff",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Badge
              badgeContent={3}
              color="error"
            >
              <ChatIcon />
            </Badge>
          </IconButton>

          <IconButton
            sx={{
              color: "#ffffff",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Badge
              badgeContent={5}
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            onClick={handleMenuClick}
            sx={{
              ml: 1,
              "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <AccountCircleIcon />
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
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                "& .MuiMenuItem-root": {
                  color: "#ffffff",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Hồ sơ cá nhân" />
            </MenuItem>
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon>
                <SettingsIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Cài đặt" />
            </MenuItem>
            <MenuItem onClick={handleSecurityClick}>
              <ListItemIcon>
                <SecurityIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Bảo mật" />
            </MenuItem>
            <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
