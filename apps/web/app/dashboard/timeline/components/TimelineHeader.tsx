"use client";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewTimelineIcon from "@mui/icons-material/Timeline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TimelineFilters,
  TimelineEventType,
  TimelineEventPriority,
} from "../../../../types/timeline";

interface TimelineHeaderProps {
  onCreateEventAction: () => void;
  onFiltersChangeAction: (filters: TimelineFilters) => void;
  onViewModeChange?: (mode: "timeline" | "list") => void;
  onRefresh?: () => void;
  filters: TimelineFilters;
  viewMode?: "timeline" | "list";
}

const eventTypeOptions = [
  {
    value: TimelineEventType.PROJECT_CREATED,
    label: "Tạo dự án",
    color: "#2196f3",
  },
  {
    value: TimelineEventType.PROJECT_UPDATED,
    label: "Cập nhật dự án",
    color: "#ff9800",
  },
  {
    value: TimelineEventType.PROJECT_COMPLETED,
    label: "Hoàn thành dự án",
    color: "#4caf50",
  },
  {
    value: TimelineEventType.TASK_CREATED,
    label: "Tạo task",
    color: "#9c27b0",
  },
  {
    value: TimelineEventType.TASK_COMPLETED,
    label: "Hoàn thành task",
    color: "#00bcd4",
  },
  {
    value: TimelineEventType.USER_JOINED,
    label: "Thành viên tham gia",
    color: "#8bc34a",
  },
  {
    value: TimelineEventType.MILESTONE_REACHED,
    label: "Đạt mốc quan trọng",
    color: "#ff5722",
  },
];

const priorityOptions = [
  { value: TimelineEventPriority.LOW, label: "Thấp", color: "#4caf50" },
  { value: TimelineEventPriority.MEDIUM, label: "Trung bình", color: "#ff9800" },
  { value: TimelineEventPriority.HIGH, label: "Cao", color: "#ff5722" },
  { value: TimelineEventPriority.URGENT, label: "Khẩn cấp", color: "#f44336" },
];

