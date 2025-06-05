"use client";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { User, UserRole, UserStatus } from "../../../../types/user";

interface DeleteUserDialogProps {
  open: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void;
  user: User | null;
}

const getStatusColor = (status: UserStatus) => {
  switch (status) {
    case UserStatus.Active:
      return "success";
    case UserStatus.Pending:
      return "warning";
    case UserStatus.Banned:
      return "error";
    case UserStatus.Deleted:
      return "default";
    default:
      return "default";
  }
};

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case UserRole.Admin:
      return "primary";
    case UserRole.User:
      return "secondary";
    default:
      return "default";
  }
};

export default function DeleteUserDialog({
  open,
  onCloseAction,
  onConfirmAction,
  user,
}: DeleteUserDialogProps) {
  const handleConfirm = () => {
    onConfirmAction();
    onCloseAction();
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(30px)",
          boxShadow: "0 20px 60px rgba(255, 107, 107, 0.15), 0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255, 107, 107, 0.15)",
          overflow: "hidden",
          transform: open ? "scale(1)" : "scale(0.95)",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          background: "rgba(255, 107, 107, 0.08)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          py: 3,
          px: 4,
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(45deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)",
            pointerEvents: "none",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
              Xác nhận xóa người dùng
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.875rem" }}>
              Hành động này không thể hoàn tác!
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onCloseAction}
          sx={{
            color: "white",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            "&:hover": {
              background: "rgba(255,255,255,0.25)",
              transform: "scale(1.1) rotate(90deg)",
            },
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, background: "linear-gradient(180deg, rgba(255, 107, 107, 0.02) 0%, rgba(255,255,255,0.8) 100%)" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            my: 3,
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(238, 90, 82, 0.05) 100%)",
            border: "1.5px solid rgba(255, 107, 107, 0.15)",
            boxShadow: "0 4px 16px rgba(255, 107, 107, 0.08)",
          }}
        >
          <Avatar
            src={user.avatar}
            alt={user.displayName}
            sx={{
              width: 90,
              height: 90,
              mb: 2,
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
              fontSize: "2.2rem",
              fontWeight: "bold",
              border: "4px solid white",
              boxShadow: "0 8px 25px rgba(255, 107, 107, 0.18)",
            }}
          >
            {user.displayName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
            {user.displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {user.email}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <Chip label={user.role} color={getRoleColor(user.role) as "primary" | "secondary" | "default" | "error" | "info" | "success" | "warning"} size="small" sx={{ fontWeight: 600 }} />
            <Chip label={user.status} color={getStatusColor(user.status) as "primary" | "secondary" | "default" | "error" | "info" | "success" | "warning"} size="small" sx={{ fontWeight: 600 }} />
          </Box>
          <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 600, textAlign: "center" }}>
            Bạn có chắc chắn muốn xóa người dùng này?<br />
            <span style={{ color: '#ee5a52', fontWeight: 700 }}>Tất cả dữ liệu liên quan sẽ bị mất vĩnh viễn.</span>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 2, justifyContent: "center" }}>
        <Button
          onClick={onCloseAction}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            minWidth: 120,
            background: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
            color: "white",
            fontWeight: 700,
            boxShadow: "0 4px 16px rgba(255, 107, 107, 0.18)",
            "&:hover": {
              background: "linear-gradient(45deg, #ee5a52, #ff6b6b)",
              color: "white",
              transform: "scale(1.05)",
            },
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          Xác nhận xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
