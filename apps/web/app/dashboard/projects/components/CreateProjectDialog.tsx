"use client";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { projectsApi } from "../../../../api/projects";
import { useToast } from "../../../../hooks/useToast";
import { CreateProjectDto, ProjectPriority } from "../../../../types/project";

interface CreateProjectDialogProps {
  open: boolean;
  onCloseAction: () => void;
  onSuccessAction: () => void;
}

const priorityOptions = [
  { value: ProjectPriority.Low, label: "Thấp" },
  { value: ProjectPriority.Medium, label: "Trung bình" },
  { value: ProjectPriority.High, label: "Cao" },
  { value: ProjectPriority.Critical, label: "Khẩn cấp" },
];

function CreateProjectDialog({ open, onCloseAction, onSuccessAction }: CreateProjectDialogProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProjectDto>({
    name: "",
    description: "",
    priority: ProjectPriority.Medium,
    startDate: undefined,
    endDate: undefined,
    budget: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CreateProjectDto) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleDateChange = (field: "startDate" | "endDate") => (date: Date | null) => {
    // Sử dụng local date để tránh timezone issues
    const dateString = date ? 
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : 
      undefined;
    setFormData(prev => ({ ...prev, [field]: dateString }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên dự án không được để trống";
    }

    if (formData.description && !formData.description.trim()) {
      newErrors.description = "Mô tả dự án không được để trống";
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (formData.budget !== undefined && formData.budget < 0) {
      newErrors.budget = "Ngân sách không được âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await projectsApi.createProject(formData);
      addToast("Tạo dự án thành công!", "success");
      onSuccessAction();
      handleReset();
    } catch (error: unknown) {
      console.error("Create project error:", error);
      addToast("Có lỗi xảy ra khi tạo dự án", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      priority: ProjectPriority.Medium,
      startDate: undefined,
      endDate: undefined,
      budget: undefined,
    });
    setErrors({});
  };

  const handleClose = () => {
    if (!loading) {
      handleReset();
      onCloseAction();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Tạo dự án mới
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Project Name */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Tên dự án *"
              value={formData.name}
              onChange={handleInputChange("name")}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Mô tả dự án"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange("description")}
              error={Boolean(errors.description)}
              helperText={errors.description}
            />
          </Grid>

          {/* Priority */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Độ ưu tiên</InputLabel>
              <Select
                value={formData.priority}
                label="Độ ưu tiên"
                onChange={handleInputChange("priority")}
              >
                {priorityOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Budget */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Ngân sách (VND)"
              type="number"
              value={formData.budget || ""}
              onChange={handleInputChange("budget")}
              error={Boolean(errors.budget)}
              helperText={errors.budget}
              InputProps={{
                inputProps: { min: 0 },
              }}
            />
          </Grid>

          {/* Dates */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ngày bắt đầu"
                value={formData.startDate ? new Date(formData.startDate + 'T00:00:00') : null}
                onChange={handleDateChange("startDate")}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(errors.startDate),
                    helperText: errors.startDate,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ngày kết thúc"
                value={formData.endDate ? new Date(formData.endDate + 'T00:00:00') : null}
                onChange={handleDateChange("endDate")}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(errors.endDate),
                    helperText: errors.endDate,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            textTransform: "none",
            minWidth: 120,
          }}
        >
          {loading ? "Đang tạo..." : "Tạo dự án"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateProjectDialog;
