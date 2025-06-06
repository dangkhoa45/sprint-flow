"use client";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterIcon from "@mui/icons-material/FilterList";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
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
import {
  ProjectFilters,
  ProjectPriority,
  ProjectStatus,
} from "../../../../types/project";

interface ProjectsHeaderProps {
  onCreateProjectAction: () => void;
  onFiltersChangeAction: (filters: ProjectFilters) => void;
  filters: ProjectFilters;
}

const statusOptions = [
  {
    value: ProjectStatus.PLANNING,
    label: "Đang lập kế hoạch",
    color: "#2196f3",
  },
  {
    value: ProjectStatus.IN_PROGRESS,
    label: "Đang thực hiện",
    color: "#ff9800",
  },
  { value: ProjectStatus.COMPLETED, label: "Hoàn thành", color: "#4caf50" },
  { value: ProjectStatus.ON_HOLD, label: "Tạm dừng", color: "#9e9e9e" },
  { value: ProjectStatus.CANCELLED, label: "Đã hủy", color: "#f44336" },
];

const priorityOptions = [
  { value: ProjectPriority.LOW, label: "Thấp", color: "#4caf50" },
  { value: ProjectPriority.MEDIUM, label: "Trung bình", color: "#ff9800" },
  { value: ProjectPriority.HIGH, label: "Cao", color: "#ff5722" },
  { value: ProjectPriority.URGENT, label: "Khẩn cấp", color: "#f44336" },
];

export default function ProjectsHeader({
  onCreateProjectAction,
  onFiltersChangeAction,
  filters,
}: ProjectsHeaderProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onFiltersChangeAction({ ...filters, search: value });
  };

  const handleStatusFilter = (status: ProjectStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];

    onFiltersChangeAction({ ...filters, status: newStatuses });
  };

  const handlePriorityFilter = (priority: ProjectPriority) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter((p) => p !== priority)
      : [...currentPriorities, priority];

    onFiltersChangeAction({ ...filters, priority: newPriorities });
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
      {/* Header chính */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleBackToDashboard}
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
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 0.5,
              }}
            >
              Quản lý dự án
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Tạo, theo dõi và quản lý các dự án
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateProjectAction}
          sx={{
            background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
            boxShadow: "0 8px 32px rgba(66, 165, 245, 0.3)",
            borderRadius: 3,
            px: 3,
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
          Tạo dự án mới
        </Button>
      </Box>

      {/* Thanh tìm kiếm và các nút action */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <TextField
          placeholder="Tìm kiếm dự án..."
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

        <Tooltip title="Sắp xếp">
          <IconButton
            sx={{
              color: "white",
              background: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <SortIcon />
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            display: "flex",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={() => setViewMode("grid")}
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
            onClick={() => setViewMode("list")}
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

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: "white", mb: 1, fontWeight: 600 }}
              >
                Độ ưu tiên:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {priorityOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => handlePriorityFilter(option.value)}
                    variant={
                      filters.priority?.includes(option.value)
                        ? "filled"
                        : "outlined"
                    }
                    sx={{
                      color: "white",
                      borderColor: option.color,
                      backgroundColor: filters.priority?.includes(option.value)
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
