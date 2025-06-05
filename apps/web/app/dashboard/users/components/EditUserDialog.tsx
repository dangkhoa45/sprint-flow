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

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleChange = (field: string, value: string | UserRole | UserStatus) => {
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
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(30px)",
          boxShadow: "0 20px 60px rgba(102, 126, 234, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1)",
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
            background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
            pointerEvents: "none",
          },
          "@keyframes gradientShift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ mb: 0.5 }}
            >
              Chỉnh sửa người dùng
            </Typography>
            <Typography
              variant="body2"
              sx={{ opacity: 0.9, fontSize: "0.875rem" }}
            >
              Cập nhật thông tin tài khoản
            </Typography>
          </Box>
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
          background: "linear-gradient(180deg, rgba(102, 126, 234, 0.02) 0%, rgba(255, 255, 255, 0.8) 100%)",
        }}
      >
        {/* Avatar Preview Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 4,
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
            border: "2px dashed rgba(102, 126, 234, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)",
              border: "2px dashed rgba(102, 126, 234, 0.4)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontSize: "2rem",
                fontWeight: "bold",
                border: "4px solid white",
                boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
              }}
            >
              {formData.displayName.charAt(0).toUpperCase() || "?"}
            </Avatar>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Avatar sẽ được tạo tự động từ tên hiển thị
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Personal Information Section */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                border: "1px solid rgba(102, 126, 234, 0.1)",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                👤 Thông tin cá nhân
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Tên hiển thị"
                    value={formData.displayName}
                    onChange={(e) => handleChange("displayName", e.target.value)}
                    error={!!errors.displayName}
                    helperText={errors.displayName}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 1)",
                        },
                        "&.Mui-focused": {
                          background: "rgba(255, 255, 255, 1)",
                          boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                        },
                      },
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 1)",
                        },
                        "&.Mui-focused": {
                          background: "rgba(255, 255, 255, 1)",
                          boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                        },
                      },
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 1)",
                        },
                        "&.Mui-focused": {
                          background: "rgba(255, 255, 255, 1)",
                          boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={formData.tel}
                    onChange={(e) => handleChange("tel", e.target.value)}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 1)",
                        },
                        "&.Mui-focused": {
                          background: "rgba(255, 255, 255, 1)",
                          boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* Account Settings Section */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, rgba(17, 153, 142, 0.05) 0%, rgba(56, 239, 125, 0.05) 100%)",
                border: "1px solid rgba(17, 153, 142, 0.1)",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #11998e, #38ef7d)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                ⚙️ Cài đặt tài khoản
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Vai trò</InputLabel>
                    <Select
                      value={formData.role}
                      label="Vai trò"
                      onChange={(e) => handleChange("role", e.target.value)}
                      sx={{
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 1)",
                        },
                        "&.Mui-focused": {
                          background: "rgba(255, 255, 255, 1)",
                          boxShadow: "0 0 0 3px rgba(17, 153, 142, 0.1)",
                        },
                      }}
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
                      sx={{
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 1)",
                        },
                        "&.Mui-focused": {
                          background: "rgba(255, 255, 255, 1)",
                          boxShadow: "0 0 0 3px rgba(17, 153, 142, 0.1)",
                        },
                      }}
                    >
                      <MenuItem value={UserStatus.Active}>Active</MenuItem>
                      <MenuItem value={UserStatus.Pending}>Pending</MenuItem>
                      <MenuItem value={UserStatus.Banned}>Banned</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
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
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
