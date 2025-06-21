import { MilestoneStatus } from "../types/milestone";

export const getMilestoneStatusColor = (status: MilestoneStatus): string => {
  switch (status) {
    case MilestoneStatus.Pending:
      return "#f59e0b";
    case MilestoneStatus.InProgress:
      return "#10b981";
    case MilestoneStatus.Completed:
      return "#6366f1";
    case MilestoneStatus.Delayed:
      return "#f97316";
    case MilestoneStatus.Cancelled:
      return "#ef4444";
    default:
      return "#64748b";
  }
};

export const getMilestoneStatusText = (status: MilestoneStatus): string => {
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

export const getMilestoneStatusIcon = (status: MilestoneStatus): string => {
  switch (status) {
    case MilestoneStatus.Pending:
      return "⏳";
    case MilestoneStatus.InProgress:
      return "🔄";
    case MilestoneStatus.Completed:
      return "✅";
    case MilestoneStatus.Delayed:
      return "⚠️";
    case MilestoneStatus.Cancelled:
      return "❌";
    default:
      return "📋";
  }
};

export const isMilestoneOverdue = (dueDate: string): boolean => {
  const due = new Date(dueDate);
  const now = new Date();
  return due < now;
};

export const getMilestoneProgressColor = (progress: number): string => {
  if (progress >= 80) return "#10b981";
  if (progress >= 60) return "#f59e0b";
  if (progress >= 40) return "#f97316";
  return "#ef4444";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}; 