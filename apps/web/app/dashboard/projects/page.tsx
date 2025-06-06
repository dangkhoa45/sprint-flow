"use client";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Project,
  ProjectFilters,
  ProjectPriority,
  ProjectStats,
  ProjectStatus,
} from "../../../types/project";
import CreateProjectDialog from "./components/CreateProjectDialog";
import DeleteProjectDialog from "./components/DeleteProjectDialog";
import EditProjectDialog from "./components/EditProjectDialog";
import ProjectsGrid from "./components/ProjectsGrid";
import ProjectsHeader from "./components/ProjectsHeader";
import ProjectsStats from "./components/ProjectsStats";

const mockProjects: Project[] = [
  {
    _id: "1",
    name: "SprintFlow Mobile App",
    description:
      "Phát triển ứng dụng mobile cho hệ thống quản lý dự án SprintFlow với React Native",
    status: ProjectStatus.IN_PROGRESS,
    priority: ProjectPriority.HIGH,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-06-30"),
    progress: 75,
    budget: 50000,
    owner: {
      _id: "user1",
      username: "john_doe",
      displayName: "John Doe",
      role: "owner",
    },
    members: [
      {
        _id: "user1",
        username: "john_doe",
        displayName: "John Doe",
        role: "owner",
      },
      {
        _id: "user2",
        username: "jane_smith",
        displayName: "Jane Smith",
        role: "manager",
      },
      {
        _id: "user3",
        username: "bob_wilson",
        displayName: "Bob Wilson",
        role: "member",
      },
    ],
    tasksCount: 24,
    completedTasks: 18,
    tags: ["React Native", "Mobile", "iOS", "Android"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    _id: "2",
    name: "Website Redesign",
    description:
      "Thiết kế lại website công ty với UI/UX hiện đại và responsive",
    status: ProjectStatus.PLANNING,
    priority: ProjectPriority.MEDIUM,
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-08-15"),
    progress: 25,
    budget: 30000,
    owner: {
      _id: "user2",
      username: "jane_smith",
      displayName: "Jane Smith",
      role: "owner",
    },
    members: [
      {
        _id: "user2",
        username: "jane_smith",
        displayName: "Jane Smith",
        role: "owner",
      },
      {
        _id: "user4",
        username: "alice_brown",
        displayName: "Alice Brown",
        role: "member",
      },
    ],
    tasksCount: 16,
    completedTasks: 4,
    tags: ["UI/UX", "Web Design", "Frontend"],
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-05-18"),
  },
  {
    _id: "3",
    name: "API Integration",
    description: "Tích hợp các API bên thứ ba và tối ưu hóa hiệu suất backend",
    status: ProjectStatus.COMPLETED,
    priority: ProjectPriority.URGENT,
    startDate: new Date("2023-11-01"),
    endDate: new Date("2024-02-28"),
    progress: 100,
    budget: 25000,
    owner: {
      _id: "user3",
      username: "bob_wilson",
      displayName: "Bob Wilson",
      role: "owner",
    },
    members: [
      {
        _id: "user3",
        username: "bob_wilson",
        displayName: "Bob Wilson",
        role: "owner",
      },
      {
        _id: "user5",
        username: "charlie_davis",
        displayName: "Charlie Davis",
        role: "member",
      },
    ],
    tasksCount: 12,
    completedTasks: 12,
    tags: ["Backend", "API", "Integration"],
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2024-02-28"),
  },
  {
    _id: "4",
    name: "Database Migration",
    description:
      "Di chuyển dữ liệu từ MongoDB sang PostgreSQL và tối ưu hóa queries",
    status: ProjectStatus.ON_HOLD,
    priority: ProjectPriority.LOW,
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-07-31"),
    progress: 40,
    owner: {
      _id: "user4",
      username: "alice_brown",
      displayName: "Alice Brown",
      role: "owner",
    },
    members: [
      {
        _id: "user4",
        username: "alice_brown",
        displayName: "Alice Brown",
        role: "owner",
      },
    ],
    tasksCount: 8,
    completedTasks: 3,
    tags: ["Database", "Migration", "PostgreSQL"],
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-05-10"),
  },
  {
    _id: "5",
    name: "Security Audit",
    description: "Kiểm tra bảo mật toàn diện và cập nhật các biện pháp bảo vệ",
    status: ProjectStatus.IN_PROGRESS,
    priority: ProjectPriority.HIGH,
    startDate: new Date("2024-05-01"),
    endDate: new Date("2024-08-30"),
    progress: 60,
    budget: 40000,
    owner: {
      _id: "user5",
      username: "charlie_davis",
      displayName: "Charlie Davis",
      role: "owner",
    },
    members: [
      {
        _id: "user5",
        username: "charlie_davis",
        displayName: "Charlie Davis",
        role: "owner",
      },
      {
        _id: "user1",
        username: "john_doe",
        displayName: "John Doe",
        role: "member",
      },
      {
        _id: "user3",
        username: "bob_wilson",
        displayName: "Bob Wilson",
        role: "member",
      },
    ],
    tasksCount: 20,
    completedTasks: 12,
    tags: ["Security", "Audit", "Penetration Testing"],
    createdAt: new Date("2024-04-20"),
    updatedAt: new Date("2024-05-22"),
  },
];

const mockStats: ProjectStats = {
  total: 12,
  planning: 3,
  inProgress: 5,
  completed: 3,
  onHold: 1,
  cancelled: 0,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [stats, setStats] = useState<ProjectStats>(mockStats);
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const handleFiltersChange = (newFilters: ProjectFilters) => {
    setFilters(newFilters);
    // TODO: Apply filters to projects
  };

  const handleCreateProject = async (projectData: any) => {
    setLoading(true);
    try {
      // TODO: API call to create project
      console.log("Creating project:", projectData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = async (
    projectId: string,
    projectData: Partial<Project>
  ) => {
    setLoading(true);
    try {
      // TODO: API call to update project
      console.log("Updating project:", projectId, projectData);

      // Update local state for demo
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? { ...p, ...projectData } : p))
      );

      setIsEditDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setLoading(true);
    try {
      // TODO: API call to delete project
      console.log("Deleting project:", projectId);

      // Update local state for demo
      setProjects((prev) => prev.filter((p) => p._id !== projectId));

      // Update stats
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));

      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = (project: Project) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDetail = (project: Project) => {
    route.push(`/dashboard/projects/${project._id}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 3,
      }}
    >
      <ProjectsHeader
        onCreateProjectAction={() => setIsCreateDialogOpen(true)}
        onFiltersChangeAction={handleFiltersChange}
        filters={filters}
      />

      <ProjectsStats stats={stats} />

      <ProjectsGrid
        projects={projects}
        loading={loading}
        onCreateProject={() => setIsCreateDialogOpen(true)}
        onEditProject={handleOpenEditDialog}
        onDeleteProject={handleOpenDeleteDialog}
        onViewProject={handleDetail}
      />

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onCloseAction={() => setIsCreateDialogOpen(false)}
        onSubmitAction={handleCreateProject}
        loading={loading}
      />

      <EditProjectDialog
        open={isEditDialogOpen}
        project={selectedProject}
        onCloseAction={() => setIsEditDialogOpen(false)}
        onSubmitAction={handleEditProject}
        loading={loading}
      />

      <DeleteProjectDialog
        open={isDeleteDialogOpen}
        project={selectedProject}
        onCloseAction={() => setIsDeleteDialogOpen(false)}
        onConfirmAction={handleDeleteProject}
        loading={loading}
      />
    </Box>
  );
}
