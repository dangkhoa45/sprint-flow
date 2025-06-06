"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Project, ProjectPriority, ProjectStatus } from "../../../../types/project";

interface DeleteProjectDialogProps {
  open: boolean;
  project: Project | null;
  onCloseAction: () => void;
  onConfirmAction: (projectId: string) => void;
  loading?: boolean;
}

const statusConfig = {
  [ProjectStatus.PLANNING]: {
    label: "Lập kế hoạch",
    color: "#2196f3",
    bgColor: "rgba(33, 150, 243, 0.1)",
  },
  [ProjectStatus.IN_PROGRESS]: {
    label: "Đang thực hiện",
    color: "#ff9800",
    bgColor: "rgba(255, 152, 0, 0.1)",
  },
  [ProjectStatus.COMPLETED]: {
    label: "Hoàn thành",
    color: "#4caf50",
    bgColor: "rgba(76, 175, 80, 0.1)",
  },
  [ProjectStatus.ON_HOLD]: {
    label: "Tạm dừng",
    color: "#9e9e9e",
    bgColor: "rgba(158, 158, 158, 0.1)",
  },
  [ProjectStatus.CANCELLED]: {
    label: "Đã hủy",
    color: "#f44336",
    bgColor: "rgba(244, 67, 54, 0.1)",
  },
};

const priorityConfig = {
  [ProjectPriority.LOW]: { label: "Thấp", color: "#4caf50" },
  [ProjectPriority.MEDIUM]: { label: "Trung bình", color: "#ff9800" },
  [ProjectPriority.HIGH]: { label: "Cao", color: "#ff5722" },
  [ProjectPriority.URGENT]: { label: "Khẩn cấp", color: "#f44336" },
};

export default function DeleteProjectDialog({
  open,
  project,
  onCloseAction,
  onConfirmAction,
  loading = false,
}: DeleteProjectDialogProps) {
  if (!project) return null;

  const statusInfo = statusConfig[project.status];
  const priorityInfo = priorityConfig[project.priority];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleConfirm = () => {
    onConfirmAction(project._id);
  };

  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 2,
          color: "#f44336",
        }}
      >
        <WarningIcon sx={{ fontSize: 28 }} />
        <Typography variant="h5" component="div" fontWeight="bold">
          Xác nhận xóa dự án
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {/* Warning Message */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            backgroundColor: "rgba(244, 67, 54, 0.1)",
            border: "1px solid rgba(244, 67, 54, 0.3)",
          }}
        >
          <Typography variant="body1" color="error" fontWeight="medium" gutterBottom>
            ⚠️ Cảnh báo: Hành động này không thể hoàn tác!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Việc xóa dự án sẽ xóa toàn bộ dữ liệu liên quan bao gồm:
          </Typography>
          <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
            <li>
              <Typography variant="body2" color="text.secondary">
                Tất cả tasks và subtasks trong dự án
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Lịch sử hoạt động và nhận xét
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Tài liệu và file đính kèm
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Báo cáo và thống kê
              </Typography>
            </li>
          </Box>
        </Box>

        {/* Project Information */}
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Thông tin dự án sẽ bị xóa:
          </Typography>

          {/* Project Name */}
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            {project.name}
          </Typography>

          {/* Status and Priority */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Chip
              label={statusInfo.label}
              size="small"
              sx={{
                backgroundColor: statusInfo.bgColor,
                color: statusInfo.color,
                fontWeight: "medium",
              }}
            />
            <Chip
              label={priorityInfo.label}
              size="small"
              sx={{
                backgroundColor: `${priorityInfo.color}20`,
                color: priorityInfo.color,
                fontWeight: "medium",
              }}
            />
          </Box>

          {/* Description */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {project.description}
          </Typography>

          {/* Project Stats */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Tiến độ
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{ width: 60, height: 6, borderRadius: 3 }}
                />
                <Typography variant="body2" fontWeight="medium">
                  {project.progress}%
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Tasks
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {project.completedTasks}/{project.tasksCount}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Ngày bắt đầu
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatDate(project.startDate)}
              </Typography>
            </Box>
            {project.endDate && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ngày kết thúc
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatDate(project.endDate)}
                </Typography>
              </Box>
            )}

          </Box>

          {/* Dates */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Ngày bắt đầu
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatDate(project.startDate)}
              </Typography>
            </Box>
            {project.endDate && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ngày kết thúc
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatDate(project.endDate)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Members */}
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Thành viên ({project.members.length})
            </Typography>
            <AvatarGroup max={5} sx={{ justifyContent: "flex-start" }}>
              {project.members.map((member) => (
                <Avatar
                  key={member._id}
                  sx={{ width: 32, height: 32 }}
                  title={member.displayName}
                >
                  {member.displayName[0].toUpperCase()}
                </Avatar>
              ))}
            </AvatarGroup>
          </Box>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                {project.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.75rem" }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Confirmation Text */}
        <Typography
          variant="body1"
          sx={{ mt: 3, fontWeight: "medium", textAlign: "center" }}
        >
          Bạn có chắc chắn muốn xóa dự án "{project.name}" không?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
        <Button
          onClick={onCloseAction}
          variant="outlined"
          sx={{ flex: 1 }}
          disabled={loading}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ flex: 1 }}
          disabled={loading}
        >
          {loading ? "Đang xóa..." : "Xóa dự án"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
