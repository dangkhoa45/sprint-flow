"use client";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { User, UserRole, UserStatus } from "../../../../types/user";

interface EditUserDialogProps {
  open: boolean;
  onCloseAction: () => void;
  onSaveAction: (userData: User) => void;
  user: User | null;
}

export default function EditUserDialog({
  open,
  onCloseAction,
  onSaveAction,
  user,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    email: "",
    tel: "",
    role: UserRole.User,
    status: UserStatus.Active,
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        username: user.username || "",
        email: user.email || "",
        tel: user.tel || "",
        role: user.role || UserRole.User,
        status: user.status || UserStatus.Active,
      });
    }
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Tên hiển thị là bắt buộc";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm() && user) {
      const updatedUser: User = {
        ...user,
        ...formData,
      };
      onSaveAction(updatedUser);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      displayName: "",
      username: "",
      email: "",
      tel: "",
      role: UserRole.User,
      status: UserStatus.Active,
    });
    setErrors({});
    onCloseAction();
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
          background: "linear-gradient(45deg, #667eea, #764ba2)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon />
          <Typography
            variant="h6"
            fontWeight={600}
          >
            Chỉnh sửa người dùng
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid
          container
          spacing={3}
        >
          {/* Avatar Preview */}
          <Grid
            size={{ xs: 12 }}
            display="flex"
            justifyContent="center"
            mb={2}
          >
            <Avatar
              src={user.avatar}
              sx={{
                width: 80,
                height: 80,
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              {formData.displayName.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>

          {/* User ID Info */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 2,
                background: "rgba(102, 126, 234, 0.1)",
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                ID: {user._id}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Ngày tạo: {new Date(user.createdAt as string).toLocaleString("vi-VN")}
              </Typography>
              {user.lastLogin && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Đăng nhập cuối: {new Date(user.lastLogin).toLocaleString("vi-VN")}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Personal Information */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h6"
              gutterBottom
              color="primary"
              fontWeight={600}
            >
              Thông tin cá nhân
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Tên hiển thị"
              value={formData.displayName}
              onChange={(e) => handleChange("displayName", e.target.value)}
              error={!!errors.displayName}
              helperText={errors.displayName}
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.tel}
              onChange={(e) => handleChange("tel", e.target.value)}
              variant="outlined"
            />
          </Grid>

          {/* Account Settings */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h6"
              gutterBottom
              color="primary"
              fontWeight={600}
            >
              Cài đặt tài khoản
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={formData.role}
                label="Vai trò"
                onChange={(e) => handleChange("role", e.target.value)}
              >
                <MenuItem value={UserRole.User}>User</MenuItem>
                <MenuItem value={UserRole.Admin}>Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                label="Trạng thái"
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <MenuItem value={UserStatus.Active}>Active</MenuItem>
                <MenuItem value={UserStatus.Pending}>Pending</MenuItem>
                <MenuItem value={UserStatus.Banned}>Banned</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            minWidth: 100,
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            "&:hover": {
              background: "linear-gradient(45deg, #764ba2, #667eea)",
            },
          }}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}
