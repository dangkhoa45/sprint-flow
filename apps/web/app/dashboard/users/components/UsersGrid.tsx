"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { User } from "../../../../types/user";
import UserCard from "./UserCard";
import UserList from "./UserList";

interface UsersGridProps {
  users: User[];
  viewMode: "grid" | "list";
  loading: boolean;
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onChangePassword: (user: User) => void;
}

const UsersGrid: React.FC<UsersGridProps> = ({
  users,
  viewMode,
  loading,
  onCreateUser,
  onEditUser,
  onDeleteUser,
  onViewUser,
  onChangePassword,
}) => {
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Đang tải dữ liệu...
        </Typography>
      </Paper>
    );
  }

  if (users.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 8,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              color: "white",
              opacity: 0.7,
            }}
          >
            👥
          </Box>

          <Box>
            <Typography
              variant="h5"
              fontWeight="600"
              color="text.primary"
              gutterBottom
            >
              Không tìm thấy người dùng nào
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 400 }}
            >
              Không có người dùng nào phù hợp với bộ lọc hiện tại. Hãy thử điều
              chỉnh các tiêu chí tìm kiếm.
            </Typography>
          </Box>

          <Box
            component="button"
            onClick={onCreateUser}
            sx={{
              px: 4,
              py: 2,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(45deg, #764ba2, #667eea)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 25px rgba(102, 126, 234, 0.4)",
              },
            }}
          >
            + Thêm người dùng đầu tiên
          </Box>
        </Box>
      </Paper>
    );
  }

  if (viewMode === "grid") {
    return (
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={user._id}>
            <UserCard
              user={user}
              onEdit={() => onEditUser(user)}
              onDelete={() => onDeleteUser(user)}
              onView={() => onViewUser(user)}
              onChangePassword={() => onChangePassword(user)}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  // List view
  return (
    <UserList
      users={users}
      onEdit={onEditUser}
      onDelete={onDeleteUser}
      onView={onViewUser}
      onChangePassword={onChangePassword}
    />
  );
};

export default UsersGrid;
