"use client";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
import { useState } from "react";
import LoadingComponent from "../../../components/LoadingComponent";
import { User, UserRole, UserStatus } from "../../../types/user";

// Mock data for testing
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
  return new Date(dateString).toLocaleString("vi-VN");
};

export default function UsersPage() {
  const router = useRouter();
  const [users] = useState<User[]>(mockUsers);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditUser = (userId: string) => {
    router.push(`/dashboard/users/edit/${userId}`);
  };

  const handleDeleteUser = (userId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete user:", userId);
  };

  const handleAddUser = () => {
    router.push("/dashboard/users/create");
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return <LoadingComponent loadingPage />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Toolbar sx={{ px: 0, mb: 3 }}>
          <IconButton
            edge="start"
            onClick={handleBackToDashboard}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Quản lý người dùng
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            sx={{ bgcolor: "#1976d2" }}
          >
            Thêm người dùng
          </Button>
        </Toolbar>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm theo tên, username hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
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
                .map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Avatar
                        src={user.avatar}
                        alt={user.displayName}
                        sx={{ width: 40, height: 40 }}
                      >
                        {user.displayName.charAt(0).toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight={500}>
                        {user.displayName}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email || "Chưa có"}</TableCell>
                    <TableCell>{user.tel || "Chưa có"}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDateTime(user.lastLogin)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditUser(user._id)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteUser(user._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

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
        />
      </Paper>
    </Container>
  );
}
