'use client';
import { useTheme } from '@mui/material/styles';
import { Project, ProjectStatus } from '@/types/project';
import { useProjectTableConfig } from './ProjectTableConfig';
import ReusableDataGrid from '@/components/ReusableDataGrid';
import { projectsApi } from '@/api/projects';
import { useToast } from '@/hooks/useToast';
import { useProjects } from '@/hooks/useProjects';
import { ErrorResponse } from '@/types/shared';

interface ProjectListProps {
  projects: Project[];
  isLoading?: boolean;
  error?: ErrorResponse | undefined;
  onEditProject?: (project: Project) => void;
}

// ProjectList component to display projects in a table
const ProjectList = ({
  projects,
  isLoading,
  error,
  onEditProject,
}: ProjectListProps) => {
  const theme = useTheme();
  const { mutate } = useProjects();
  const { success, error: toastError } = useToast();

  const handleView = (_id: string) => {
    // Navigate to project detail page or show a modal
  };

  const handleEdit = (id: string) => {
    const project = projects.find(p => p._id === id);
    if (project && project.status === ProjectStatus.Completed) {
      alert('Không thể chỉnh sửa dự án đã hoàn thành');
      return;
    }
    if (project && onEditProject) onEditProject(project);
  };

  const handleDelete = async (id: string) => {
    try {
      await projectsApi.deleteProject(id);
      success('Xóa dự án thành công!');
      mutate();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Xóa dự án thất bại';
      toastError(errorMessage);
    }
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
      getRowHeight={() => 'auto'}
    />
  );
};

export default ProjectList;
