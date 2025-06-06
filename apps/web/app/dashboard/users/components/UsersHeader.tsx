"use client";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterIcon from "@mui/icons-material/FilterList";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { UserFilters, UserRole, UserStatus } from "../../../../types/user";

interface UsersHeaderProps {
  onCreateUserAction: () => void;
  onFiltersChangeAction: (filters: UserFilters) => void;
  onViewModeChange?: (mode: "grid" | "list") => void;
  filters: UserFilters;
  viewMode?: "grid" | "list";
}

const roleOptions = [
  { value: UserRole.Admin, label: "Quản trị viên", color: "#1976d2" },
  { value: UserRole.User, label: "Người dùng", color: "#388e3c" },
];

const statusOptions = [
  { value: UserStatus.Active, label: "Hoạt động", color: "#2e7d32" },
  { value: UserStatus.Pending, label: "Chờ duyệt", color: "#f57c00" },
  { value: UserStatus.Banned, label: "Bị cấm", color: "#d32f2f" },
  { value: UserStatus.Deleted, label: "Đã xóa", color: "#616161" },
];

export default function UsersHeader({
  onCreateUserAction,
  onFiltersChangeAction,
  onViewModeChange,
  filters,
  viewMode = "list",
}: UsersHeaderProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onFiltersChangeAction({ ...filters, search: value });
  };

  const handleRoleFilter = (role: UserRole) => {
    const currentRoles = filters.role || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];

    onFiltersChangeAction({ ...filters, role: newRoles });
  };

  const handleStatusFilter = (status: UserStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];

    onFiltersChangeAction({ ...filters, status: newStatuses });
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChangeAction({});
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 4,
        p: 3,
        mb: 3,
      }}
    >
      {/* Header với tiêu đề và nút quay lại */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={handleBackToDashboard}
          sx={{
            mr: 2,
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Quản lý người dùng
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            Quản lý và theo dõi tất cả người dùng trong hệ thống
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateUserAction}
          sx={{
            background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
            boxShadow: "0 8px 32px rgba(66, 165, 245, 0.3)",
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 40px rgba(66, 165, 245, 0.4)",
            },
          }}
        >
          Thêm người dùng
        </Button>
      </Box>

      {/* Thanh tìm kiếm và các nút action */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <TextField
          placeholder="Tìm kiếm người dùng..."
          value={searchValue}
          onChange={handleSearchChange}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 3,
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#42a5f5",
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
              "&::placeholder": {
                color: "rgba(255, 255, 255, 0.7)",
                opacity: 1,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
              </InputAdornment>
            ),
          }}
        />

        <Tooltip title="Bộ lọc">
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              color: "white",
              background: showFilters
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <FilterIcon />
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            display: "flex",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={() => onViewModeChange?.("grid")}
            sx={{
              color: "white",
              background:
                viewMode === "grid"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
              borderRadius: "8px 0 0 8px",
            }}
          >
            <GridViewIcon />
          </IconButton>
          <IconButton
            onClick={() => onViewModeChange?.("list")}
            sx={{
              color: "white",
              background:
                viewMode === "list"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
              borderRadius: "0 8px 8px 0",
            }}
          >
            <ViewListOutlinedIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Bộ lọc nâng cao */}
      {showFilters && (
        <Box sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)", pt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: "white", mb: 1, fontWeight: 600 }}
              >
                Vai trò:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {roleOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => handleRoleFilter(option.value)}
                    variant={
                      filters.role?.includes(option.value)
                        ? "filled"
                        : "outlined"
                    }
                    sx={{
                      color: "white",
                      borderColor: option.color,
                      backgroundColor: filters.role?.includes(option.value)
                        ? option.color
                        : "transparent",
                      "&:hover": {
                        backgroundColor: `${option.color}20`,
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: "white", mb: 1, fontWeight: 600 }}
              >
                Trạng thái:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {statusOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => handleStatusFilter(option.value)}
                    variant={
                      filters.status?.includes(option.value)
                        ? "filled"
                        : "outlined"
                    }
                    sx={{
                      color: "white",
                      borderColor: option.color,
                      backgroundColor: filters.status?.includes(option.value)
                        ? option.color
                        : "transparent",
                      "&:hover": {
                        backgroundColor: `${option.color}20`,
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                size="small"
                onClick={clearFilters}
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Xóa bộ lọc
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </Paper>
  );
}
