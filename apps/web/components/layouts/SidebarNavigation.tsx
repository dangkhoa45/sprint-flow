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
import Tooltip from "@mui/material/Tooltip";
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

const DRAWER_WIDTH = 220;
const COLLAPSED_DRAWER_WIDTH = 60;

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Bảng điều khiển",
    icon: <DashboardIcon fontSize="small" />,
    path: "/dashboard",
  },
  {
    id: "projects",
    label: "Dự án",
    icon: <AccountTreeIcon fontSize="small" />,
    children: [
      {
        id: "all-projects",
        label: "Tất cả dự án",
        icon: <FolderIcon fontSize="small" />,
        path: "/projects",
      },
      {
        id: "my-projects",
        label: "Dự án của tôi",
        icon: <PersonIcon fontSize="small" />,
        path: "/projects/my",
      },
      {
        id: "archived",
        label: "Đã lưu trữ",
        icon: <FolderIcon fontSize="small" />,
        path: "/projects/archived",
      },
    ],
  },
  {
    id: "tasks",
    label: "Công việc",
    icon: <AssignmentIcon fontSize="small" />,
    path: "/dashboard/tasks",
  },
  {
    id: "calendar",
    label: "Lịch",
    icon: <CalendarTodayIcon fontSize="small" />,
    path: "/dashboard/calendar",
  },
  {
    id: "documents",
    label: "Tài liệu",
    icon: <DescriptionIcon fontSize="small" />,
    path: "/dashboard/documents",
  },
  {
    id: "timeline",
    label: "Dòng thời gian",
    icon: <TimelineIcon fontSize="small" />,
    path: "/dashboard/timeline",
  },
  {
    id: "chat",
    label: "Trò chuyện",
    icon: <ChatIcon fontSize="small" />,
    path: "/dashboard/chat",
  },
  {
    id: "reports",
    label: "Báo cáo",
    icon: <BarChartIcon fontSize="small" />,
    path: "/dashboard/reports",
  },
];

const adminItems: NavigationItem[] = [
  {
    id: "users",
    label: "Quản lý người dùng",
    icon: <ManageAccountsIcon fontSize="small" />,
    path: "/dashboard/users",
  },
  {
    id: "notifications",
    label: "Thông báo",
    icon: <NotificationsIcon fontSize="small" />,
    path: "/dashboard/notifications",
  },
  {
    id: "settings",
    label: "Cài đặt",
    icon: <SettingsIcon fontSize="small" />,
    path: "/dashboard/settings",
  },
];

interface SidebarNavigationProps {
  open: boolean;
  onClose: () => void;
  variant?: "permanent" | "persistent" | "temporary";
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const SidebarNavigation = ({
  open,
  onClose,
  variant = "permanent",
  isCollapsed,
  onToggleCollapse,
}: SidebarNavigationProps) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const findParentIds = (
      items: NavigationItem[],
      currentPath: string
    ): string[] => {
      const ids: string[] = [];
      for (const item of items) {
        if (
          item.children?.some(
            (child) => child.path && currentPath.startsWith(child.path)
          )
        ) {
          ids.push(item.id);
        }
      }
      return ids;
    };
    return findParentIds(navigationItems, pathname);
  });

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

    if (path.startsWith("/projects")) {
      return pathname === path;
    }

    // Check if the current path is the exact path or a sub-route
    return (
      pathname === path || (path !== "/" && pathname.startsWith(path + "/"))
    );
  };

  const renderNavigationItem = (item: NavigationItem, depth = 0) => {
    const isActive = isItemActive(item.path);
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <Box key={item.id}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <Tooltip
            title={isCollapsed ? item.label : ""}
            placement="right"
            arrow
            disableHoverListener={!isCollapsed}
          >
            <ListItemButton
              onClick={() => handleItemClick(item)}
              sx={{
                minHeight: 38,
                justifyContent: isCollapsed ? "center" : "flex-start",
                pl: depth * 1.5 + (isCollapsed ? 0 : 1.5),
                pr: isCollapsed ? 0 : 1.5,
                py: 0.5,
                mx: 0.5,
                borderRadius: 1,
                mb: 0.25,
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
                  minWidth: 28,
                  mr: isCollapsed ? 0 : 1.2,
                  justifyContent: "center",
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  display: "flex",
                  fontSize: 18,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.8rem",
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              )}
              {!isCollapsed && hasChildren && (
                <Box sx={{ ml: 0.5 }}>
                  {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </Box>
              )}
            </ListItemButton>
          </Tooltip>
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
          p: 1.2,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          gap: 1.2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          height: 48,
          transition: "padding 0.3s, justify-content 0.3s",
        }}
      >
        {!isCollapsed && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                minWidth: 28,
                height: 28,
                borderRadius: 1.2,
                backgroundColor: theme.palette.primary.main,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DashboardIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                whiteSpace: "nowrap",
                fontSize: "1rem",
              }}
            >
              Sprint Flow
            </Typography>
          </Box>
        )}
        {isCollapsed && (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1.2,
              backgroundColor: theme.palette.primary.main,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DashboardIcon sx={{ fontSize: 16 }} />
          </Box>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto", py: 2 }}>
        <List>{navigationItems.map((item) => renderNavigationItem(item))}</List>

        <Divider sx={{ my: 2, mx: 2 }} />

        <Box sx={{ px: 1.2, mb: 0.5 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: theme.palette.text.secondary,
              letterSpacing: "0.5px",
              display: isCollapsed ? "none" : "block",
            }}
          >
            Quản trị
          </Typography>
        </Box>

        <List>{adminItems.map((item) => renderNavigationItem(item))}</List>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <Box
          sx={{
            p: 1.2,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center", mt: 0.5, fontSize: "0.7rem" }}
          >
            Sprint Flow v1.0.0
          </Typography>
        </Box>
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
        width: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          overflowX: "hidden",
          transition: "width 0.3s",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SidebarNavigation;
export { COLLAPSED_DRAWER_WIDTH, DRAWER_WIDTH };
