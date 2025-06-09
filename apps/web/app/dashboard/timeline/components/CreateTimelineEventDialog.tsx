"use client";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import {
  CreateTimelineEventData,
  TimelineEventType,
  TimelineEventPriority,
} from "../../../../types/timeline";

interface CreateTimelineEventDialogProps {
  open: boolean;
  onCloseAction: () => void;
  onSubmitAction: (data: CreateTimelineEventData) => void;
  loading?: boolean;
}

const eventTypeOptions = [
  {
    value: TimelineEventType.PROJECT_CREATED,
    label: "Tạo dự án",
    description: "Một dự án mới được tạo",
  },
  {
    value: TimelineEventType.PROJECT_UPDATED,
    label: "Cập nhật dự án",
    description: "Thông tin dự án được cập nhật",
  },
  {
    value: TimelineEventType.PROJECT_COMPLETED,
    label: "Hoàn thành dự án",
    description: "Dự án đã hoàn thành",
  },
  {
    value: TimelineEventType.TASK_CREATED,
    label: "Tạo task",
    description: "Một task mới được tạo",
  },
  {
    value: TimelineEventType.TASK_UPDATED,
    label: "Cập nhật task",
    description: "Thông tin task được cập nhật",
  },
  {
    value: TimelineEventType.TASK_COMPLETED,
    label: "Hoàn thành task",
    description: "Task đã hoàn thành",
  },
  {
    value: TimelineEventType.USER_JOINED,
    label: "Thành viên tham gia",
    description: "Thành viên mới tham gia dự án",
  },
  {
    value: TimelineEventType.MILESTONE_REACHED,
    label: "Đạt mốc quan trọng",
    description: "Đạt được một mốc quan trọng",
  },
  {
    value: TimelineEventType.DEADLINE_APPROACHING,
    label: "Sắp đến hạn",
    description: "Deadline đang đến gần",
  },
  {
    value: TimelineEventType.COMMENT_ADDED,
    label: "Thêm bình luận",
    description: "Bình luận mới được thêm",
  },
  {
    value: TimelineEventType.FILE_UPLOADED,
    label: "Tải file lên",
    description: "File mới được tải lên",
  },
  {
    value: TimelineEventType.STATUS_CHANGED,
    label: "Thay đổi trạng thái",
    description: "Trạng thái được thay đổi",
  },
];

const priorityOptions = [
  {
    value: TimelineEventPriority.LOW,
    label: "Thấp",
    color: "#4caf50",
    description: "Sự kiện có tầm quan trọng thấp",
  },
  {
    value: TimelineEventPriority.MEDIUM,
    label: "Trung bình",
    color: "#ff9800",
    description: "Sự kiện có tầm quan trọng trung bình",
  },
  {
    value: TimelineEventPriority.HIGH,
    label: "Cao",
    color: "#ff5722",
    description: "Sự kiện có tầm quan trọng cao",
  },
  {
    value: TimelineEventPriority.URGENT,
    label: "Khẩn cấp",
    color: "#f44336",
    description: "Sự kiện khẩn cấp cần xử lý ngay",
  },
];

export default function CreateTimelineEventDialog({
  open,
  onCloseAction,
  onSubmitAction,
  loading = false,
}: CreateTimelineEventDialogProps) {
  const [formData, setFormData] = useState<CreateTimelineEventData>({
    type: TimelineEventType.PROJECT_CREATED,
    title: "",
    description: "",
    priority: TimelineEventPriority.MEDIUM,
    projectId: "",
    taskId: "",
    metadata: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CreateTimelineEventData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    if (!formData.type) {
      newErrors.type = "Loại sự kiện là bắt buộc";
    }

    if (!formData.priority) {
      newErrors.priority = "Mức độ ưu tiên là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      projectId: formData.projectId || undefined,
      taskId: formData.taskId || undefined,
    };

    onSubmitAction(submitData);
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        type: TimelineEventType.PROJECT_CREATED,
        title: "",
        description: "",
        priority: TimelineEventPriority.MEDIUM,
        projectId: "",
        taskId: "",
        metadata: {},
      });
      setErrors({});
      onCloseAction();
    }
  };

  const selectedEventType = eventTypeOptions.find(
    (option) => option.value === formData.type
  );
  const selectedPriority = priorityOptions.find(
    (option) => option.value === formData.priority
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 3,
          color: "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          Tạo sự kiện mới
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": { color: "white" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Event Type */}
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-focused": { color: "white" },
              }}
            >
              Loại sự kiện
            </InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              label="Loại sự kiện"
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "& .MuiSelect-icon": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    "& .MuiMenuItem-root": {
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                    },
                  },
                },
              }}
            >
              {eventTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {option.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {option.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.type && (
              <Typography
                variant="caption"
                sx={{ color: "#f44336", mt: 0.5 }}
              >
                {errors.type}
              </Typography>
            )}
          </FormControl>

          {/* Event Description */}
          {selectedEventType && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: 2,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.6)" }}
              >
                Mô tả loại sự kiện:
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                {selectedEventType.description}
              </Typography>
            </Box>
          )}

          {/* Title */}
          <TextField
            fullWidth
            label="Tiêu đề sự kiện"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            placeholder="Nhập tiêu đề cho sự kiện..."
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-focused": {
                  color: "white",
                },
              },
              "& .MuiFormHelperText-root": {
                color: "#f44336",
              },
            }}
          />

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Mô tả chi tiết"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            placeholder="Mô tả chi tiết về sự kiện này..."
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-focused": {
                  color: "white",
                },
              },
              "& .MuiFormHelperText-root": {
                color: "#f44336",
              },
            }}
          />

          {/* Priority */}
          <FormControl fullWidth error={!!errors.priority}>
            <InputLabel
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-focused": { color: "white" },
              }}
            >
              Mức độ ưu tiên
            </InputLabel>
            <Select
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              label="Mức độ ưu tiên"
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "& .MuiSelect-icon": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    "& .MuiMenuItem-root": {
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                    },
                  },
                },
              }}
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: option.color,
                      }}
                    />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {option.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {option.description}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.priority && (
              <Typography
                variant="caption"
                sx={{ color: "#f44336", mt: 0.5 }}
              >
                {errors.priority}
              </Typography>
            )}
          </FormControl>

          {/* Priority Description */}
          {selectedPriority && (
            <Box
              sx={{
                p: 2,
                backgroundColor: `${selectedPriority.color}10`,
                borderRadius: 2,
                border: `1px solid ${selectedPriority.color}30`,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.6)" }}
              >
                Mức độ ưu tiên:
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: selectedPriority.color, fontWeight: 500 }}
              >
                {selectedPriority.description}
              </Typography>
            </Box>
          )}

          {/* Optional Fields */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 600 }}
            >
              Thông tin bổ sung (tùy chọn)
            </Typography>

            <TextField
              fullWidth
              label="ID Dự án"
              value={formData.projectId}
              onChange={(e) => handleChange("projectId", e.target.value)}
              placeholder="Nhập ID dự án liên quan..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "white",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="ID Task"
              value={formData.taskId}
              onChange={(e) => handleChange("taskId", e.target.value)}
              placeholder="Nhập ID task liên quan..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "white",
                  },
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          gap: 2,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            borderColor: "rgba(255, 255, 255, 0.3)",
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.5)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #ff6b6b, #ff8e53)",
            "&:hover": {
              background: "linear-gradient(45deg, #ff5252, #ff7043)",
            },
            "&:disabled": {
              background: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          {loading ? "Đang tạo..." : "Tạo sự kiện"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
