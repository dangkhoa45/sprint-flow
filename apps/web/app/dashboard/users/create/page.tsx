"use client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { UserRole, UserStatus } from "../../../../types/user";

export default function CreateUserPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());

    try {
      // TODO: Implement API call to create user
      console.log("Creating user:", userData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Người dùng đã được tạo thành công!");

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/users");
      }, 2000);
    } catch (err) {
      setError("Có lỗi xảy ra khi tạo người dùng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard/users");
  };

  return (
    <Container
      maxWidth="md"
      sx={{ py: 4 }}
    >
      <Paper
        elevation={3}
        sx={{ p: 3 }}
      >
        <Toolbar sx={{ px: 0, mb: 3 }}>
          <IconButton
            edge="start"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 600 }}
          >
            Thêm người dùng mới
          </Typography>
        </Toolbar>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
          >
            {success}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <Grid
                container
                spacing={3}
              >
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                  >
                    Thông tin cơ bản
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    required
                    fullWidth
                    name="displayName"
                    label="Tên hiển thị"
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    required
                    fullWidth
                    name="username"
                    label="Tên đăng nhập"
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    name="tel"
                    label="Số điện thoại"
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControl
                    fullWidth
                    required
                  >
                    <InputLabel>Mật khẩu</InputLabel>
                    <OutlinedInput
                      name="password"
                      type={showPassword ? "text" : "password"}
                      label="Mật khẩu"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mt: 2 }}
                  >
                    Phân quyền & Trạng thái
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <FormControl
                    fullWidth
                    required
                  >
                    <InputLabel>Vai trò</InputLabel>
                    <Select
                      name="role"
                      label="Vai trò"
                      defaultValue={UserRole.User}
                    >
                      <MenuItem value={UserRole.Admin}>Quản trị viên</MenuItem>
                      <MenuItem value={UserRole.User}>Người dùng</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <FormControl
                    fullWidth
                    required
                  >
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      name="status"
                      label="Trạng thái"
                      defaultValue={UserStatus.Active}
                    >
                      <MenuItem value={UserStatus.Active}>Hoạt động</MenuItem>
                      <MenuItem value={UserStatus.Pending}>Chờ duyệt</MenuItem>
                      <MenuItem value={UserStatus.Banned}>Bị cấm</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mt: 2 }}
                  >
                    Thông tin bổ sung
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    name="address"
                    label="Địa chỉ"
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    name="bankAccount"
                    label="Số tài khoản ngân hàng"
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    name="bankName"
                    label="Tên ngân hàng"
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                      sx={{ bgcolor: "#1976d2" }}
                    >
                      {loading ? "Đang tạo..." : "Tạo người dùng"}
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
