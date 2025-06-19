"use client";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
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
    "Frontend", "Backend", "Mobile", "API", "Database", 
    "UI/UX", "Testing", "DevOps", "Analytics", "Security",
    "React", "Node.js", "Python", "TypeScript", "Docker"
  ];

  const teamMembers = [
    { id: "1", name: "Nguyễn Văn A", role: "Developer" },
    { id: "2", name: "Trần Thị B", role: "Designer" },
    { id: "3", name: "Lê Văn C", role: "Project Manager" },
    { id: "4", name: "Phạm Thị D", role: "Tester" },
    { id: "5", name: "Hoàng Văn E", role: "DevOps" },
  ];

  const statusOptions = [
    { value: ProjectStatus.Planning, label: "Lên kế hoạch", color: "#2196f3", count: 5 },
    { value: ProjectStatus.InProgress, label: "Đang thực hiện", color: "#4caf50", count: 12 },
    { value: ProjectStatus.OnHold, label: "Tạm dừng", color: "#ff9800", count: 3 },
    { value: ProjectStatus.Completed, label: "Hoàn thành", color: "#8bc34a", count: 8 },
    { value: ProjectStatus.Cancelled, label: "Đã hủy", color: "#f44336", count: 2 },
  ];

  const priorityOptions = [
    { value: ProjectPriority.Critical, label: "Khẩn cấp", color: "#d32f2f", count: 3 },
    { value: ProjectPriority.High, label: "Cao", color: "#f57c00", count: 7 },
    { value: ProjectPriority.Medium, label: "Trung bình", color: "#1976d2", count: 15 },
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

  const handlePriorityChange = (priority: ProjectPriority, checked: boolean) => {
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

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | null) => {
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

  const handleEstimatedHoursChange = (_event: Event, newValue: number | number[]) => {
    onFiltersChange({
      ...filters,
      estimatedHoursRange: newValue as [number, number],
    });
  };

  const formatSliderValue = (value: number) => `${value}%`;
  const formatHoursValue = (value: number) => `${value}h`;

  return (
    <Box>
      <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, mb: 3 }}>
        Bộ lọc dự án nâng cao
      </Typography>
      
      <Grid container spacing={3}>
        {/* Status Filter */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel
              component="legend"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 3,
                  height: 16,
                  bgcolor: "primary.main",
                  borderRadius: 1,
                }}
              />
              Trạng thái
            </FormLabel>
            <FormGroup>
              {statusOptions.map((option) => (
                <Box
                  key={option.value}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 0.4,
                    px: 1,
                    borderRadius: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Checkbox
                      checked={filters.status?.includes(option.value) || false}
                      onChange={(e) => handleStatusChange(option.value, e.target.checked)}
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
                      }}
                    />
                    <Typography sx={{ fontSize: "0.8rem" }}>
                      {option.label}
                    </Typography>
                  </Box>
                  <Chip 
                    label={option.count} 
                    size="small" 
                    sx={{ 
                      height: 18, 
                      fontSize: "0.7rem",
                      bgcolor: option.color + "20",
                      color: option.color,
                      border: `1px solid ${option.color}40`,
                    }} 
                  />
                </Box>
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        {/* Priority Filter */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel
              component="legend"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 3,
                  height: 16,
                  bgcolor: "warning.main",
                  borderRadius: 1,
                }}
              />
              Mức độ ưu tiên
            </FormLabel>
            <FormGroup>
              {priorityOptions.map((option) => (
                <Box
                  key={option.value}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 0.4,
                    px: 1,
                    borderRadius: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Checkbox
                      checked={filters.priority?.includes(option.value) || false}
                      onChange={(e) => handlePriorityChange(option.value, e.target.checked)}
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
                      }}
                    />
                    <Typography sx={{ fontSize: "0.8rem" }}>
                      {option.label}
                    </Typography>
                  </Box>
                  <Chip 
                    label={option.count} 
                    size="small" 
                    sx={{ 
                      height: 18, 
                      fontSize: "0.7rem",
                      bgcolor: option.color + "20",
                      color: option.color,
                      border: `1px solid ${option.color}40`,
                    }} 
                  />
                </Box>
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        {/* Progress Range */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 16, color: "success.main" }} />
              Tiến độ ({filters.progressRange?.[0] || 0}% - {filters.progressRange?.[1] || 100}%)
            </FormLabel>
            <Box sx={{ px: 1, py: 2 }}>
              <Slider
                value={filters.progressRange || [0, 100]}
                onChange={handleProgressChange}
                valueLabelDisplay="auto"
                valueLabelFormat={formatSliderValue}
                min={0}
                max={100}
                step={5}
                sx={{
                  color: theme.palette.success.main,
                  "& .MuiSlider-thumb": {
                    height: 20,
                    width: 20,
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "inherit",
                    },
                  },
                  "& .MuiSlider-track": {
                    height: 6,
                  },
                  "& .MuiSlider-rail": {
                    height: 6,
                    bgcolor: theme.palette.grey[300],
                  },
                }}
              />
            </Box>
          </FormControl>
        </Grid>

        {/* Date Range */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 16, color: "info.main" }} />
              Khoảng thời gian
            </FormLabel>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <DatePicker
                label="Từ ngày"
                value={filters.dateRange?.startDate || null}
                onChange={(date) => handleDateChange('startDate', date)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: { "& .MuiInputBase-input": { fontSize: "0.8rem" } },
                  },
                }}
              />
              <DatePicker
                label="Đến ngày"
                value={filters.dateRange?.endDate || null}
                onChange={(date) => handleDateChange('endDate', date)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: { "& .MuiInputBase-input": { fontSize: "0.8rem" } },
                  },
                }}
              />
            </Box>
          </FormControl>
        </Grid>

        {/* Owner Filter */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PersonIcon sx={{ fontSize: 16, color: "secondary.main" }} />
              Chủ sở hữu
            </FormLabel>
            <Autocomplete
              options={teamMembers}
              getOptionLabel={(option) => `${option.name} (${option.role})`}
              value={teamMembers.find(member => member.id === filters.owner) || null}
              onChange={handleOwnerChange}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Chọn chủ sở hữu"
                  size="small"
                  sx={{ "& .MuiInputBase-input": { fontSize: "0.8rem" } }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ fontSize: "0.8rem" }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                      {option.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
                      {option.role}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </FormControl>
        </Grid>

        {/* Tags Filter */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LocalOfferIcon sx={{ fontSize: 16, color: "purple" }} />
              Tags
            </FormLabel>
            <Autocomplete
              multiple
              options={availableTags}
              value={filters.tags || []}
              onChange={handleTagsChange}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Chọn tags"
                  size="small"
                  sx={{ "& .MuiInputBase-input": { fontSize: "0.8rem" } }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      variant="outlined"
                      label={option}
                      size="small"
                      sx={{ 
                        fontSize: "0.7rem", 
                        height: 20,
                        "& .MuiChip-deleteIcon": { fontSize: "0.8rem" }
                      }}
                      {...tagProps}
                    />
                  );
                })
              }
            />
          </FormControl>
        </Grid>

        {/* Estimated Hours Range */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 16, color: "warning.main" }} />
              Thời gian dự kiến ({filters.estimatedHoursRange?.[0] || 0}h - {filters.estimatedHoursRange?.[1] || 200}h)
            </FormLabel>
            <Box sx={{ px: 1, py: 2 }}>
              <Slider
                value={filters.estimatedHoursRange || [0, 200]}
                onChange={handleEstimatedHoursChange}
                valueLabelDisplay="auto"
                valueLabelFormat={formatHoursValue}
                min={0}
                max={500}
                step={10}
                sx={{
                  color: theme.palette.warning.main,
                  "& .MuiSlider-thumb": {
                    height: 20,
                    width: 20,
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "inherit",
                    },
                  },
                  "& .MuiSlider-track": {
                    height: 6,
                  },
                  "& .MuiSlider-rail": {
                    height: 6,
                    bgcolor: theme.palette.grey[300],
                  },
                }}
              />
            </Box>
          </FormControl>
        </Grid>

        {/* Filter Summary */}
        <Grid size={{ xs: 12 }}>
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: theme.palette.grey[50], 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, mb: 1 }}>
              Bộ lọc đang áp dụng:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {filters.status?.map(status => (
                <Chip
                  key={status}
                  label={`Trạng thái: ${statusOptions.find(s => s.value === status)?.label}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
              {filters.priority?.map(priority => (
                <Chip
                  key={priority}
                  label={`Ưu tiên: ${priorityOptions.find(p => p.value === priority)?.label}`}
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
              {filters.progressRange && (
                <Chip
                  label={`Tiến độ: ${filters.progressRange[0]}% - ${filters.progressRange[1]}%`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              )}
              {filters.tags?.map(tag => (
                <Chip
                  key={tag}
                  label={`Tag: ${tag}`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectFilters;
