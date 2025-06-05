"use client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import LockResetIcon from "@mui/icons-material/LockReset";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import LoadingComponent from "../../../../components/LoadingComponent";
import { User, UserRole, UserStatus } from "../../../../types/user";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import DeleteUserDialog from "../components/DeleteUserDialog";
import EditUserDialog from "../components/EditUserDialog";

const mockUsers: User[] = [
  {
    _id: "1",
    displayName: "Nguyễn Văn A",
    username: "nguyenvana",
    role: UserRole.Admin,
    status: UserStatus.Active,
    email: "nguyenvana@example.com",
    tel: "0123456789",
    createdAt: "2024-01-15T08:30:00.000Z",
    lastLogin: "2024-06-05T10:30:00.000Z",
    avatar: "/uploads/avatars/user1.jpg",
  },
  {
    _id: "2",
    displayName: "Trần Thị B",
    username: "tranthib",
    role: UserRole.User,
    status: UserStatus.Active,
    email: "tranthib@example.com",
    tel: "0987654321",
    createdAt: "2024-02-20T14:15:00.000Z",
    lastLogin: "2024-06-04T16:45:00.000Z",
  },
  {
    _id: "3",
    displayName: "Lê Văn C",
    username: "levanc",
    role: UserRole.User,
    status: UserStatus.Pending,
    email: "levanc@example.com",
    tel: "0369852147",
    createdAt: "2024-03-10T09:20:00.000Z",
  },
  {
    _id: "4",
    displayName: "Phạm Thị D",
    username: "phamthid",
    role: UserRole.User,
    status: UserStatus.Active,
    email: "phamthid@example.com",
    tel: "0912345678",
    createdAt: "2024-03-25T11:00:00.000Z",
    lastLogin: "2024-06-03T09:15:00.000Z",
  },
  {
    _id: "5",
    displayName: "Hoàng Văn E",
    username: "hoangvane",
    role: UserRole.Admin,
    status: UserStatus.Active,
    email: "hoangvane@example.com",
    tel: "0945678901",
    createdAt: "2024-04-01T16:30:00.000Z",
    lastLogin: "2024-06-05T14:20:00.000Z",
  },
  {
    _id: "6",
    displayName: "Đỗ Thị F",
    username: "dothif",
    role: UserRole.User,
    status: UserStatus.Banned,
    email: "dothif@example.com",
    tel: "0987123456",
    createdAt: "2024-04-15T10:45:00.000Z",
    lastLogin: "2024-05-20T08:30:00.000Z",
  },
];

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

const formatDateTime = (dateString?: string) => {
  if (!dateString) return "Chưa có";

  if (typeof window === "undefined") {
    return "Đang tải...";
  }

  try {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Không hợp lệ";
  }
};

