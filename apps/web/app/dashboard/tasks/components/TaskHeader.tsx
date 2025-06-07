"use client";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ViewListIcon from "@mui/icons-material/ViewList";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TaskViewMode } from "../types/task";
import CreateTaskDialog from "./CreateTaskDialog";

interface TaskHeaderProps {
  viewMode: TaskViewMode;
  setViewModeAction: (mode: TaskViewMode) => void;
}

const statusOptions = [
  { value: "TODO", label: "Cần làm", color: "#6b7280" },
  { value: "IN_PROGRESS", label: "Đang thực hiện", color: "#f59e0b" },
  { value: "IN_REVIEW", label: "Đang xem xét", color: "#8b5cf6" },
  { value: "DONE", label: "Hoàn thành", color: "#10b981" },
];

const priorityOptions = [
  { value: "LOW", label: "Thấp", color: "#10b981" },
  { value: "MEDIUM", label: "Trung bình", color: "#f59e0b" },
  { value: "HIGH", label: "Cao", color: "#ef4444" },
  { value: "URGENT", label: "Khẩn cấp", color: "#dc2626" },
];

export default function TaskHeader({
  viewMode,
  setViewModeAction,
}: TaskHeaderProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    status?: string[];
    priority?: string[];
    search?: string;
  }>({});
  const router = useRouter();

  const handleViewModeChange = (mode: TaskViewMode) => {
    setViewModeAction(mode);
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setFilters({ ...filters, search: value });
  };

  const handleStatusFilter = (status: string) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];

    setFilters({ ...filters, status: newStatuses });
  };

  const handlePriorityFilter = (priority: string) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter((p) => p !== priority)
      : [...currentPriorities, priority];

    setFilters({ ...filters, priority: newPriorities });
  };

  const clearFilters = () => {
    setSearchValue("");
    setFilters({});
  };

  return (
    <>
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
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 0.5,
                }}
              >
                Quản lý công việc
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Tạo, phân công và theo dõi tiến độ công việc trong dự án
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
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
            Tạo công việc
          </Button>
        </Box>

        {/* Thanh tìm kiếm và các nút action */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <TextField
            placeholder="Tìm kiếm công việc..."
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
                  borderColor: "#10b981",
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
              <FilterListIcon />
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
              onClick={() => handleViewModeChange("board")}
              sx={{
                color: "white",
                background:
                  viewMode === "board"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                borderRadius: "8px 0 0 8px",
              }}
            >
              <ViewKanbanIcon />
            </IconButton>
            <IconButton
              onClick={() => handleViewModeChange("list")}
              sx={{
                color: "white",
                background:
                  viewMode === "list"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                borderRadius: "0 8px 8px 0",
              }}
            >
              <ViewListIcon />
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
                        backgroundColor: filters.priority?.includes(
                          option.value
                        )
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

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={createDialogOpen}
        onCloseAction={() => setCreateDialogOpen(false)}
      />
    </>
  );
}
