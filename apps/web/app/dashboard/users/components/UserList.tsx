"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewIcon from "@mui/icons-material/Visibility";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { User, UserRole, UserStatus } from "../../../../types/user";

interface UserListProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onView?: (user: User) => void;
  onChangePassword?: (user: User) => void;
}

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

const formatDateTime = (dateString?: string) => {
  if (!dateString) return "Chưa có";

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

export default function UserList({
  users,
  onEdit,
  onDelete,
  onView,
  onChangePassword,
}: UserListProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Calculate pagination data
  const totalUsers = users.length;
  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalUsers);
  const currentPageUsers = users.slice(startIndex, endIndex);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = () => {
    if (selectedUser) {
      onEdit?.(selectedUser);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedUser) {
      onDelete?.(selectedUser);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedUser) {
      onView?.(selectedUser);
    }
    handleMenuClose();
  };

  const handleChangePassword = () => {
    if (selectedUser) {
      onChangePassword?.(selectedUser);
    }
    handleMenuClose();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                "& .MuiTableCell-head": {
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  border: "none",
                },
              }}
            >
              <TableCell>Người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Đăng nhập cuối</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageUsers.map((user, index) => (
                <TableRow
                  key={user._id}
                  hover
                  sx={{
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.05)",
                    },
                    transition: "all 0.3s ease",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                    "& .MuiTableCell-root": {
                      border: "none",
                      color: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  {/* Avatar và thông tin cơ bản */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                          transition: "transform 0.3s ease",
                        }}
                        onClick={() => onView?.(user)}
                      >
                        {user.displayName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          sx={{
                            color: "white",
                            cursor: "pointer",
                            "&:hover": {
                              color: "#42a5f5",
                              textDecoration: "underline",
                            },
                            transition: "all 0.3s ease",
                          }}
                          onClick={() => onView?.(user)}
                        >
                          {user.displayName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            display: "block",
                          }}
                        >
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      {user.email || "Chưa có"}
                    </Typography>
                  </TableCell>

                  {/* Số điện thoại */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      {user.tel || "Chưa có"}
                    </Typography>
                  </TableCell>

                  {/* Vai trò */}
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role) as "primary" | "secondary" | "default"}
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

                  {/* Trạng thái */}
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={getStatusColor(user.status) as "success" | "warning" | "error" | "default"}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        "&.MuiChip-colorSuccess": {
                          background: "linear-gradient(45deg, #4caf50, #66bb6a)",
                          color: "white",
                        },
                        "&.MuiChip-colorWarning": {
                          background: "linear-gradient(45deg, #ff9800, #ffb74d)",
                          color: "white",
                        },
                        "&.MuiChip-colorError": {
                          background: "linear-gradient(45deg, #f44336, #ef5350)",
                          color: "white",
                        },
                      }}
                    />
                  </TableCell>

                  {/* Đăng nhập cuối */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {formatDateTime(user.lastLogin)}
                    </Typography>
                  </TableCell>

                  {/* Thao tác */}
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                      <IconButton
                        onClick={() => onEdit?.(user)}
                        size="small"
                        sx={{
                          background: "rgba(66, 165, 245, 0.2)",
                          color: "#42a5f5",
                          "&:hover": {
                            background: "rgba(66, 165, 245, 0.3)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => onChangePassword?.(user)}
                        size="small"
                        sx={{
                          background: "rgba(255, 152, 0, 0.2)",
                          color: "#ff9800",
                          "&:hover": {
                            background: "rgba(255, 152, 0, 0.3)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <LockResetIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, user)}
                        size="small"
                        sx={{
                          background: "rgba(255, 255, 255, 0.1)",
                          color: "rgba(255, 255, 255, 0.7)",
                          "&:hover": {
                            background: "rgba(255, 255, 255, 0.2)",
                            color: "white",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 2,
          background: "rgba(255, 255, 255, 0.05)",
        }}
      >
        <TablePagination
          component="div"
          count={totalUsers}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 25, 50]}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
          sx={{
            color: "white",
            "& .MuiTablePagination-select": {
              color: "white",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 1,
            },
            "& .MuiTablePagination-actions button": {
              color: "white",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
              },
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              color: "rgba(255, 255, 255, 0.8)",
            },
          }}
        />
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 2,
            "& .MuiMenuItem-root": {
              color: "white",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1, fontSize: 18 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleChangePassword}>
          <LockResetIcon sx={{ mr: 1, fontSize: 18 }} />
          Đổi mật khẩu
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "#f44336 !important" }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Xóa
        </MenuItem>
      </Menu>
    </Paper>
  );
}
