"use client";
import { ProjectPriority, Project } from "@/types/project";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";
import { useState, useEffect } from "react";
import { projectsApi } from "@/api/projects";
import { CreateProjectDto } from "@/types/project";

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  mutate?: () => void;
  mutateStats?: () => void;
  mode: 'create' | 'edit';
  project?: Project;
}

const ProjectDialog = ({ open, onClose, mutate, mutateStats, mode, project }: ProjectDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: ProjectPriority.Medium,
    startDate: null as Date | null,
    endDate: null as Date | null,
    estimatedHours: "",
    members: [] as string[],
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableMembers = [
    { id: "user1", name: "Nguyễn Văn A" },
    { id: "user2", name: "Trần Thị B" },
    { id: "user3", name: "Lê Văn C" },
    { id: "user4", name: "Phạm Văn D" },
  ];

  useEffect(() => {
    if (mode === 'edit' && project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        priority: project.priority || ProjectPriority.Medium,
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
        estimatedHours: project.estimatedHours ? String(project.estimatedHours) : "",
        members: project.members?.map((m: any) => m._id || m) || [],
        tags: project.tags || [],
      });
    } else if (mode === 'create') {
      setFormData({
        name: "",
        description: "",
        priority: ProjectPriority.Medium,
        startDate: null,
        endDate: null,
        estimatedHours: "",
        members: [],
        tags: [],
      });
    }
  }, [mode, project, open]);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectChange =
    (field: string) => (event: SelectChangeEvent<any>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleMembersChange = (
    event: SelectChangeEvent<typeof formData.members>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      members: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleDateChange =
    (field: "startDate" | "endDate") => (date: Date | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: date,
      }));
    };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: CreateProjectDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        members: formData.members.length > 0 ? formData.members : undefined,
        startDate: formData.startDate ? formData.startDate.toISOString() : undefined,
        endDate: formData.endDate ? formData.endDate.toISOString() : undefined,
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };
      if (mode === 'edit' && project?._id) {
        await projectsApi.updateProject(project._id, payload);
      } else {
        await projectsApi.createProject(payload);
      }
      if (mutate) mutate();
      if (mutateStats) mutateStats();
      handleClose();
    } catch (err: any) {
      setError(err.message || (mode === 'edit' ? "Cập nhật dự án thất bại" : "Tạo dự án thất bại"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      priority: ProjectPriority.Medium,
      startDate: null,
      endDate: null,
      estimatedHours: "",
      members: [],
      tags: [],
    });
    setNewTag("");
    onClose();
  };

  const getPriorityText = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Low:
        return "Thấp";
      case ProjectPriority.Medium:
        return "Trung bình";
      case ProjectPriority.High:
        return "Cao";
      case ProjectPriority.Critical:
        return "Khẩn cấp";
      default:
        return priority;
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
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>{mode === 'edit' ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
         
          <TextField
            label="Tên dự án"
            value={formData.name}
            onChange={handleInputChange("name")}
            fullWidth
            required
            placeholder="Nhập tên dự án..."
          />

         
          <TextField
            label="Mô tả"
            value={formData.description}
            onChange={handleInputChange("description")}
            fullWidth
            multiline
            rows={3}
            placeholder="Mô tả chi tiết về dự án..."
          />

         
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Độ ưu tiên</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleSelectChange("priority")}
                label="Độ ưu tiên"
              >
                {Object.values(ProjectPriority).map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {getPriorityText(priority)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Ước tính giờ làm việc"
              value={formData.estimatedHours}
              onChange={handleInputChange("estimatedHours")}
              type="number"
              sx={{ flex: 1 }}
              placeholder="0"
              inputProps={{ min: 0 }}
            />
          </Box>

          {/* Start and End Dates */}
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="Ngày bắt đầu"
                value={formData.startDate}
                onChange={handleDateChange("startDate")}
                sx={{ flex: 1 }}
                format="dd/MM/yyyy"
                slotProps={{ textField: { placeholder: "DD/MM/YYYY" } }}
              />
              <DatePicker
                label="Ngày kết thúc"
                value={formData.endDate}
                onChange={handleDateChange("endDate")}
                sx={{ flex: 1 }}
                minDate={formData.startDate || undefined}
                format="dd/MM/yyyy"
                slotProps={{ textField: { placeholder: "DD/MM/YYYY" } }}
              />
            </Box>
          </LocalizationProvider>

          {/* Members */}
          <FormControl>
            <InputLabel>Thành viên</InputLabel>
            <Select
              multiple
              value={formData.members}
              onChange={handleMembersChange}
              input={<OutlinedInput label="Thành viên" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const member = availableMembers.find((m) => m.id === value);
                    return (
                      <Chip
                        key={value}
                        label={member?.name || value}
                        size="small"
                      />
                    );
                  })}
                </Box>
              )}
            >
              {availableMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Tags */}
          <Box>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                label="Thẻ tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                size="small"
                placeholder="Nhập tag và nhấn Thêm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                size="small"
              >
                Thêm
              </Button>
            </Box>

            {formData.tags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          startIcon={<CloseIcon />}
          sx={{ textTransform: "none" }}
          disabled={loading}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!formData.name.trim() || loading}
          sx={{ textTransform: "none" }}
        >
          {loading ? (mode === 'edit' ? 'Đang lưu...' : 'Đang tạo...') : (mode === 'edit' ? 'Lưu thay đổi' : 'Tạo dự án')}
        </Button>
      </DialogActions>
      {error && (
        <Box sx={{ color: "error.main", px: 3, pb: 2 }}>{error}</Box>
      )}
    </Dialog>
  );
};

export default ProjectDialog;
