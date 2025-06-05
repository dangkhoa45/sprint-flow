"use client";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
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
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          background: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon />
          <Typography
            variant="h6"
            fontWeight={600}
          >
            Xác nhận xóa người dùng
          </Typography>
        </Box>
        <IconButton
          onClick={onCloseAction}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Warning Message */}
        <Box
          sx={{
            p: 2,
            background: "rgba(255, 107, 107, 0.1)",
            borderRadius: 2,
            border: "1px solid rgba(255, 107, 107, 0.3)",
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <WarningIcon sx={{ color: "#ff6b6b" }} />
          <Typography
            variant="body2"
            color="error"
          >
            <strong>Cảnh báo:</strong> Thao tác này không thể hoàn tác. Tất cả dữ liệu
            liên quan đến người dùng này sẽ bị xóa vĩnh viễn.
          </Typography>
        </Box>

        {/* User Information */}
        <Box
          sx={{
            p: 3,
            background: "rgba(0, 0, 0, 0.02)",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              width: 80,
              height: 80,
              margin: "0 auto 16px auto",
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            {user.displayName.charAt(0).toUpperCase()}
          </Avatar>

          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
          >
            {user.displayName}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
          >
            @{user.username}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
          >
            {user.email}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 2 }}>
            <Chip
              label={user.role}
              color={getRoleColor(user.role) as any}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={user.status}
              color={getStatusColor(user.status) as any}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={2}
          >
            ID: {user._id}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
          >
            Ngày tạo: {new Date(user.createdAt as string).toLocaleString("vi-VN")}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          textAlign="center"
          mt={3}
          fontWeight={500}
        >
          Bạn có chắc chắn muốn xóa người dùng này không?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onCloseAction}
          variant="outlined"
          sx={{
            minWidth: 100,
            borderColor: "#ccc",
            color: "#666",
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          startIcon={<DeleteIcon />}
          sx={{
            minWidth: 120,
            background: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
            "&:hover": {
              background: "linear-gradient(45deg, #ee5a52, #ff6b6b)",
            },
          }}
        >
          Xóa người dùng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
