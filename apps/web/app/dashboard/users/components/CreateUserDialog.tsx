"use client";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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
import { useState } from "react";
import { UserRole, UserStatus } from "../../../../types/user";

interface CreateUserDialogProps {
  open: boolean;
  onCloseAction: () => void;
  onSaveAction: (userData: any) => void;
}

export default function CreateUserDialog({
  open,
  onCloseAction,
  onSaveAction,
}: CreateUserDialogProps) {
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    email: "",
    tel: "",
    role: UserRole.User,
    status: UserStatus.Active,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

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

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const userData = {
        ...formData,
        _id: Date.now().toString(), // Temporary ID
        createdAt: new Date().toISOString(),
        lastLogin: null,
      };
      onSaveAction(userData);
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
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    onCloseAction();
  };

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
          <PersonAddIcon />
          <Typography
            variant="h6"
            fontWeight={600}
          >
            Thêm người dùng mới
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
              sx={{
                width: 80,
                height: 80,
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              {formData.displayName.charAt(0).toUpperCase() || "?"}
            </Avatar>
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

          <Grid size={{ xs: 12, md: 6 }}>
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

          <Grid size={{ xs: 12, md: 6 }}>
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

          <Grid size={{ xs: 12, md: 6 }}>
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

          <Grid size={{ xs: 12, md: 6 }}>
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

          <Grid size={{ xs: 12, md: 6 }}>
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

          <Grid size={{ xs: 12, md: 6 }}>
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

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              variant="outlined"
            />
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
          Tạo người dùng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
