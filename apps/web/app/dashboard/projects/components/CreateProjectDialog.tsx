"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { CreateProjectDto, ProjectPriority } from "../../../../types/project";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateProjectDialog = ({ open, onClose }: CreateProjectDialogProps) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<CreateProjectDto>({
    name: "",
    description: "",
    priority: ProjectPriority.Medium,
    startDate: "",
    endDate: "",
    estimatedHours: 0,
    tags: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement create project API call
    console.log("Creating project:", formData);
    onClose();
  };

  const handleInputChange = (field: keyof CreateProjectDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Tạo dự án mới
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 2 }}>
          <Grid container spacing={3}>
            {/* Project Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Tên dự án"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                size="small"
                sx={{ "& .MuiInputBase-input": { fontSize: "0.875rem" } }}
              />
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Mô tả"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                multiline
                rows={3}
                size="small"
                sx={{ "& .MuiInputBase-input": { fontSize: "0.875rem" } }}
              />
            </Grid>

            {/* Priority */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: "0.875rem" }}>Mức độ ưu tiên</InputLabel>
                <Select
                  value={formData.priority}
                  label="Mức độ ưu tiên"
                  onChange={(e) => handleInputChange("priority", e.target.value)}
                  sx={{ "& .MuiSelect-select": { fontSize: "0.875rem" } }}
                >
                  <MenuItem value={ProjectPriority.Low} sx={{ fontSize: "0.875rem" }}>
                    Thấp
                  </MenuItem>
                  <MenuItem value={ProjectPriority.Medium} sx={{ fontSize: "0.875rem" }}>
                    Trung bình
                  </MenuItem>
                  <MenuItem value={ProjectPriority.High} sx={{ fontSize: "0.875rem" }}>
                    Cao
                  </MenuItem>
                  <MenuItem value={ProjectPriority.Critical} sx={{ fontSize: "0.875rem" }}>
                    Khẩn cấp
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Estimated Hours */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Thời gian dự kiến (giờ)"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => handleInputChange("estimatedHours", Number(e.target.value))}
                size="small"
                sx={{ "& .MuiInputBase-input": { fontSize: "0.875rem" } }}
              />
            </Grid>

            {/* Start Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Ngày bắt đầu"
                value={formData.startDate ? new Date(formData.startDate) : null}
                onChange={(date) => handleInputChange("startDate", date?.toISOString())}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: { "& .MuiInputBase-input": { fontSize: "0.875rem" } },
                  },
                }}
              />
            </Grid>

            {/* End Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Ngày kết thúc"
                value={formData.endDate ? new Date(formData.endDate) : null}
                onChange={(date) => handleInputChange("endDate", date?.toISOString())}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: { "& .MuiInputBase-input": { fontSize: "0.875rem" } },
                  },
                }}
              />
            </Grid>

            {/* Tags */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Tags (phân cách bằng dấu phẩy)"
                value={formData.tags?.join(", ") || ""}
                onChange={(e) => 
                  handleInputChange("tags", e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag))
                }
                size="small"
                placeholder="frontend, backend, mobile"
                sx={{ "& .MuiInputBase-input": { fontSize: "0.875rem" } }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={onClose}
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              px: 3,
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              px: 3,
            }}
          >
            Tạo dự án
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateProjectDialog;
