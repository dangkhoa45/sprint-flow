// Common constants and utilities for reports
import { TaskStatus, TaskPriority } from "../types/report.types";

// Status mappings
export const STATUS_COLORS = {
  [TaskStatus.TODO]: "#6b7280",
  [TaskStatus.IN_PROGRESS]: "#3b82f6", 
  [TaskStatus.IN_REVIEW]: "#f59e0b",
  [TaskStatus.DONE]: "#10b981",
  [TaskStatus.BLOCKED]: "#ef4444"
} as const;

export const STATUS_LABELS = {
  [TaskStatus.TODO]: "Chưa bắt đầu",
  [TaskStatus.IN_PROGRESS]: "Đang thực hiện",
  [TaskStatus.IN_REVIEW]: "Đang xem xét", 
  [TaskStatus.DONE]: "Hoàn thành",
  [TaskStatus.BLOCKED]: "Bị chặn"
} as const;

// Priority mappings
export const PRIORITY_COLORS = {
  [TaskPriority.LOWEST]: "#64748b",
  [TaskPriority.LOW]: "#10b981",
  [TaskPriority.MEDIUM]: "#f59e0b", 
  [TaskPriority.HIGH]: "#ef4444",
  [TaskPriority.URGENT]: "#dc2626"
} as const;

export const PRIORITY_LABELS = {
  [TaskPriority.LOWEST]: "Thấp nhất",
  [TaskPriority.LOW]: "Thấp",
  [TaskPriority.MEDIUM]: "Trung bình",
  [TaskPriority.HIGH]: "Cao", 
  [TaskPriority.URGENT]: "Khẩn cấp"
} as const;

// Chart colors
export const CHART_COLORS = {
  primary: "#3b82f6",
  success: "#10b981", 
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  indigo: "#6366f1",
  pink: "#ec4899",
  teal: "#14b8a6"
} as const;

export const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning, 
  CHART_COLORS.danger,
  CHART_COLORS.purple
] as const;

// Workload levels
export const WORKLOAD_COLORS = {
  light: "#10b981",
  moderate: "#3b82f6",
  heavy: "#f59e0b", 
  overloaded: "#ef4444"
} as const;

export const WORKLOAD_LABELS = {
  light: "Nhẹ",
  moderate: "Vừa phải",
  heavy: "Nặng",
  overloaded: "Quá tải"
} as const;

// Common styles
export const GRADIENT_BACKGROUNDS = {
  primary: "linear-gradient(135deg, #3b82f620, #3b82f610)",
  success: "linear-gradient(135deg, #10b98120, #10b98110)",
  warning: "linear-gradient(135deg, #f59e0b20, #f59e0b10)",
  danger: "linear-gradient(135deg, #ef444420, #ef444410)",
  purple: "linear-gradient(135deg, #8b5cf620, #8b5cf610)"
} as const;

export const GRADIENT_BORDERS = {
  primary: "1px solid #3b82f630",
  success: "1px solid #10b98130", 
  warning: "1px solid #f59e0b30",
  danger: "1px solid #ef444430",
  purple: "1px solid #8b5cf630"
} as const;

// Utility functions
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit", 
    year: "numeric"
  });
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const calculateCompletionRate = (completed: number, total: number): number => {
  return total > 0 ? (completed / total) * 100 : 0;
};

export const generateUserAvatar = (name: string): string => {
  return `hsl(${(name.charCodeAt(0) * 137.5) % 360}, 70%, 50%)`;
};

// Chart tooltip styles
export const CHART_TOOLTIP_STYLE = {
  backgroundColor: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
} as const;
