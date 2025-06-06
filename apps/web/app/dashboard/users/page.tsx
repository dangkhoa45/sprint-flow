"use client";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { User, UserFilters, UserRole, UserStats, UserStatus } from "../../../types/user";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import CreateUserDialog from "./components/CreateUserDialog";
import DeleteUserDialog from "./components/DeleteUserDialog";
import EditUserDialog from "./components/EditUserDialog";
import UsersGrid from "./components/UsersGrid";
import UsersHeader from "./components/UsersHeader";
import UsersStats from "./components/UsersStats";

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
  {
    _id: "7",
    displayName: "Vũ Minh G",
    username: "vuminhg",
    role: UserRole.User,
    status: UserStatus.Active,
    email: "vuminhg@example.com",
    tel: "0908765432",
    createdAt: "2024-05-01T12:00:00.000Z",
    lastLogin: "2024-06-05T18:30:00.000Z",
  },
  {
    _id: "8",
    displayName: "Bùi Thị H",
    username: "buithih",
    role: UserRole.User,
    status: UserStatus.Deleted,
    email: "buithih@example.com",
    tel: "0967543210",
    createdAt: "2024-03-05T14:30:00.000Z",
    lastLogin: "2024-04-15T10:20:00.000Z",
  },
];

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: [],
    status: [],
  });

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter users based on current filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = !filters.search || 
        user.displayName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.username.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = !filters.role || filters.role.length === 0 || filters.role.includes(user.role);
      const matchesStatus = !filters.status || filters.status.length === 0 || filters.status.includes(user.status);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, filters]);

  // Calculate user statistics
  const currentStats = useMemo((): UserStats => {
    const total = filteredUsers.length;
    const active = filteredUsers.filter(u => u.status === UserStatus.Active).length;
    const pending = filteredUsers.filter(u => u.status === UserStatus.Pending).length;
    const banned = filteredUsers.filter(u => u.status === UserStatus.Banned).length;
    const admins = filteredUsers.filter(u => u.role === UserRole.Admin).length;
    const regularUsers = filteredUsers.filter(u => u.role === UserRole.User).length;

    return {
      total,
      active,
      pending,
      banned,
      admins,
      users: regularUsers,
    };
  }, [filteredUsers]);

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const handleCreateUser = async (userData: Omit<User, "_id" | "createdAt" | "lastLogin" | "avatar">) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        ...userData,
        _id: (Date.now()).toString(),
        createdAt: new Date().toISOString(),
        lastLogin: "",
        avatar: "",
      };

      setUsers(prev => [...prev, newUser]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (userData: User) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        user._id === userData._id ? userData : user
      ));
      
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (userId: string, newPassword: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Password changed for user ${userId}`);
      setIsChangePasswordDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenChangePasswordDialog = (user: User) => {
    setSelectedUser(user);
    setIsChangePasswordDialogOpen(true);
  };

  const handleViewUser = (user: User) => {
    router.push(`/dashboard/users/${user._id}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 3,
      }}
    >
      <UsersHeader
        onCreateUserAction={() => setIsCreateDialogOpen(true)}
        onFiltersChangeAction={handleFiltersChange}
        onViewModeChange={handleViewModeChange}
        filters={filters}
        viewMode={viewMode}
      />

      <UsersStats stats={currentStats} />

      <UsersGrid
        users={filteredUsers}
        viewMode={viewMode}
        loading={loading}
        onCreateUser={() => setIsCreateDialogOpen(true)}
        onEditUser={handleOpenEditDialog}
        onDeleteUser={handleOpenDeleteDialog}
        onViewUser={handleViewUser}
        onChangePassword={handleOpenChangePasswordDialog}
      />

      <CreateUserDialog
        open={isCreateDialogOpen}
        onCloseAction={() => setIsCreateDialogOpen(false)}
        onSaveAction={handleCreateUser}
      />

      <EditUserDialog
        open={isEditDialogOpen}
        user={selectedUser}
        onCloseAction={() => setIsEditDialogOpen(false)}
        onSaveAction={handleEditUser}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        user={selectedUser}
        onCloseAction={() => setIsDeleteDialogOpen(false)}
        onConfirmAction={handleDeleteUser}
      />

      <ChangePasswordDialog
        open={isChangePasswordDialogOpen}
        user={selectedUser}
        onCloseAction={() => setIsChangePasswordDialogOpen(false)}
        onSaveAction={handleChangePassword}
      />
    </Box>
  );
}
