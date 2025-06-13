"use client";
import LogoutIcon from "@mui/icons-material/Logout";
import WarningIcon from "@mui/icons-material/Warning";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

interface LogoutConfirmDialogProps {
  open: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void;
  loading?: boolean;
}

export default function LogoutConfirmDialog({
  open,
  onCloseAction,
  onConfirmAction,
  loading = false,
}: LogoutConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 2,
          color: "#f57c00",
        }}
      >
        <WarningIcon sx={{ fontSize: 28 }} />
        <Typography variant="h5" component="div" fontWeight="bold">
          Xác nhận đăng xuất
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
          }}
        >
          <LogoutIcon
            sx={{
              fontSize: 64,
              color: "#f57c00",
              mb: 2,
              opacity: 0.8,
            }}
          />
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Bạn có chắc chắn muốn đăng xuất?
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng hệ thống.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button
          onClick={onCloseAction}
          variant="outlined"
          sx={{
            flex: 1,
            borderColor: "#bdbdbd",
            color: "#757575",
            "&:hover": {
              borderColor: "#9e9e9e",
              backgroundColor: "#f5f5f5",
            },
          }}
          disabled={loading}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={onConfirmAction}
          variant="contained"
          startIcon={<LogoutIcon />}
          sx={{
            flex: 1,
            backgroundColor: "#f57c00",
            "&:hover": {
              backgroundColor: "#ef6c00",
            },
          }}
          disabled={loading}
        >
          {loading ? "Đang đăng xuất..." : "Đăng xuất"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
