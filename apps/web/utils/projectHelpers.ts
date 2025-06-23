import { ProjectStatus, ProjectPriority } from '@/types/project';

export const getStatusColor = (status: ProjectStatus): string => {
  switch (status) {
    case ProjectStatus.Planning:
      return '#f59e0b';
    case ProjectStatus.InProgress:
      return '#10b981';
    case ProjectStatus.OnHold:
      return '#f97316';
    case ProjectStatus.Completed:
      return '#6366f1';
    case ProjectStatus.Cancelled:
      return '#ef4444';
    default:
      return '#64748b';
  }
};

export const getStatusText = (status: ProjectStatus): string => {
  switch (status) {
    case ProjectStatus.Planning:
      return 'Lập kế hoạch';
    case ProjectStatus.InProgress:
      return 'Đang thực hiện';
    case ProjectStatus.OnHold:
      return 'Tạm dừng';
    case ProjectStatus.Completed:
      return 'Hoàn thành';
    case ProjectStatus.Cancelled:
      return 'Đã hủy';
    default:
      return status;
  }
};

export const getPriorityColor = (priority: ProjectPriority): string => {
  switch (priority) {
    case ProjectPriority.Low:
      return '#10b981';
    case ProjectPriority.Medium:
      return '#f59e0b';
    case ProjectPriority.High:
      return '#f97316';
    case ProjectPriority.Critical:
      return '#ef4444';
    default:
      return '#64748b';
  }
};

export const getPriorityText = (priority: ProjectPriority): string => {
  switch (priority) {
    case ProjectPriority.Low:
      return 'Thấp';
    case ProjectPriority.Medium:
      return 'Trung bình';
    case ProjectPriority.High:
      return 'Cao';
    case ProjectPriority.Critical:
      return 'Khẩn cấp';
    default:
      return priority;
  }
};

export const getProjectPriorityText = (priority: ProjectPriority) => {
  switch (priority) {
    case ProjectPriority.Low:
      return 'Thấp';
    case ProjectPriority.Medium:
      return 'Trung bình';
    case ProjectPriority.High:
      return 'Cao';
    case ProjectPriority.Critical:
      return 'Rất cao';
    default:
      return priority;
  }
};

export const getProjectStatusText = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.Planning:
      return 'Lên kế hoạch';
    case ProjectStatus.InProgress:
      return 'Đang thực hiện';
    case ProjectStatus.OnHold:
      return 'Tạm dừng';
    case ProjectStatus.Completed:
      return 'Hoàn thành';
    case ProjectStatus.Cancelled:
      return 'Đã hủy';
    default:
      return status;
  }
};

export const getProjectStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.Planning:
      return '#f59e0b';
    case ProjectStatus.InProgress:
      return '#10b981';
    case ProjectStatus.OnHold:
      return '#f97316';
    case ProjectStatus.Completed:
      return '#6366f1';
    case ProjectStatus.Cancelled:
      return '#ef4444';
    default:
      return '#64748b';
  }
};
