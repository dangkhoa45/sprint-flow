"use client";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import FlagIcon from "@mui/icons-material/Flag";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "../types/task";

interface TaskDetailDialogProps {
  open: boolean;
  task: Task | null;
  onCloseAction: () => void;
  onUpdate?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const statusOptions = [
  { value: TaskStatus.TODO, label: "Chưa bắt đầu", color: "#6b7280" },
  { value: TaskStatus.IN_PROGRESS, label: "Đang thực hiện", color: "#2563eb" },
  { value: TaskStatus.IN_REVIEW, label: "Đang xem xét", color: "#f59e0b" },
  { value: TaskStatus.DONE, label: "Hoàn thành", color: "#059669" },
  { value: TaskStatus.BLOCKED, label: "Bị chặn", color: "#dc2626" },
];

const priorityOptions = [
  { value: TaskPriority.LOWEST, label: "Thấp nhất", color: "#64748b" },
  { value: TaskPriority.LOW, label: "Thấp", color: "#06b6d4" },
  { value: TaskPriority.MEDIUM, label: "Trung bình", color: "#10b981" },
  { value: TaskPriority.HIGH, label: "Cao", color: "#f59e0b" },
  { value: TaskPriority.HIGHEST, label: "Cao nhất", color: "#ef4444" },
];

const mockUsers = [
  { _id: "user1", displayName: "Nguyễn Văn A", username: "nguyenvana" },
  { _id: "user2", displayName: "Trần Thị B", username: "tranthib" },
  { _id: "user3", displayName: "Lê Văn C", username: "levanc" },
];

export default function TaskDetailDialog({
  open,
  task,
  onCloseAction,
  onUpdate,
  onDelete,
}: TaskDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(task);
  const [newComment, setNewComment] = useState("");

  React.useEffect(() => {
    setEditedTask(task);
    setIsEditing(false);
  }, [task]);

  if (!task) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask({ ...task });
  };

