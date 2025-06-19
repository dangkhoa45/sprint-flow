"use client";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormGroup,
  FormLabel,
  Grid,
  Slider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ProjectPriority, ProjectStatus } from "../../../../types/project";

interface ProjectFiltersProps {
  filters: {
    status?: ProjectStatus[];
    priority?: ProjectPriority[];
    progressRange?: [number, number];
    dateRange?: {
      startDate?: Date | null;
      endDate?: Date | null;
    };
    owner?: string;
    tags?: string[];
    estimatedHoursRange?: [number, number];
  };
  onFiltersChange: (filters: {
    status?: ProjectStatus[];
    priority?: ProjectPriority[];
    progressRange?: [number, number];
    dateRange?: {
      startDate?: Date | null;
      endDate?: Date | null;
    };
    owner?: string;
    tags?: string[];
    estimatedHoursRange?: [number, number];
  }) => void;
}

const ProjectFilters = ({ filters, onFiltersChange }: ProjectFiltersProps) => {
  const theme = useTheme();

  // Sample data - in real app, these would come from API
  const availableTags = [
    "Frontend",
    "Backend",
    "Mobile",
    "API",
    "Database",
    "UI/UX",
    "Testing",
    "DevOps",
    "Analytics",
    "Security",
  ];

  const teamMembers = [
    { id: "1", name: "Nguyễn Văn A", role: "Developer" },
    { id: "2", name: "Trần Thị B", role: "Designer" },
    { id: "3", name: "Lê Văn C", role: "Project Manager" },
    { id: "4", name: "Phạm Thị D", role: "Tester" },
    { id: "5", name: "Hoàng Văn E", role: "DevOps" },
  ];

  const statusOptions = [
    {
      value: ProjectStatus.Planning,
      label: "Lên kế hoạch",
      color: "#2196f3",
      count: 5,
    },
    {
      value: ProjectStatus.InProgress,
      label: "Đang thực hiện",
      color: "#4caf50",
      count: 12,
    },
    {
      value: ProjectStatus.OnHold,
      label: "Tạm dừng",
      color: "#ff9800",
      count: 3,
    },
    {
      value: ProjectStatus.Completed,
      label: "Hoàn thành",
      color: "#8bc34a",
      count: 8,
    },
    {
      value: ProjectStatus.Cancelled,
      label: "Đã hủy",
      color: "#f44336",
      count: 2,
    },
  ];

  const priorityOptions = [
    {
      value: ProjectPriority.Critical,
      label: "Khẩn cấp",
      color: "#d32f2f",
      count: 3,
    },
    { value: ProjectPriority.High, label: "Cao", color: "#f57c00", count: 7 },
    {
      value: ProjectPriority.Medium,
      label: "Trung bình",
      color: "#1976d2",
      count: 15,
    },
    { value: ProjectPriority.Low, label: "Thấp", color: "#388e3c", count: 5 },
  ];

  const handleStatusChange = (status: ProjectStatus, checked: boolean) => {
    const newStatus = checked
      ? [...(filters.status || []), status]
      : filters.status?.filter((s) => s !== status) || [];

    onFiltersChange({
      ...filters,
      status: newStatus.length > 0 ? newStatus : undefined,
    });
  };

  const handlePriorityChange = (
    priority: ProjectPriority,
    checked: boolean
  ) => {
    const newPriority = checked
      ? [...(filters.priority || []), priority]
      : filters.priority?.filter((p) => p !== priority) || [];

    onFiltersChange({
      ...filters,
      priority: newPriority.length > 0 ? newPriority : undefined,
    });
  };

  const handleProgressChange = (_event: Event, newValue: number | number[]) => {
    onFiltersChange({
      ...filters,
      progressRange: newValue as [number, number],
    });
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    date: Date | null
  ) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: date,
      },
    });
  };

  const handleOwnerChange = (_event: any, value: any) => {
    onFiltersChange({
      ...filters,
      owner: value?.id || undefined,
    });
  };

  const handleTagsChange = (_event: any, value: string[]) => {
    onFiltersChange({
      ...filters,
      tags: value.length > 0 ? value : undefined,
    });
  };

  const handleEstimatedHoursChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    onFiltersChange({
      ...filters,
      estimatedHoursRange: newValue as [number, number],
    });
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontSize: "1rem", fontWeight: 600, mb: 3 }}
      >
        Bộ lọc dự án
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Trạng thái
            </FormLabel>
            <FormGroup>
              {statusOptions.map((option) => (
                <Box
                  key={option.value}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 0.5,
                  }}
                >
                  <Checkbox
                    checked={filters.status?.includes(option.value) || false}
                    onChange={(e) =>
                      handleStatusChange(option.value, e.target.checked)
                    }
                    size="small"
                    sx={{
                      p: 0.5,
                      color: option.color,
                      "&.Mui-checked": {
                        color: option.color,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: option.color,
                      mr: 1,
                    }}
                  />
                  <Typography sx={{ fontSize: "0.8rem" }}>
                    {option.label}
                  </Typography>
                </Box>
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Mức độ ưu tiên
            </FormLabel>
            <FormGroup>
              {priorityOptions.map((option) => (
                <Box
                  key={option.value}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 0.5,
                  }}
                >
                  <Checkbox
                    checked={filters.priority?.includes(option.value) || false}
                    onChange={(e) =>
                      handlePriorityChange(option.value, e.target.checked)
                    }
                    size="small"
                    sx={{
                      p: 0.5,
                      color: option.color,
                      "&.Mui-checked": {
                        color: option.color,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: option.color,
                      mr: 1,
                    }}
                  />
                  <Typography sx={{ fontSize: "0.8rem" }}>
                    {option.label}
                  </Typography>
                </Box>
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Tiến độ
            </FormLabel>
            <Slider
              value={filters.progressRange || [0, 100]}
              onChange={handleProgressChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              sx={{
                color: theme.palette.primary.main,
                "& .MuiSlider-thumb": {
                  height: 24,
                  width: 24,
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "inherit",
                  },
                },
                "& .MuiSlider-track": {
                  height: 8,
                },
                "& .MuiSlider-rail": {
                  height: 8,
                  bgcolor: theme.palette.grey[300],
                },
              }}
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Thời gian
            </FormLabel>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="Bắt đầu"
                  value={filters.dateRange?.startDate}
                  onChange={(date) => handleDateChange("startDate", date)}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="Kết thúc"
                  value={filters.dateRange?.endDate}
                  onChange={(date) => handleDateChange("endDate", date)}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Chủ sở hữu
            </FormLabel>
            <Autocomplete
              options={teamMembers}
              getOptionLabel={(option) => option.name}
              onChange={handleOwnerChange}
              renderInput={(params) => <TextField {...params} />}
              sx={{ width: "100%" }}
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Nhãn
            </FormLabel>
            <Autocomplete
              multiple
              options={availableTags}
              onChange={handleTagsChange}
              renderInput={(params) => <TextField {...params} />}
              sx={{ width: "100%" }}
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Giờ ước tính
            </FormLabel>
            <Slider
              value={filters.estimatedHoursRange || [0, 24]}
              onChange={handleEstimatedHoursChange}
              valueLabelDisplay="auto"
              min={0}
              max={24}
              step={0.5}
              sx={{
                color: theme.palette.primary.main,
                "& .MuiSlider-thumb": {
                  height: 24,
                  width: 24,
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "inherit",
                  },
                },
                "& .MuiSlider-track": {
                  height: 8,
                },
                "& .MuiSlider-rail": {
                  height: 8,
                  bgcolor: theme.palette.grey[300],
                },
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectFilters;
