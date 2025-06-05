"use client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import LoadingComponent from "../../../../../components/LoadingComponent";
import { User, UserRole, UserStatus } from "../../../../../types/user";

// Mock data for testing
const mockUser: User = {
  _id: "1",
  displayName: "Nguyễn Văn A",
  username: "nguyenvana",
  role: UserRole.Admin,
  status: UserStatus.Active,
  email: "nguyenvana@example.com",
  tel: "0123456789",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  bankAccount: "123456789",
  bankName: "Vietcombank",
  bankCode: "VCB",
  createdAt: "2024-01-15T08:30:00.000Z",
  lastLogin: "2024-06-05T10:30:00.000Z",
  avatar: "/uploads/avatars/user1.jpg",
};

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const resolvedParams = await params;
        const userId = resolvedParams.id;
        
        // TODO: Replace with actual API call
        // const userData = await fetchUser(userId);
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUser(mockUser);
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [params]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());

    try {
      // TODO: Implement API call to update user
      console.log("Updating user:", userData);
      
      // If avatar file is selected, upload it first
      if (avatarFile) {
        console.log("Uploading avatar:", avatarFile);
        // TODO: Upload avatar API call
      }
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess("Thông tin người dùng đã được cập nhật thành công!");
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard/users");
  };

  if (loading) {
    return <LoadingComponent loadingPage />;
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy thông tin người dùng.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Toolbar sx={{ px: 0, mb: 3 }}>
          <IconButton edge="start" onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Chỉnh sửa người dùng
          </Typography>
        </Toolbar>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>
                    Avatar
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={avatarPreview || user.avatar}
                      alt={user.displayName}
                      sx={{ width: 80, height: 80 }}
                    >
                      {user.displayName.charAt(0).toUpperCase()}
                    </Avatar>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="avatar-upload"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <label htmlFor="avatar-upload">
                      <IconButton
                        color="primary"
                        aria-label="upload avatar"
                        component="span"
                      >
                        <PhotoCameraIcon />
                      </IconButton>
                    </label>
                  </Box>
                </Grid>

                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin cơ bản
                  </Typography>
                </Grid>

                <Grid size={6}>
                  <TextField
                    required
                    fullWidth
                    name="displayName"
                    label="Tên hiển thị"
                    variant="outlined"
                    defaultValue={user.displayName}
                  />
                </Grid>

                <Grid size={6}>
                  <TextField
                    required
                    fullWidth
                    name="username"
                    label="Tên đăng nhập"
                    variant="outlined"
                    defaultValue={user.username}
                    disabled
                  />
                </Grid>

                <Grid size={6}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    defaultValue={user.email}
                  />
                </Grid>

                <Grid size={6}>
                  <TextField
                    fullWidth
                    name="tel"
                    label="Số điện thoại"
                    variant="outlined"
                    defaultValue={user.tel}
                  />
                </Grid>

                <Grid size={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Phân quyền & Trạng thái
                  </Typography>
                </Grid>

                <Grid size={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Vai trò</InputLabel>
                    <Select
                      name="role"
                      label="Vai trò"
                      defaultValue={user.role}
                    >
                      <MenuItem value={UserRole.Admin}>Quản trị viên</MenuItem>
                      <MenuItem value={UserRole.User}>Người dùng</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      name="status"
                      label="Trạng thái"
                      defaultValue={user.status}
                    >
                      <MenuItem value={UserStatus.Active}>Hoạt động</MenuItem>
                      <MenuItem value={UserStatus.Pending}>Chờ duyệt</MenuItem>
                      <MenuItem value={UserStatus.Banned}>Bị cấm</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Thông tin bổ sung
                  </Typography>
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    name="address"
                    label="Địa chỉ"
                    variant="outlined"
                    multiline
                    rows={2}
                    defaultValue={user.address}
                  />
                </Grid>

                <Grid size={6}>
                  <TextField
                    fullWidth
                    name="bankAccount"
                    label="Số tài khoản ngân hàng"
                    variant="outlined"
                    defaultValue={user.bankAccount}
                  />
                </Grid>

                <Grid size={6}>
                  <TextField
                    fullWidth
                    name="bankName"
                    label="Tên ngân hàng"
                    variant="outlined"
                    defaultValue={user.bankName}
                  />
                </Grid>

                <Grid size={12}>
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={saving}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={saving}
                      sx={{ bgcolor: "#1976d2" }}
                    >
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
}