interface UserDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailPage({ params }: UserDetailProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate API call
    const timer = setTimeout(() => {
      const foundUser = mockUsers.find((u) => u._id === resolvedParams.id);
      setUser(foundUser || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [resolvedParams.id]);

  const handleEditUser = () => {
    setEditDialogOpen(true);
  };

  const handleDeleteUser = () => {
    setDeleteDialogOpen(true);
  };

  const handleChangePassword = () => {
    setChangePasswordDialogOpen(true);
  };

  const handleEditUserSave = (userData: User) => {
    setUser(userData);
    setEditDialogOpen(false);
    console.log("Updated user:", userData);
  };

  const handleDeleteUserConfirm = () => {
    setDeleteDialogOpen(false);
    router.push("/dashboard/users");
    console.log("Deleted user:", user?._id);
  };

  const handleSavePassword = (userId: string, newPassword: string) => {
    console.log(`Password changed for user ${userId} to ${newPassword}`);
    setChangePasswordDialogOpen(false);
  };

  const handleCloseDialogs = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setChangePasswordDialogOpen(false);
  };

  const handleBackToUsers = () => {
    router.push("/dashboard/users");
  };

  if (loading || !mounted) {
    return <LoadingComponent loadingPage />;
  }

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h5"
            color="error"
            gutterBottom
          >
            Không tìm thấy người dùng
          </Typography>
          <Button
            variant="contained"
            onClick={handleBackToUsers}
            sx={{
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              mt: 2,
            }}
          >
            Quay lại danh sách
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth={false}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 3,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton
              onClick={handleBackToUsers}
              sx={{
                mr: 2,
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #764ba2, #667eea)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 0.5,
                }}
              >
                Chi tiết người dùng
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Thông tin chi tiết của {user.displayName}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditUser}
                sx={{
                  borderColor: "#667eea",
                  color: "#667eea",
                  "&:hover": {
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    color: "white",
                    borderColor: "transparent",
                  },
                }}
              >
                Chỉnh sửa
              </Button>
              <Button
                variant="outlined"
                startIcon={<LockResetIcon />}
                onClick={handleChangePassword}
                sx={{
                  borderColor: "#ff9800",
                  color: "#ff9800",
                  "&:hover": {
                    background: "linear-gradient(45deg, #ffc107, #ff9800)",
                    color: "white",
                    borderColor: "transparent",
                  },
                }}
              >
                Đổi mật khẩu
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteUser}
                sx={{
                  borderColor: "#f44336",
                  color: "#f44336",
                  "&:hover": {
                    background: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
                    color: "white",
                    borderColor: "transparent",
                  },
                }}
              >
                Xóa
              </Button>
            </Box>
          </Box>
        </Paper>

        <Grid
          container
          spacing={3}
        >
          {/* Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 3,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                height: 350
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Avatar
                  src={user.avatar}
                  alt={user.displayName}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    fontSize: "3rem",
                    fontWeight: "bold",
                    border: "4px solid white",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                >
                  {user.displayName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  @{user.username}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 2 }}>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role) as "primary" | "secondary" | "default" | "error" | "info" | "success" | "warning"}
                    sx={{
                      fontWeight: 600,
                      "&.MuiChip-colorPrimary": {
                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                        color: "white",
                      },
                    }}
                  />
                  <Chip
                    label={user.status}
                    color={getStatusColor(user.status) as "primary" | "secondary" | "default" | "error" | "info" | "success" | "warning"}
                    sx={{
                      fontWeight: 600,
                      "&.MuiChip-colorSuccess": {
                        background: "linear-gradient(45deg, #11998e, #38ef7d)",
                        color: "white",
                      },
                      "&.MuiChip-colorWarning": {
                        background: "linear-gradient(45deg, #ffecd2, #fcb69f)",
                        color: "#333",
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Details Card */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 3,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                height: 350
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    mb: 3,
                  }}
                >
                  Thông tin chi tiết
                </Typography>

                <Grid
                  container
                  spacing={3}
                >
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PersonIcon sx={{ mr: 2, color: "#667eea" }} />
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Tên hiển thị
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                        >
                          {user.displayName}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PersonIcon sx={{ mr: 2, color: "#667eea" }} />
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Username
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                        >
                          {user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <EmailIcon sx={{ mr: 2, color: "#667eea" }} />
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Email
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                        >
                          {user.email || "Chưa có"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PhoneIcon sx={{ mr: 2, color: "#667eea" }} />
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Số điện thoại
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                        >
                          {user.tel || "Chưa có"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CalendarTodayIcon sx={{ mr: 2, color: "#667eea" }} />
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Ngày tạo
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                        >
                          {formatDateTime(user.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LoginIcon sx={{ mr: 2, color: "#667eea" }} />
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Đăng nhập cuối
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                        >
                          {formatDateTime(user.lastLogin)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog Components */}
        <EditUserDialog
          open={editDialogOpen}
          onCloseAction={handleCloseDialogs}
          onSaveAction={handleEditUserSave}
          user={user}
        />

        <DeleteUserDialog
          open={deleteDialogOpen}
          onCloseAction={handleCloseDialogs}
          onConfirmAction={handleDeleteUserConfirm}
          user={user}
        />

        <ChangePasswordDialog
          open={changePasswordDialogOpen}
          onCloseAction={handleCloseDialogs}
          onSaveAction={handleSavePassword}
          user={user}
        />
      </Container>
    </Box>
  );
}