export default function TimelineHeader({
  onCreateEventAction,
  onFiltersChangeAction,
  onViewModeChange,
  onRefresh,
  filters,
  viewMode = "timeline",
}: TimelineHeaderProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onFiltersChangeAction({ ...filters, search: value });
  };

  const handleEventTypeFilter = (type: TimelineEventType) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    onFiltersChangeAction({ ...filters, type: newTypes });
  };

  const handlePriorityFilter = (priority: TimelineEventPriority) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter((p) => p !== priority)
      : [...currentPriorities, priority];

    onFiltersChangeAction({ ...filters, priority: newPriorities });
  };

  const handleDateFromChange = (date: Date | null) => {
    onFiltersChangeAction({ ...filters, dateFrom: date || undefined });
  };

  const handleDateToChange = (date: Date | null) => {
    onFiltersChangeAction({ ...filters, dateTo: date || undefined });
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChangeAction({});
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    (filters.type && filters.type.length > 0) ||
    (filters.priority && filters.priority.length > 0) ||
    filters.dateFrom ||
    filters.dateTo
  );

  return (
    <Box sx={{ mb: 3 }}>
      {/* Main Header */}
      <Paper
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 3,
          p: 3,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            <Tooltip title="Quay lại Dashboard">
              <IconButton
                onClick={handleBackToDashboard}
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": { color: "white" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>

            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  mb: 0.5,
                }}
              >
                Timeline
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Theo dõi hoạt động và sự kiện trong dự án
              </Typography>
            </Box>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {/* View Mode Toggle */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && onViewModeChange?.(newMode)}
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                  },
                },
              }}
            >
              <ToggleButton value="timeline">
                <ViewTimelineIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Refresh Button */}
            <Tooltip title="Làm mới">
              <IconButton
                onClick={onRefresh}
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": { color: "white" },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            {/* Filter Toggle */}
            <Tooltip title="Bộ lọc">
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  color: hasActiveFilters ? "#ff9800" : "rgba(255, 255, 255, 0.8)",
                  "&:hover": { color: "white" },
                }}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>

            {/* Create Event Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateEventAction}
              sx={{
                background: "linear-gradient(45deg, #ff6b6b, #ff8e53)",
                "&:hover": {
                  background: "linear-gradient(45deg, #ff5252, #ff7043)",
                },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Tạo sự kiện
            </Button>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm sự kiện, dự án, người dùng..."
            value={searchValue}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "2px solid rgba(255, 255, 255, 0.7)",
                },
                color: "white",
                "& input::placeholder": {
                  color: "rgba(255, 255, 255, 0.5)",
                },
              },
            }}
          />
        </Box>
      </Paper>

      {/* Advanced Filters */}
      <Collapse in={showFilters}>
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 3,
            p: 3,
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "white", mb: 2, fontWeight: 600 }}
          >
            Bộ lọc nâng cao
          </Typography>

          <Grid container spacing={3}>
            {/* Event Type Filter */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1 }}
              >
                Loại sự kiện
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {eventTypeOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => handleEventTypeFilter(option.value)}
                    variant={
                      filters.type?.includes(option.value) ? "filled" : "outlined"
                    }
                    sx={{
                      color: filters.type?.includes(option.value)
                        ? "white"
                        : "rgba(255, 255, 255, 0.8)",
                      borderColor: option.color,
                      backgroundColor: filters.type?.includes(option.value)
                        ? option.color
                        : "transparent",
                      "&:hover": {
                        backgroundColor: filters.type?.includes(option.value)
                          ? `${option.color}CC`
                          : `${option.color}20`,
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Priority Filter */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1 }}
              >
                Mức độ ưu tiên
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {priorityOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => handlePriorityFilter(option.value)}
                    variant={
                      filters.priority?.includes(option.value) ? "filled" : "outlined"
                    }
                    sx={{
                      color: filters.priority?.includes(option.value)
                        ? "white"
                        : "rgba(255, 255, 255, 0.8)",
                      borderColor: option.color,
                      backgroundColor: filters.priority?.includes(option.value)
                        ? option.color
                        : "transparent",
                      "&:hover": {
                        backgroundColor: filters.priority?.includes(option.value)
                          ? `${option.color}CC`
                          : `${option.color}20`,
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Date Range Filter */}
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1 }}
            >
              Khoảng thời gian
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Từ ngày"
                  type="date"
                  value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateFromChange(e.target.value ? new Date(e.target.value) : null)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Đến ngày"
                  type="date"
                  value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateToChange(e.target.value ? new Date(e.target.value) : null)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Filter Actions */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={clearFilters}
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Xóa bộ lọc
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)", mr: 1 }}
            >
              Bộ lọc đang áp dụng:
            </Typography>
            
            {filters.search && (
              <Chip
                label={`Tìm kiếm: "${filters.search}"`}
                size="small"
                onDelete={() => {
                  setSearchValue("");
                  onFiltersChangeAction({ ...filters, search: undefined });
                }}
                sx={{
                  backgroundColor: "rgba(33, 150, 243, 0.2)",
                  color: "white",
                  "& .MuiChip-deleteIcon": { color: "rgba(255, 255, 255, 0.7)" },
                }}
              />
            )}
            
            {filters.type?.map((type) => {
              const option = eventTypeOptions.find(o => o.value === type);
              return option ? (
                <Chip
                  key={type}
                  label={option.label}
                  size="small"
                  onDelete={() => handleEventTypeFilter(type)}
                  sx={{
                    backgroundColor: `${option.color}40`,
                    color: "white",
                    "& .MuiChip-deleteIcon": { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                />
              ) : null;
            })}
            
            {filters.priority?.map((priority) => {
              const option = priorityOptions.find(o => o.value === priority);
              return option ? (
                <Chip
                  key={priority}
                  label={option.label}
                  size="small"
                  onDelete={() => handlePriorityFilter(priority)}
                  sx={{
                    backgroundColor: `${option.color}40`,
                    color: "white",
                    "& .MuiChip-deleteIcon": { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                />
              ) : null;
            })}
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
