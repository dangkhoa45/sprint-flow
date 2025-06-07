"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewIcon from "@mui/icons-material/Visibility";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { User, UserRole, UserStatus } from "../../../../types/user";

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onView?: (user: User) => void;
  onChangePassword?: (user: User) => void;
}

// Utility functions
const getRoleColor = (role: UserRole): "primary" | "secondary" | "default" => {
  const colorMap = {
    [UserRole.Admin]: "primary" as const,
    [UserRole.User]: "secondary" as const,
  };
  return colorMap[role] || "default";
};

const getStatusColor = (
  status: UserStatus
): "success" | "warning" | "error" | "default" => {
  const colorMap = {
    [UserStatus.Active]: "success" as const,
    [UserStatus.Pending]: "warning" as const,
    [UserStatus.Banned]: "error" as const,
    [UserStatus.Deleted]: "default" as const,
  };
  return colorMap[status] || "default";
};

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return "Chưa có";

  try {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Không hợp lệ";
  }
};

// Style constants
const CARD_STYLES = {
  background:
    "linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))",
  backdropFilter: "blur(25px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: 4,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

const AVATAR_STYLES = {
  width: 80,
  height: 80,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  fontSize: "2rem",
  fontWeight: "bold",
  cursor: "pointer",
  border: "3px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
  "&:hover": {
    transform: "scale(1.1) rotate(5deg)",
    boxShadow: "0 15px 40px rgba(102, 126, 234, 0.5)",
  },
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export default function UserCard({
  user,
  onEdit,
  onDelete,
  onView,
  onChangePassword,
}: UserCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(user);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(user);
    handleMenuClose();
  };

  const handleView = () => {
    onView?.(user);
    handleMenuClose();
  };

  const handleChangePassword = () => {
    onChangePassword?.(user);
    handleMenuClose();
  };

  return (
    <Card
      elevation={0}
      sx={{
        background:
          "linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))",
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: 4,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <CardContent sx={{ flex: 1, p: 4 }}>
        {/* Header với Avatar và Menu */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 3,
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              gap: 2,
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{
                width: 80,
                height: 80,
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`,
                fontSize: "2rem",
                fontWeight: "bold",
                cursor: "pointer",
                border: "3px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  transform: "scale(1.1) rotate(5deg)",
                  boxShadow: "0 15px 40px rgba(102, 126, 234, 0.5)",
                },
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onClick={handleView}
            >
              {user.displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box
              sx={{
                position: "absolute",
                top: 60,
                left: 55,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background:
                  user.status === UserStatus.Active
                    ? "linear-gradient(45deg, #4caf50, #66bb6a)"
                    : user.status === UserStatus.Pending
                    ? "linear-gradient(45deg, #ff9800, #ffb74d)"
                    : "linear-gradient(45deg, #f44336, #ef5350)",
                border: "3px solid white",
              }}
            />

            <Box
              sx={{
                mb: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  pt: 2,
                  color: "white",
                  fontWeight: 700,
                  mb: 0.5,
                  cursor: "pointer",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  "&:hover": {
                    color: "#42a5f5",
                    textShadow: "0 0 20px rgba(66, 165, 245, 0.6)",
                  },
                  transition: "all 0.3s ease",
                  background: "linear-gradient(45deg, #fff, #e3f2fd)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                onClick={handleView}
              >
                {user.displayName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: 500,
                  display: "inline-block",
                }}
              >
                @{user.username}
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={handleMenuOpen}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              "&:hover": {
                color: "white",
                background: "rgba(255, 255, 255, 0.2)",
                transform: "rotate(90deg)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Role và Status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Chip
            label={user.role}
            color={
              getRoleColor(user.role) as "primary" | "secondary" | "default"
            }
            size="medium"
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              height: 32,
              borderRadius: 4,
              "&.MuiChip-colorPrimary": {
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                color: "white",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              },
              "&.MuiChip-colorSecondary": {
                background: "linear-gradient(45deg, #11998e, #38ef7d)",
                color: "white",
                boxShadow: "0 4px 15px rgba(17, 153, 142, 0.4)",
              },
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(102, 126, 234, 0.6)",
              },
            }}
          />
          <Chip
            label={user.status}
            color={
              getStatusColor(user.status) as
                | "success"
                | "warning"
                | "error"
                | "default"
            }
            size="medium"
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              height: 32,
              borderRadius: 4,
              "&.MuiChip-colorSuccess": {
                background: "linear-gradient(45deg, #4caf50, #66bb6a)",
                color: "white",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
              },
              "&.MuiChip-colorWarning": {
                background: "linear-gradient(45deg, #ff9800, #ffb74d)",
                color: "white",
                boxShadow: "0 4px 15px rgba(255, 152, 0, 0.4)",
              },
              "&.MuiChip-colorError": {
                background: "linear-gradient(45deg, #f44336, #ef5350)",
                color: "white",
                boxShadow: "0 4px 15px rgba(244, 67, 54, 0.4)",
              },
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          />
        </Box>

        {/* Email */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              p: 2,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                textTransform: "uppercase",
                letterSpacing: 1,
                fontWeight: 600,
                mb: 0.5,
                display: "block",
              }}
            >
              Email
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {user.email || "Chưa có email"}
            </Typography>
          </Box>
        </Box>

        {/* Thời gian đăng nhập cuối */}
        <Box sx={{ mt: "auto" }}>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              p: 2,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  fontWeight: 600,
                }}
              >
                Hoạt động gần nhất
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 500,
                mb: 1,
              }}
            >
              {formatDateTime(user.lastLogin)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.4)",
                }}
              />
              Tham gia: {formatDateTime(user.createdAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background:
              "linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))",
            backdropFilter: "blur(25px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 3,
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
            "& .MuiMenuItem-root": {
              color: "white",
              fontWeight: 500,
              borderRadius: 2,
              margin: "4px 8px",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.15)",
                transform: "translateX(8px)",
              },
              transition: "all 0.3s ease",
            },
          },
        }}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1, fontSize: 18 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleChangePassword}>
          <LockResetIcon sx={{ mr: 1, fontSize: 18 }} />
          Đổi mật khẩu
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "#f44336 !important" }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Xóa
        </MenuItem>
      </Menu>
    </Card>
  );
}
