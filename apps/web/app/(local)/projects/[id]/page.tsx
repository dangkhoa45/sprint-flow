'use client';
import { attachmentsApi } from '@/api/attachments';
import { milestonesApi } from '@/api/milestones';
import { projectsApi } from '@/api/projects';
import { useToast } from '@/hooks/useToast';
import { Attachment } from '@/types/attachment';
import { Milestone } from '@/types/milestone';
import { Project } from '@/types/project';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ProjectDetailWrapper from '../components/ProjectDetailWrapper';
import ProjectError from '../components/ProjectError';
import ProjectFormDialog from '../components/ProjectFormDialog';
import ProjectHeader from '../components/ProjectHeader';
import ProjectLoading from '../components/ProjectLoading';
import ProjectTabs from '../components/ProjectTabs';

export default function ProjectDetailPage() {
  const params = useParams();
  const _router = useRouter();
  const { success: _success, error: toastError } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const projectId = params.id as string;

  const fetchProjectData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectData, milestonesData, attachmentsData] = await Promise.all([
        projectsApi.getProject(projectId),
        milestonesApi.getProjectMilestones(projectId),
        attachmentsApi.getProjectAttachments(projectId),
      ]);

      setProject(projectData);
      setMilestones(milestonesData);
      setAttachments(attachmentsData);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Không thể tải thông tin project';
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [projectId, toastError]);

  useEffect(() => {
    if (projectId) {
      void fetchProjectData();
    }
  }, [projectId, fetchProjectData]);

  const handleEditProject = () => {
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    void fetchProjectData();
    setEditDialogOpen(false);
  };

  return (
    <ProjectDetailWrapper>
      {loading ? (
        <ProjectLoading />
      ) : error || !project ? (
        <ProjectError
          message={error || 'Không tìm thấy project'}
          onRetry={fetchProjectData}
        />
      ) : (
        <>
          <ProjectHeader project={project} onEdit={handleEditProject} />

          <ProjectTabs
            project={project}
            milestones={milestones}
            attachments={attachments}
            projectId={projectId}
            onDataRefresh={fetchProjectData}
          />

          {/* Edit Project Dialog */}
          {project && (
            <ProjectFormDialog
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              mode='edit'
              project={project}
              mutate={handleEditSuccess}
            />
          )}
        </>
      )}
    </ProjectDetailWrapper>
  );
}
