"use client";
import { useTheme } from "@mui/material/styles";
import {
  Project,
  ProjectPriority,
  ProjectStatus,
} from "@/types/project";
import { useProjectTableConfig } from "./ProjectTableConfig";
import ReusableDataGrid from "@/components/ReusableDataGrid";

interface ProjectListProps {
  searchQuery: string;
}

const mockProjects: Project[] = [
  {
    _id: "1",
    name: "Nền tảng Thương mại điện tử",
    description:
      "Xây dựng hệ thống thương mại điện tử hiện đại với React và Node.js",
    status: ProjectStatus.InProgress,
    priority: ProjectPriority.High,
    progress: 75,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    owner: {
      _id: "user1",
      displayName: "Nguyễn Văn A",
      username: "nguyenvana",
      role: "Admin" as any,
      status: "Active" as any,
      avatar: "/avatars/user1.jpg",
    },
    members: [
      {
        _id: "user2",
        displayName: "Trần Thị B",
        username: "tranthib",
        role: "User" as any,
        status: "Active" as any,
      },
      {
        _id: "user3",
        displayName: "Lê Văn C",
        username: "levanc",
        role: "User" as any,
        status: "Active" as any,
      },
    ],
    actualHours: 320,
    actualCost: 0,
    tags: ["React", "Node.js", "MongoDB"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    _id: "2",
    name: "Ứng dụng di động iOS",
    description: "Phát triển ứng dụng mobile native cho iOS",
    status: ProjectStatus.Planning,
    priority: ProjectPriority.Medium,
    progress: 25,
    startDate: "2024-02-01",
    endDate: "2024-08-30",
    owner: {
      _id: "user2",
      displayName: "Trần Thị B",
      username: "tranthib",
      role: "User" as any,
      status: "Active" as any,
      avatar: "/avatars/user2.jpg",
    },
    members: [
      {
        _id: "user1",
        displayName: "Nguyễn Văn A",
        username: "nguyenvana",
        role: "Admin" as any,
        status: "Active" as any,
      },
    ],
    actualHours: 80,
    actualCost: 0,
    tags: ["iOS", "Swift", "Mobile"],
    createdAt: "2024-01-15",
    updatedAt: "2024-02-01",
  },
  {
    _id: "3",
    name: "Hệ thống CRM",
    description: "Xây dựng hệ thống quản lý khách hàng tích hợp AI",
    status: ProjectStatus.Completed,
    priority: ProjectPriority.Critical,
    progress: 100,
    startDate: "2023-10-01",
    endDate: "2024-01-31",
    owner: {
      _id: "user3",
      displayName: "Lê Văn C",
      username: "levanc",
      role: "User" as any,
      status: "Active" as any,
      avatar: "/avatars/user3.jpg",
    },
    members: [
      {
        _id: "user1",
        displayName: "Nguyễn Văn A",
        username: "nguyenvana",
        role: "Admin" as any,
        status: "Active" as any,
      },
      {
        _id: "user2",
        displayName: "Trần Thị B",
        username: "tranthib",
        role: "User" as any,
        status: "Active" as any,
      },
    ],
    actualHours: 640,
    actualCost: 0,
    tags: ["CRM", "AI", "Python"],
    createdAt: "2023-10-01",
    updatedAt: "2024-01-31",
  },
];

const ProjectList = ({ searchQuery }: ProjectListProps) => {
  const theme = useTheme();

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (id: string) => {
    console.log("Xem chi tiết dự án:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Chỉnh sửa dự án:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Xóa dự án:", id);
  };

  const { columns, mapProjectsToRows } = useProjectTableConfig({
    theme,
    onViewAction: handleView,
    onEditAction: handleEdit,
    onDeleteAction: handleDelete,
  });

  const rows = mapProjectsToRows(filteredProjects);

  return (
    <ReusableDataGrid
      rows={rows}
      columns={columns}
      height={600}
      checkboxSelection={true}
      disableRowSelectionOnClick={true}
      disableColumnMenu={true}
      pageSizeOptions={[5, 10, 25, 50]}
      initialPageSize={10}
      getRowHeight={() => "auto"}
    />
  );
};

export default ProjectList;
