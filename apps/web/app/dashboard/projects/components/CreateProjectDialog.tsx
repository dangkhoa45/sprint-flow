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
import { useTheme } from "@mui/material/styles";
import { useThemeMode } from "../../../../provider/ThemeContext";

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
  const theme = useTheme();
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === "dark";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProjectDto>({
    name: "",
    description: "",
    priority: ProjectPriority.Medium,
    startDate: undefined,
    endDate: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CreateProjectDto) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDateChange = (field: "startDate" | "endDate") => (value: Date | null) => {
    const dateString = value?.toISOString().split('T')[0];
    setFormData((prev) => ({
      ...prev,
      [field]: dateString,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDark
            ? "0 8px 32px rgba(0, 0, 0, 0.6)"
            : "0 8px 32px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: 4,
          py: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          Tạo dự án mới
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mt: 0.5,
          }}
        >
          Điền thông tin chi tiết để tạo dự án mới
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Tên dự án"
              value={formData.name}
              onChange={handleInputChange("name")}
              error={Boolean(errors.name)}
              helperText={errors.name}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

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
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={Boolean(errors.priority)}>
              <InputLabel>Độ ưu tiên</InputLabel>
              <Select
                value={formData.priority}
                label="Độ ưu tiên"
                onChange={(e) => handleInputChange("priority")(e)}
                sx={{
                  borderRadius: 2,
                }}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

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
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    },
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
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          px: 4,
          py: 3,
          gap: 2,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            "&:hover": {
              borderColor: theme.palette.text.secondary,
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            backgroundColor: isDark ? "#ffffff" : "#000000",
            color: isDark ? "#000000" : "#ffffff",
            "&:hover": {
              backgroundColor: isDark ? "#f5f5f5" : "#333333",
              transform: "translateY(-1px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "Đang tạo..." : "Tạo dự án"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateProjectDialog;
