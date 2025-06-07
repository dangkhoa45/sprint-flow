"use client";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { CreateTaskDto, TaskPriority, TaskStatus } from "../types/task";

interface CreateTaskDialogProps {
  open: boolean;
  onCloseAction: () => void;
  onSubmit?: (task: CreateTaskDto) => void;
}

const statusOptions = [
  { value: TaskStatus.TODO, label: "Chưa bắt đầu" },
  { value: TaskStatus.IN_PROGRESS, label: "Đang thực hiện" },
  { value: TaskStatus.IN_REVIEW, label: "Đang xem xét" },
  { value: TaskStatus.BLOCKED, label: "Bị chặn" },
];

const priorityOptions = [
  { value: TaskPriority.LOWEST, label: "Thấp nhất" },
  { value: TaskPriority.LOW, label: "Thấp" },
  { value: TaskPriority.MEDIUM, label: "Trung bình" },
  { value: TaskPriority.HIGH, label: "Cao" },
  { value: TaskPriority.HIGHEST, label: "Cao nhất" },
];

const mockUsers = [
  { _id: "user1", displayName: "Nguyễn Văn A", username: "nguyenvana" },
  { _id: "user2", displayName: "Trần Thị B", username: "tranthib" },
  { _id: "user3", displayName: "Lê Văn C", username: "levanc" },
];

const mockProjects = [
  { _id: "proj1", name: "Sprint Flow", key: "SF" },
  { _id: "proj2", name: "Project Alpha", key: "PA" },
  { _id: "proj3", name: "Project Beta", key: "PB" },
];

const suggestedTags = [
  "Frontend",
  "Backend",
  "UI/UX",
  "Bug",
  "Feature",
  "Testing",
  "Documentation",
  "Performance",
  "Security",
  "API",
];

export default function CreateTaskDialog({
  open,
  onCloseAction,
  onSubmit,
}: CreateTaskDialogProps) {
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: "",
    description: "",
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    assignee: "",
    project: "",
    dueDate: undefined,
    tags: [],
    estimatedHours: undefined,
    parentTask: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CreateTaskDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTagsChange = (event: any, newValue: string[]) => {
    setFormData((prev) => ({ ...prev, tags: newValue }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (formData.estimatedHours !== undefined && formData.estimatedHours <= 0) {
      newErrors.estimatedHours = "Thời gian ước lượng phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit?.(formData);
    handleReset();
    onCloseAction();
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assignee: "",
      project: "",
      dueDate: undefined,
      tags: [],
      estimatedHours: undefined,
      parentTask: undefined,
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onCloseAction();
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
          minHeight: 600,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e2e8f0",
          pb: 2,
        }}
      >
        <Typography variant="h6" component={"div"} sx={{ fontWeight: 600 }}>
          Tạo công việc mới
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Title */}
          <TextField
            label="Tiêu đề công việc"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
            placeholder="Nhập tiêu đề cho công việc..."
          />

          {/* Description */}
          <TextField
            label="Mô tả"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            multiline
            rows={4}
            placeholder="Mô tả chi tiết về công việc cần thực hiện..."
          />

          {/* Row 1: Status, Priority */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                label="Trạng thái"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Độ ưu tiên</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                label="Độ ưu tiên"
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Row 2: Assignee, Project */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Người thực hiện</InputLabel>
              <Select
                value={formData.assignee}
                onChange={(e) => handleChange("assignee", e.target.value)}
                label="Người thực hiện"
              >
                <MenuItem value="">
                  <em>Chưa giao</em>
                </MenuItem>
                {mockUsers.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Dự án</InputLabel>
              <Select
                value={formData.project}
                onChange={(e) => handleChange("project", e.target.value)}
                label="Dự án"
              >
                <MenuItem value="">
                  <em>Không thuộc dự án nào</em>
                </MenuItem>
                {mockProjects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={project.key}
                        size="small"
                        sx={{ fontSize: "0.7rem", height: 20 }}
                      />
                      {project.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Row 3: Due Date, Estimated Hours */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Hạn hoàn thành"
              type="date"
              value={
                formData.dueDate
                  ? formData.dueDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleChange(
                  "dueDate",
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Thời gian ước lượng (giờ)"
              type="number"
              value={formData.estimatedHours || ""}
              onChange={(e) =>
                handleChange(
                  "estimatedHours",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              error={!!errors.estimatedHours}
              helperText={errors.estimatedHours}
              fullWidth
              inputProps={{ min: 0, step: 0.5 }}
              placeholder="VD: 8"
            />
          </Box>

          {/* Tags */}
          <Autocomplete
            multiple
            options={suggestedTags}
            value={formData.tags}
            onChange={handleTagsChange}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={index}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Nhãn" placeholder="Thêm nhãn..." />
            )}
          />

          {/* Parent Task (for subtasks) */}
          <FormControl fullWidth>
            <InputLabel>Công việc cha (nếu là công việc con)</InputLabel>
            <Select
              value={formData.parentTask || ""}
              onChange={(e) =>
                handleChange("parentTask", e.target.value || undefined)
              }
              label="Công việc cha (nếu là công việc con)"
            >
              <MenuItem value="">
                <em>Không phải công việc con</em>
              </MenuItem>
              {/* Mock parent tasks - in real app, would fetch from API */}
              <MenuItem value="task1">
                [SF-001] Thiết kế hệ thống authentication
              </MenuItem>
              <MenuItem value="task2">
                [SF-002] Xây dựng API cho quản lý người dùng
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e2e8f0",
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "#e2e8f0",
            color: "#64748b",
            "&:hover": {
              borderColor: "#cbd5e1",
              backgroundColor: "#f8fafc",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#10b981",
            "&:hover": {
              backgroundColor: "#059669",
            },
          }}
        >
          Tạo công việc
        </Button>
      </DialogActions>
    </Dialog>
  );
}
