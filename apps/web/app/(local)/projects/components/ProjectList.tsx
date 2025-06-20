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
  projects: Project[];
  isLoading?: boolean;
  error?: any;
  searchQuery: string;
}

const ProjectList = ({ projects, isLoading, error, searchQuery }: ProjectListProps) => {
  const theme = useTheme();

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

  const rows = mapProjectsToRows(projects);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Lỗi tải dữ liệu dự án!</div>;

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
