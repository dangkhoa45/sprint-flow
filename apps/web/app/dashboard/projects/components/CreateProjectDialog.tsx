"use client";
import AddIcon from "@mui/icons-material/Add";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import CloseIcon from "@mui/icons-material/Close";
import DateIcon from "@mui/icons-material/DateRange";
import GroupIcon from "@mui/icons-material/Group";
import TagIcon from "@mui/icons-material/LocalOffer";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { CreateProjectData, ProjectPriority } from "../../../../types/project";

interface CreateProjectDialogProps {
  open: boolean;
  onCloseAction: () => void;
  onSubmitAction: (data: CreateProjectData) => void;
  loading?: boolean;
}

// Mock data for users - sẽ được thay thế bằng API call
const mockUsers = [
  { _id: "1", username: "john_doe", displayName: "John Doe", avatar: null },
  { _id: "2", username: "jane_smith", displayName: "Jane Smith", avatar: null },
  { _id: "3", username: "bob_wilson", displayName: "Bob Wilson", avatar: null },
  {
    _id: "4",
    username: "alice_brown",
    displayName: "Alice Brown",
    avatar: null,
  },
  {
    _id: "5",
    username: "charlie_davis",
    displayName: "Charlie Davis",
    avatar: null,
  },
];

const priorityOptions = [
  { value: ProjectPriority.LOW, label: "Thấp", color: "#4caf50" },
  { value: ProjectPriority.MEDIUM, label: "Trung bình", color: "#ff9800" },
  { value: ProjectPriority.HIGH, label: "Cao", color: "#ff5722" },
  { value: ProjectPriority.URGENT, label: "Khẩn cấp", color: "#f44336" },
];

const commonTags = [
  "Web Development",
  "Mobile App",
  "Backend",
  "Frontend",
  "API",
  "Database",
  "UI/UX",
  "Testing",
  "DevOps",
  "Analytics",
];

export default function CreateProjectDialog({
  open,
  onCloseAction,
  onSubmitAction,
  loading = false,
}: CreateProjectDialogProps) {
  const [formData, setFormData] = useState<CreateProjectData>({
    name: "",
    description: "",
    priority: ProjectPriority.MEDIUM,
    startDate: new Date(),
    endDate: undefined,
    budget: undefined,
    members: [],
    tags: [],
  });

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        description: "",
        priority: ProjectPriority.MEDIUM,
        startDate: new Date(),
        endDate: undefined,
        budget: undefined,
        members: [],
        tags: [],
      });
      setSelectedMembers([]);
      setTagInput("");
      setErrors({});
    }
  }, [open]);

  const handleInputChange =
    (field: keyof CreateProjectData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "budget" ? (value ? parseFloat(value) : undefined) : value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleDateChange =
    (field: "startDate" | "endDate") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value ? new Date(value) : undefined,
      }));
    };

  const handlePriorityChange = (event: any) => {
    setFormData((prev) => ({
      ...prev,
      priority: event.target.value as ProjectPriority,
    }));
  };

  const handleMemberSelect = (event: any) => {
    const value = event.target.value as string[];
    setSelectedMembers(value);
    setFormData((prev) => ({
      ...prev,
      members: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddCommonTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên dự án là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả dự án là bắt buộc";
    }

    if (formData.endDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (formData.budget && formData.budget < 0) {
      newErrors.budget = "Ngân sách không thể âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmitAction(formData);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: "#1976d2" }}>
          Tạo dự án mới
        </Typography>
        <IconButton
          onClick={onCloseAction}
          sx={{
            color: "text.secondary",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          {/* Thông tin cơ bản */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "rgba(33, 150, 243, 0.05)",
                border: "1px solid rgba(33, 150, 243, 0.1)",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}
              >
                Thông tin cơ bản
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Tên dự án"
                    placeholder="Nhập tên dự án..."
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Mô tả dự án"
                    placeholder="Mô tả chi tiết về dự án..."
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange("description")}
                    error={!!errors.description}
                    helperText={errors.description}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12}}>
                  <FormControl fullWidth>
                    <InputLabel>Độ ưu tiên</InputLabel>
                    <Select
                      value={formData.priority}
                      onChange={handlePriorityChange}
                      input={<OutlinedInput label="Độ ưu tiên" />}
                    >
                      {priorityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
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
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Thời gian */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "rgba(76, 175, 80, 0.05)",
                border: "1px solid rgba(76, 175, 80, 0.1)",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#4caf50", fontWeight: 600 }}
              >
                <DateIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Thời gian thực hiện
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Ngày bắt đầu"
                    type="date"
                    value={formatDate(formData.startDate)}
                    onChange={handleDateChange("startDate")}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Ngày kết thúc (dự kiến)"
                    type="date"
                    value={formData.endDate ? formatDate(formData.endDate) : ""}
                    onChange={handleDateChange("endDate")}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Thành viên */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "rgba(255, 152, 0, 0.05)",
                border: "1px solid rgba(255, 152, 0, 0.1)",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#ff9800", fontWeight: 600 }}
              >
                <GroupIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Thành viên dự án
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Chọn thành viên</InputLabel>
                <Select
                  multiple
                  value={selectedMembers}
                  onChange={handleMemberSelect}
                  input={<OutlinedInput label="Chọn thành viên" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((userId) => {
                        const user = mockUsers.find((u) => u._id === userId);
                        return (
                          <Chip
                            key={userId}
                            label={user?.displayName}
                            size="small"
                            avatar={
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {user?.displayName.charAt(0)}
                              </Avatar>
                            }
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {mockUsers.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      <Checkbox
                        checked={selectedMembers.indexOf(user._id) > -1}
                      />
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 2,
                          fontSize: "0.875rem",
                        }}
                      >
                        {user.displayName.charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={user.displayName}
                        secondary={user.username}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Tags */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "rgba(156, 39, 176, 0.05)",
                border: "1px solid rgba(156, 39, 176, 0.1)",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#9c27b0", fontWeight: 600 }}
              >
                <TagIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Tags dự án
              </Typography>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Thêm tag"
                  placeholder="Nhập tag và nhấn Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Box>

              {/* Common tags */}
              <Typography
                variant="body2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Tags phổ biến:
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 2 }}
              >
                {commonTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    onClick={() => handleAddCommonTag(tag)}
                    disabled={formData.tags.includes(tag)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(156, 39, 176, 0.1)",
                        borderColor: "#9c27b0",
                      },
                    }}
                  />
                ))}
              </Stack>

              {/* Selected tags */}
              {formData.tags.length > 0 && (
                <>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "text.secondary" }}
                  >
                    Tags đã chọn:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        size="small"
                      />
                    ))}
                  </Stack>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onCloseAction}
          variant="outlined"
          sx={{ minWidth: 120 }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            minWidth: 120,
            background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            },
          }}
        >
          {loading ? "Đang tạo..." : "Tạo dự án"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
