"use client";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

// Icons
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import TimelineIcon from "@mui/icons-material/Timeline";

const DRAWER_WIDTH = 280;

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavigationItem[];
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Bảng điều khiển",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    id: "projects",
    label: "Dự án",
    icon: <AccountTreeIcon />,
    children: [
      {
        id: "all-projects",
        label: "Tất cả dự án",
        icon: <FolderIcon />,
        path: "/dashboard/projects",
      },
      {
        id: "my-projects",
        label: "Dự án của tôi",
        icon: <PersonIcon />,
        path: "/dashboard/projects/my",
      },
      {
        id: "archived",
        label: "Đã lưu trữ",
        icon: <FolderIcon />,
        path: "/dashboard/projects/archived",
      },
    ],
  },
  {
    id: "tasks",
    label: "Công việc",
    icon: <AssignmentIcon />,
    path: "/dashboard/tasks",
    badge: 5,
  },
  {
    id: "calendar",
    label: "Lịch",
    icon: <CalendarTodayIcon />,
    path: "/dashboard/calendar",
  },
  {
    id: "documents",
    label: "Tài liệu",
    icon: <DescriptionIcon />,
    path: "/dashboard/documents",
  },
  {
    id: "timeline",
    label: "Dòng thời gian",
    icon: <TimelineIcon />,
    path: "/dashboard/timeline",
  },
  {
    id: "chat",
    label: "Trò chuyện",
    icon: <ChatIcon />,
    path: "/dashboard/chat",
    badge: 3,
  },
  {
    id: "reports",
    label: "Báo cáo",
    icon: <BarChartIcon />,
    path: "/dashboard/reports",
  },
];

const adminItems: NavigationItem[] = [
  {
    id: "users",
    label: "Quản lý người dùng",
    icon: <ManageAccountsIcon />,
    path: "/dashboard/users",
  },
  {
    id: "notifications",
    label: "Thông báo",
    icon: <NotificationsIcon />,
    path: "/dashboard/notifications",
  },
  {
    id: "settings",
    label: "Cài đặt",
    icon: <SettingsIcon />,
    path: "/dashboard/settings",
  },
];

interface SidebarNavigationProps {
  open: boolean;
  onClose: () => void;
  variant?: "permanent" | "persistent" | "temporary";
}

const SidebarNavigation = ({
  open,
  onClose,
  variant = "permanent",
}: SidebarNavigationProps) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleItemClick = (item: NavigationItem) => {
    if (item.children) {
      const isExpanded = expandedItems.includes(item.id);
      if (isExpanded) {
        setExpandedItems((prev) => prev.filter((id) => id !== item.id));
      } else {
        setExpandedItems((prev) => [...prev, item.id]);
      }
    } else if (item.path) {
      router.push(item.path);
      if (variant === "temporary") {
        onClose();
      }
    }
  };

  const isItemActive = (path?: string) => {
    if (!path) return false;
    return pathname === path || pathname.startsWith(path + "/");
  };

  const renderNavigationItem = (item: NavigationItem, depth = 0) => {
    const isActive = isItemActive(item.path);
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <Box key={item.id}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              pl: depth * 2 + 2,
              pr: 2,
              py: 1,
              mx: 1,
              borderRadius: 1.5,
              mb: 0.5,
              backgroundColor: isActive
                ? `${theme.palette.primary.main}12`
                : "transparent",
              color: isActive
                ? theme.palette.primary.main
                : theme.palette.text.primary,
              "&:hover": {
                backgroundColor: isActive
                  ? `${theme.palette.primary.main}20`
                  : theme.palette.action.hover,
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2,
                justifyContent: "center",
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 400,
              }}
            />
            {item.badge && (
              <Box
                sx={{
                  minWidth: 20,
                  height: 20,
                  borderRadius: "10px",
                  backgroundColor: theme.palette.error.main,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  mr: hasChildren ? 1 : 0,
                }}
              >
                {item.badge}
              </Box>
            )}
            {hasChildren && (
              <Box sx={{ ml: 1 }}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) =>
                renderNavigationItem(child, depth + 1)
              )}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          height: 65,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DashboardIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: theme.palette.text.primary }}
        >
          Sprint Flow
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto", py: 2 }}>
        <List>{navigationItems.map((item) => renderNavigationItem(item))}</List>

        <Divider sx={{ my: 2, mx: 2 }} />

        <Box sx={{ px: 2, mb: 1 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: theme.palette.text.secondary,
              letterSpacing: "0.5px",
            }}
          >
            Quản trị
          </Typography>
        </Box>

        <List>{adminItems.map((item) => renderNavigationItem(item))}</List>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center" }}
        >
          SprintFlow v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SidebarNavigation;
export { DRAWER_WIDTH };
