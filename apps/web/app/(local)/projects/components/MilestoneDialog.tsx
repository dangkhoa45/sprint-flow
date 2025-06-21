"use client";
import { milestonesApi } from "@/api/milestones";
import { useToast } from "@/hooks/useToast";
import { CreateMilestoneDto, Milestone, MilestoneStatus, UpdateMilestoneDto } from "@/types/milestone";
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
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";
import { useEffect, useState } from "react";

interface MilestoneDialogProps {
  open: boolean;
  onClose: () => void;
  mutate?: () => void;
  mode: 'create' | 'edit';
  milestone?: Milestone;
  projectId: string;
}

const MilestoneDialog = ({ open, onClose, mutate, mode, milestone, projectId }: MilestoneDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: null as Date | null,
    status: MilestoneStatus.Pending as MilestoneStatus,
    progress: 0,
    assignedTo: "",
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

  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (mode === 'edit' && milestone) {
      setFormData({
        title: milestone.title || "",
        description: milestone.description || "",
        dueDate: milestone.dueDate ? new Date(milestone.dueDate) : null,
        status: milestone.status || MilestoneStatus.Pending,
        progress: typeof milestone.progress === 'number' ? milestone.progress : 0,
        assignedTo: milestone.assignedTo?._id || "",
        tags: milestone.tags || [],
      });
    } else if (mode === 'create') {
      setFormData({
        title: "",
        description: "",
        dueDate: null,
        status: MilestoneStatus.Pending,
        progress: 0,
        assignedTo: "",
        tags: [],
      });
    }
  }, [mode, milestone, open]);

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
        [field]: event.target.value || "",
      }));
    };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      dueDate: date,
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

  const handleSliderChange = (event: Event, value: number | number[]) => {
    setFormData((prev) => ({ ...prev, progress: value as number }));
  };

  const handleProgressInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(event.target.value);
    if (isNaN(value)) value = 0;
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    setFormData((prev) => ({ ...prev, progress: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'edit' && milestone?._id) {
        const payload: UpdateMilestoneDto = {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          dueDate: formData.dueDate ? formData.dueDate.toISOString() : undefined,
          status: formData.status,
          progress: formData.progress,
          assignedTo: formData.assignedTo || undefined,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
        };
        await milestonesApi.updateMilestone(milestone._id, payload);
        success("Cập nhật mốc công việc thành công!");
      } else {
        if (!formData.dueDate) {
          setError("Ngày hạn là bắt buộc");
          return;
        }
        
        const payload: CreateMilestoneDto = {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          dueDate: formData.dueDate.toISOString(),
          status: formData.status,
          progress: formData.progress,
          assignedTo: formData.assignedTo || undefined,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
        };
        await milestonesApi.createMilestone(projectId, payload);
        success("Tạo mốc công việc thành công!");
      }
      if (mutate) mutate();
      handleClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : (mode === 'edit' ? "Cập nhật mốc công việc thất bại" : "Tạo mốc công việc thất bại");
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: null,
      status: MilestoneStatus.Pending,
      progress: 0,
      assignedTo: "",
      tags: [],
    });
    setNewTag("");
    setError(null);
    onClose();
  };

  const getStatusText = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.Pending:
        return "Chờ thực hiện";
      case MilestoneStatus.InProgress:
        return "Đang thực hiện";
      case MilestoneStatus.Completed:
        return "Hoàn thành";
      case MilestoneStatus.Delayed:
        return "Bị trễ";
      case MilestoneStatus.Cancelled:
        return "Đã hủy";
      default:
        return status;
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
      <DialogTitle sx={{ pb: 1 }}>
        {mode === 'edit' ? 'Chỉnh sửa mốc công việc' : 'Tạo mốc công việc mới'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <TextField
            label="Tiêu đề mốc công việc"
            value={formData.title}
            onChange={handleInputChange("title")}
            fullWidth
            required
            placeholder="Nhập tiêu đề mốc công việc..."
          />

          <TextField
            label="Mô tả"
            value={formData.description}
            onChange={handleInputChange("description")}
            fullWidth
            multiline
            rows={3}
            placeholder="Mô tả chi tiết về mốc công việc..."
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Ngày hạn"
              value={formData.dueDate}
              onChange={handleDateChange}
              format="dd/MM/yyyy"
              slotProps={{ textField: { placeholder: "DD/MM/YYYY" } }}
            />
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={formData.status}
              onChange={handleSelectChange("status")}
              label="Trạng thái"
            >
              {Object.values(MilestoneStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {getStatusText(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>Tiến độ ({formData.progress}%)</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Slider
                value={formData.progress}
                onChange={handleSliderChange}
                aria-labelledby="progress-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
                sx={{ flex: 1 }}
              />
              <TextField
                  value={formData.progress}
                  onChange={handleProgressInputChange}
                  type="number"
                  inputProps={{
                      style: {
                          width: '50px',
                          textAlign: 'center'
                      },
                      min: 0,
                      max: 100
                  }}
              />
            </Box>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Người được giao</InputLabel>
            <Select
              value={formData.assignedTo}
              onChange={handleSelectChange("assignedTo")}
              label="Giao cho"
            >
              <MenuItem value="">
                    <em>Chưa giao</em>
                  </MenuItem>
              {availableMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>Tags</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TextField
                label="Thêm tag mới"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button onClick={handleAddTag} variant="outlined" size="small">Thêm</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
            </Box>
          </Box>

          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleClose} startIcon={<CloseIcon />}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={<SaveIcon />}
        >
          {loading ? "Đang lưu..." : (mode === 'edit' ? 'Lưu thay đổi' : 'Tạo mốc công việc')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MilestoneDialog; 