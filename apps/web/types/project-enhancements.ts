export enum ExportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
}

export enum ExportType {
  PROJECTS = 'projects',
  PROJECT_DETAILS = 'project-details',
  ANALYTICS = 'analytics',
}

export interface ExportProjectsDto {
  format: ExportFormat;
  type: ExportType;
  title?: string;
  description?: string;
  status?: string[];
  priority?: string[];
  tags?: string[];
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  owner?: string;
  member?: string;
  search?: string;
  projectId?: string;
}

export interface ExportResponseDto {
  filename: string;
  downloadUrl: string;
  fileSize: number;
  generatedAt: Date;
  expiresAt: Date;
}

export interface ResourceAllocation {
  budget?: number;
  spentBudget?: number;
  teamMembers?: number;
  requiredSkills?: string[];
  allocatedResources?: {
    resourceId: string;
    resourceType: string;
    allocation: number;
    startDate?: string;
    endDate?: string;
  }[];
}

export interface ProjectDependencyInfo {
  projectId: string;
  name: string;
  status: string;
  progress: number;
  endDate?: Date;
  isBlocking: boolean;
}

export interface ProjectDependencyAnalysis {
  dependencies: ProjectDependencyInfo[];
  dependents: ProjectDependencyInfo[];
  canStart: boolean;
  blockedBy: string[];
  blocking: string[];
  criticalPath: string[];
}

export interface TimelineVisualizationData {
  projects: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
    progress: number;
    milestones: {
      id: string;
      title: string;
      dueDate: Date;
      status: string;
      progress: number;
    }[];
  }[];
  timeline: {
    date: Date;
    events: {
      id: string;
      type: string;
      title: string;
      description: string;
      projectId: string;
      projectName: string;
    }[];
  }[];
  ganttData: {
    id: string;
    name: string;
    start: Date;
    end: Date;
    progress: number;
    dependencies: string[];
    type: 'project' | 'milestone';
    parent?: string;
  }[];
}

export interface AdvancedProjectStats {
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
  onHold: number;
  cancelled: number;
  overdue: number;
  averageProgress: number;
  totalEstimatedHours: number;
  totalActualHours: number;
  averageEstimatedHours: number;
  averageActualHours: number;
  projectsCreatedThisMonth: number;
  projectsCompletedThisMonth: number;
  mostUsedTags: { tag: string; count: number }[];
  projectsByPriority: { priority: string; count: number }[];
  projectsByStatus: { status: string; count: number }[];
  efficiencyRatio: number;
}

export interface ResourceUtilization {
  totalBudget: number;
  totalSpent: number;
  totalTeamMembers: number;
  averageUtilization: number;
}
