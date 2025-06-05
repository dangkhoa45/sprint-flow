"use client";
import CloseIcon from "@mui/icons-material/Close";
import LockResetIcon from "@mui/icons-material/LockReset";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { User } from "../../../../types/user";

interface ChangePasswordDialogProps {
  open: boolean;
  onCloseAction: () => void;
  onSaveAction: (userId: string, newPassword: string) => void;
  user: User | null;
}

export default function ChangePasswordDialog({
  open,
  onCloseAction,
  onSaveAction,
  user,
}: ChangePasswordDialogProps) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Reset form when dialog opens or user changes
    if (open) {
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  }, [open, user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới là bắt buộc";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm() && user) {
      onSaveAction(user._id, formData.newPassword);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    onCloseAction();
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(30px)",
          boxShadow:
            "0 20px 60px rgba(102, 126, 234, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          overflow: "hidden",
          transform: open ? "scale(1)" : "scale(0.9)",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          background: "rgba(102, 126, 234, 0.1)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          py: 3,
          px: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 3s ease infinite",
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
            background:
              "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
            pointerEvents: "none",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <LockResetIcon sx={{ fontSize: "2rem" }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 700 }}
          >
            Đổi mật khẩu cho {user.displayName}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: "white",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.25)",
              transform: "scale(1.1) rotate(90deg)",
            },
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 4,
          background:
            "linear-gradient(180deg, rgba(102, 126, 234, 0.02) 0%, rgba(255, 255, 255, 0.8) 100%)",
        }}
      >
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="Mật khẩu mới"
            type="password"
            id="newPassword"
            autoComplete="new-password"
            value={formData.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2, justifyContent: "flex-end" }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "#764ba2",
            color: "#764ba2",
            "&:hover": {
              borderColor: "#667eea",
              background: "rgba(102, 126, 234, 0.05)",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            color: "white",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #764ba2, #667eea)",
              transform: "translateY(-1px)",
              boxShadow: "0 6px 15px rgba(102, 126, 234, 0.4)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
