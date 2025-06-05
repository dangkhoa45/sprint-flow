"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { User } from "../types/user";

interface DeleteUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (userId: string) => void;
  loading?: boolean;
}

export default function DeleteUserDialog({
  open,
  user,
  onClose,
  onConfirm,
  loading = false,
}: DeleteUserDialogProps) {
  const handleConfirm = () => {
    if (user) {
      onConfirm(user._id);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <WarningIcon color="error" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h5" component="div" fontWeight={600}>
          Xác nhận xóa người dùng
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", px: 3 }}>
        {user && (
          <Box>
            <Avatar
              src={user.avatar}
              alt={user.displayName}
              sx={{ width: 64, height: 64, mx: "auto", mb: 2 }}
            >
              {user.displayName.charAt(0).toUpperCase()}
            </Avatar>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              Bạn có chắc chắn muốn xóa người dùng
            </Typography>
            
            <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
              {user.displayName}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              (@{user.username})
            </Typography>
            
            <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
              Hành động này không thể hoàn tác!
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {loading ? "Đang xóa..." : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