  const handleSave = () => {
    if (editedTask) {
      onUpdate?.(editedTask);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof Task, value: any) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [field]: value });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() && editedTask) {
      const comment = {
        _id: Date.now().toString(),
        content: newComment,
        author: {
          _id: "user1",
          displayName: "Nguyễn Văn A",
          username: "nguyenvana",
          role: "Developer",
          avatar: "",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setEditedTask({
        ...editedTask,
        comments: [...editedTask.comments, comment],
      });
      setNewComment("");
    }
  };

  const getStatusOption = (status: TaskStatus) =>
    statusOptions.find((opt) => opt.value === status);

  const getPriorityOption = (priority: TaskPriority) =>
    priorityOptions.find((opt) => opt.value === priority);

  const currentTask = editedTask || task;

  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 700,
          maxHeight: "90vh",
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {currentTask.project && (
            <Chip
              label={currentTask.project.key}
              size="small"
              sx={{
                backgroundColor: currentTask.project.color + "20",
                color: currentTask.project.color,
                fontWeight: 600,
              }}
            />
          )}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isEditing ? "Chỉnh sửa công việc" : "Chi tiết công việc"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {!isEditing && (
            <IconButton onClick={handleEdit} size="small">
              <EditIcon />
            </IconButton>
          )}
          <IconButton onClick={onCloseAction} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Title */}
          {isEditing ? (
            <TextField
              label="Tiêu đề"
              value={currentTask.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              fullWidth
              variant="outlined"
            />
          ) : (
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1e293b" }}>
              {currentTask.title}
            </Typography>
          )}

          {/* Status and Priority Row */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {isEditing ? (
              <>
                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={currentTask.status}
                    onChange={(e) =>
                      handleFieldChange("status", e.target.value)
                    }
                    label="Trạng thái"
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: option.color,
                            }}
                          />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel>Độ ưu tiên</InputLabel>
                  <Select
                    value={currentTask.priority}
                    onChange={(e) =>
                      handleFieldChange("priority", e.target.value)
                    }
                    label="Độ ưu tiên"
                  >
                    {priorityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <FlagIcon
                            sx={{ color: option.color, fontSize: 16 }}
                          />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
                <Chip
                  label={getStatusOption(currentTask.status)?.label}
                  sx={{
                    backgroundColor:
                      getStatusOption(currentTask.status)?.color + "20",
                    color: getStatusOption(currentTask.status)?.color,
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<FlagIcon />}
                  label={getPriorityOption(currentTask.priority)?.label}
                  sx={{
                    backgroundColor:
                      getPriorityOption(currentTask.priority)?.color + "20",
                    color: getPriorityOption(currentTask.priority)?.color,
                    fontWeight: 600,
                  }}
                />
              </>
            )}
          </Box>

          {/* Description */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Mô tả
            </Typography>
            {isEditing ? (
              <TextField
                multiline
                rows={4}
                value={currentTask.description || ""}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                fullWidth
                placeholder="Nhập mô tả..."
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  color: "#64748b",
                  whiteSpace: "pre-wrap",
                  minHeight: 40,
                  p: 2,
                  backgroundColor: "#f8fafc",
                  borderRadius: 1,
                }}
              >
                {currentTask.description || "Chưa có mô tả"}
              </Typography>
            )}
          </Box>

          {/* Assignee and Due Date */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Người thực hiện
              </Typography>
              {isEditing ? (
                <FormControl fullWidth>
                  <Select
                    value={currentTask.assignee?._id || ""}
                    onChange={(e) => {
                      const user = mockUsers.find(
                        (u) => u._id === e.target.value
                      );
                      handleFieldChange("assignee", user || null);
                    }}
                    displayEmpty
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
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {currentTask.assignee ? (
                    <>
                      <Avatar sx={{ width: 24, height: 24 }}>
                        {currentTask.assignee.displayName?.charAt(0)}
                      </Avatar>
                      <Typography>
                        {currentTask.assignee.displayName}
                      </Typography>
                    </>
                  ) : (
                    <Typography color="textSecondary">Chưa giao</Typography>
                  )}
                </Box>
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Hạn hoàn thành
              </Typography>
              {isEditing ? (
                <TextField
                  type="date"
                  value={
                    currentTask.dueDate
                      ? currentTask.dueDate.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleFieldChange(
                      "dueDate",
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              ) : (
                <Typography>
                  {currentTask.dueDate
                    ? currentTask.dueDate.toLocaleDateString("vi-VN")
                    : "Chưa đặt hạn"}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Tags */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Nhãn
            </Typography>
            {isEditing ? (
              <Autocomplete
                multiple
                freeSolo
                value={currentTask.tags}
                onChange={(event, newValue) =>
                  handleFieldChange("tags", newValue)
                }
                options={["Frontend", "Backend", "UI/UX", "Bug", "Feature"]}
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
                  <TextField {...params} placeholder="Thêm nhãn..." />
                )}
              />
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {currentTask.tags.length > 0 ? (
                  currentTask.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      variant="outlined"
                      size="small"
                    />
                  ))
                ) : (
                  <Typography color="textSecondary">Chưa có nhãn</Typography>
                )}
              </Box>
            )}
          </Box>

          <Divider />

          {/* Comments Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Bình luận ({currentTask.comments.length})
            </Typography>

            {/* Add Comment */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Thêm bình luận..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        size="small"
                      >
                        Gửi
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Comments List */}
            <List sx={{ maxHeight: 300, overflow: "auto" }}>
              {currentTask.comments.map((comment) => (
                <ListItem key={comment._id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {comment.author.displayName.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {comment.author.displayName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {comment.createdAt.toLocaleDateString("vi-VN")}{" "}
                          {comment.createdAt.toLocaleTimeString("vi-VN")}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {comment.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              {currentTask.comments.length === 0 && (
                <Typography
                  color="textSecondary"
                  textAlign="center"
                  sx={{ py: 2 }}
                >
                  Chưa có bình luận nào
                </Typography>
              )}
            </List>
          </Box>
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
        {isEditing ? (
          <>
            <Button
              onClick={handleCancel}
              variant="outlined"
              startIcon={<CancelIcon />}
              sx={{ textTransform: "none" }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                textTransform: "none",
                backgroundColor: "#10b981",
                "&:hover": { backgroundColor: "#059669" },
              }}
            >
              Lưu thay đổi
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => onDelete?.(task._id)}
              variant="outlined"
              color="error"
              sx={{ textTransform: "none" }}
            >
              Xóa
            </Button>
            <Button
              onClick={onCloseAction}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              Đóng
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
