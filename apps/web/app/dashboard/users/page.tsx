"use client";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset"; // Import LockResetIcon
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingComponent from "../../../components/LoadingComponent";
import { User, UserRole, UserStatus } from "../../../types/user";
import ChangePasswordDialog from "./components/ChangePasswordDialog"; // Import ChangePasswordDialog
import CreateUserDialog from "./components/CreateUserDialog";
import DeleteUserDialog from "./components/DeleteUserDialog";
import EditUserDialog from "./components/EditUserDialog";

// Mock data for testing - Expanded with more information
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

  // Client-side safe date formatting
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
  } catch{
    return "Không hợp lệ";
  }
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [mounted, setMounted] = useState(false);
  const [roleFilter,] = useState<string>("all");
  const [statusFilter] = useState<string>("all");

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false); // State for ChangePasswordDialog

  useEffect(() => {
    setMounted(true);
    // Simulate loading data
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setEditDialogOpen(true);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setDeleteDialogOpen(true);
    }
  };

  const handleAddUser = () => {
    setCreateDialogOpen(true);
  };

  const handleChangePassword = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setChangePasswordDialogOpen(true);
    }
  };

  const handleViewUserDetail = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  // Dialog handlers
  const handleCreateUser = (userData: User) => {
    // Generate a new ID for the user
    const newUser: User = {
      ...userData,
      _id: (users.length + 1).toString(),
      createdAt: new Date().toISOString(),
      lastLogin: "",
      avatar: "",
    };

    setUsers((prev) => [...prev, newUser]);
    setCreateDialogOpen(false);
    console.log("Created user:", newUser);
  };

  const handleEditUserSave = (userData: User) => {
    setUsers((prev) => prev.map((user) => (user._id === userData._id ? userData : user)));
    setEditDialogOpen(false);
    setSelectedUser(null);
    console.log("Updated user:", userData);
  };

  const handleDeleteUserConfirm = () => {
    if (selectedUser) {
      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      console.log("Deleted user:", selectedUser._id);
    }
  };

  const handleCloseDialogs = () => {
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    setChangePasswordDialogOpen(false); // Close ChangePasswordDialog
  };

  const handleSavePassword = (userId: string, newPassword: string) => {
    // Here you would typically make an API call to update the password
    console.log(`Password changed for user ${userId} to ${newPassword}`);
    // For now, we'll just close the dialog
    setChangePasswordDialogOpen(false);
    setSelectedUser(null);
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (loading || !mounted) {
    return <LoadingComponent loadingPage />;
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
        {/* Header Section with Glass Effect */}
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
          <Toolbar sx={{ px: 0, mb: 2 }}>
            <IconButton
              edge="start"
              onClick={handleBackToDashboard}
              sx={{
                mr: 2,
                ml: -3,
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
                Quản lý người dùng
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Quản lý và theo dõi tất cả người dùng trong hệ thống
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
              sx={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                borderRadius: 2,
                mr: -3,
                px: 3,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  background: "linear-gradient(45deg, #764ba2, #667eea)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(102, 126, 234, 0.5)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Thêm người dùng
            </Button>
          </Toolbar>

          {/* Search Box with Enhanced Design */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo tên, username hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.9)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  },
                  "&.Mui-focused": {
                    background: "rgba(255, 255, 255, 1)",
                    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#667eea" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Stats Cards */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Paper
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {filteredUsers.length}
              </Typography>
              <Typography variant="body2">Tổng người dùng</Typography>
            </Paper>
            <Paper
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {filteredUsers.filter((u) => u.status === UserStatus.Active).length}
              </Typography>
              <Typography variant="body2">Đang hoạt động</Typography>
            </Paper>
            <Paper
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
                background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                color: "#333",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {filteredUsers.filter((u) => u.status === UserStatus.Pending).length}
              </Typography>
              <Typography variant="body2">Chờ duyệt</Typography>
            </Paper>
          </Box>
        </Paper>

        {/* Main Table Container */}
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 3,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    "& .MuiTableCell-head": {
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    },
                  }}
                >
                  <TableCell>Avatar</TableCell>
                  <TableCell>Tên hiển thị</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Đăng nhập cuối</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                    <TableRow
                      key={user._id}
                      hover
                      sx={{
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                        },
                        transition: "all 0.3s ease",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <TableCell>
                        <Avatar
                          src={user.avatar}
                          alt={user.displayName}
                          sx={{
                            width: 50,
                            height: 50,
                            background: `linear-gradient(45deg, ${
                              index % 2 === 0 ? "#667eea, #764ba2" : "#11998e, #38ef7d"
                            })`,
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            border: "3px solid white",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                            cursor: "pointer",
                            "&:hover": {
                              transform: "scale(1.1)",
                              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                            },
                            transition: "all 0.3s ease",
                          }}
                          onClick={() => handleViewUserDetail(user._id)}
                        >
                          {user.displayName.charAt(0).toUpperCase()}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color="text.primary"
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                color: "#667eea",
                                textDecoration: "underline",
                              },
                              transition: "all 0.3s ease",
                            }}
                            onClick={() => handleViewUserDetail(user._id)}
                          >
                            {user.displayName}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Tạo: {formatDateTime(user.createdAt)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.username}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#667eea",
                            color: "#667eea",
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {user.email || "Chưa có"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {user.tel || "Chưa có"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role) as never}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            "&.MuiChip-colorPrimary": {
                              background: "linear-gradient(45deg, #667eea, #764ba2)",
                              color: "white",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={getStatusColor(user.status) as never}
                          size="small"
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
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {formatDateTime(user.lastLogin)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                          <IconButton
                            onClick={() => handleEditUser(user._id)}
                            size="small"
                            sx={{
                              background: "linear-gradient(45deg, #667eea, #764ba2)",
                              color: "white",
                              "&:hover": {
                                background: "linear-gradient(45deg, #764ba2, #667eea)",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleChangePassword(user._id)} // Add this IconButton
                            size="small"
                            sx={{
                              background: "linear-gradient(45deg, #ffc107, #ff9800)", // Example color
                              color: "white",
                              "&:hover": {
                                background: "linear-gradient(45deg, #ff9800, #ffc107)",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <LockResetIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteUser(user._id)}
                            size="small"
                            sx={{
                              background: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
                              color: "white",
                              "&:hover": {
                                background: "linear-gradient(45deg, #ee5a52, #ff6b6b)",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Enhanced Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
              p: 2,
              background: "rgba(102, 126, 234, 0.05)",
              borderRadius: 2,
            }}
          >
            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
              }
              sx={{
                "& .MuiTablePagination-select": {
                  borderRadius: 1,
                  background: "white",
                  border: "1px solid #e0e0e0",
                },
                "& .MuiTablePagination-actions button": {
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  color: "white",
                  borderRadius: 1,
                  mx: 0.5,
                  "&:hover": {
                    background: "linear-gradient(45deg, #764ba2, #667eea)",
                    transform: "scale(1.05)",
                  },
                  "&.Mui-disabled": {
                    background: "#e0e0e0",
                    color: "#999",
                  },
                  transition: "all 0.3s ease",
                },
              }}
            />
          </Box>
        </Paper>

        {/* Dialog Components */}
        <CreateUserDialog
          open={createDialogOpen}
          onCloseAction={handleCloseDialogs}
          onSaveAction={handleCreateUser}
        />

        <EditUserDialog
          open={editDialogOpen}
          onCloseAction={handleCloseDialogs}
          onSaveAction={handleEditUserSave}
          user={selectedUser}
        />

        <DeleteUserDialog
          open={deleteDialogOpen}
          onCloseAction={handleCloseDialogs}
          onConfirmAction={handleDeleteUserConfirm}
          user={selectedUser}
        />
        <ChangePasswordDialog
          open={changePasswordDialogOpen}
          onCloseAction={handleCloseDialogs}
          onSaveAction={handleSavePassword}
          user={selectedUser}
        />
      </Container>
    </Box>
  );
}
