"use client";
import ClearIcon from "@mui/icons-material/Clear";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ProjectQueryDto, ProjectStatus, ProjectPriority } from "../../../../types/project";

interface ProjectsFiltersProps {
  filters: Partial<ProjectQueryDto>;
  onChangeAction: (filters: Partial<ProjectQueryDto>) => void;
}

const statusOptions = [
  { value: ProjectStatus.Planning, label: "Lên kế hoạch" },
  { value: ProjectStatus.InProgress, label: "Đang thực hiện" },
  { value: ProjectStatus.OnHold, label: "Tạm dừng" },
  { value: ProjectStatus.Completed, label: "Hoàn thành" },
  { value: ProjectStatus.Cancelled, label: "Đã hủy" },
];

const priorityOptions = [
  { value: ProjectPriority.Low, label: "Thấp" },
  { value: ProjectPriority.Medium, label: "Trung bình" },
  { value: ProjectPriority.High, label: "Cao" },
  { value: ProjectPriority.Critical, label: "Khẩn cấp" },
];

function ProjectsFilters({ filters, onChangeAction }: ProjectsFiltersProps) {
  const handleFilterChange = (field: keyof ProjectQueryDto) => (
    event: SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    onChangeAction({
      ...filters,
      [field]: value === "" ? undefined : value,
    });
  };

  const handleDateChange = (field: keyof ProjectQueryDto) => (
    date: Date | null
  ) => {
    onChangeAction({
      ...filters,
      [field]: date ? date.toISOString() : undefined,
    });
  };

  const clearAllFilters = () => {
    onChangeAction({
      status: undefined,
      priority: undefined,
      startDateFrom: undefined,
      startDateTo: undefined,
      endDateFrom: undefined,
      endDateTo: undefined,
      tags: undefined,
    });
  };

  const getActiveFiltersCount = () => {
    const activeFields = [
      'status',
      'priority', 
      'startDateFrom',
      'startDateTo',
      'endDateFrom',
      'endDateTo',
      'tags'
    ];
    return activeFields.filter(field => filters[field as keyof ProjectQueryDto]).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Bộ lọc
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} bộ lọc đang áp dụng`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={clearAllFilters}
            disabled={activeFiltersCount === 0}
            sx={{ textTransform: "none" }}
          >
            Xóa tất cả
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Status Filter */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filters.status || ""}
              label="Trạng thái"
              onChange={handleFilterChange("status")}
            >
              <MenuItem value="">
                <em>Tất cả</em>
              </MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Priority Filter */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Độ ưu tiên</InputLabel>
            <Select
              value={filters.priority || ""}
              label="Độ ưu tiên"
              onChange={handleFilterChange("priority")}
            >
              <MenuItem value="">
                <em>Tất cả</em>
              </MenuItem>
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Start Date From */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Bắt đầu từ"
              value={filters.startDateFrom ? new Date(filters.startDateFrom) : null}
              onChange={handleDateChange("startDateFrom")}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Start Date To */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Bắt đầu đến"
              value={filters.startDateTo ? new Date(filters.startDateTo) : null}
              onChange={handleDateChange("startDateTo")}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* End Date From */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Kết thúc từ"
              value={filters.endDateFrom ? new Date(filters.endDateFrom) : null}
              onChange={handleDateChange("endDateFrom")}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* End Date To */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Kết thúc đến"
              value={filters.endDateTo ? new Date(filters.endDateTo) : null}
              onChange={handleDateChange("endDateTo")}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <Box sx={{ mt: 3, pt: 2, borderTop: theme => `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
            Bộ lọc đang áp dụng:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {filters.status && (
              <Chip
                label={`Trạng thái: ${statusOptions.find(s => s.value === filters.status)?.label}`}
                size="small"
                onDelete={() => onChangeAction({ ...filters, status: undefined })}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.priority && (
              <Chip
                label={`Độ ưu tiên: ${priorityOptions.find(p => p.value === filters.priority)?.label}`}
                size="small"
                onDelete={() => onChangeAction({ ...filters, priority: undefined })}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.startDateFrom && (
              <Chip
                label={`Bắt đầu từ: ${new Date(filters.startDateFrom).toLocaleDateString('vi-VN')}`}
                size="small"
                onDelete={() => onChangeAction({ ...filters, startDateFrom: undefined })}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.startDateTo && (
              <Chip
                label={`Bắt đầu đến: ${new Date(filters.startDateTo).toLocaleDateString('vi-VN')}`}
                size="small"
                onDelete={() => onChangeAction({ ...filters, startDateTo: undefined })}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.endDateFrom && (
              <Chip
                label={`Kết thúc từ: ${new Date(filters.endDateFrom).toLocaleDateString('vi-VN')}`}
                size="small"
                onDelete={() => onChangeAction({ ...filters, endDateFrom: undefined })}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.endDateTo && (
              <Chip
                label={`Kết thúc đến: ${new Date(filters.endDateTo).toLocaleDateString('vi-VN')}`}
                size="small"
                onDelete={() => onChangeAction({ ...filters, endDateTo: undefined })}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ProjectsFilters;
