import { attachmentsApi } from "@/api/attachments";
import { Attachment, AttachmentQueryDto } from "@/types/attachment";
import useSWR from "swr";

export const useAttachments = (query?: AttachmentQueryDto) => {
  const { data, error, isLoading, mutate } = useSWR(
    query ? ['attachments', query] : null,
    () => attachmentsApi.getAttachments(query)
  );

  return {
    attachments: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    isLoading,
    error,
    mutate,
  };
};

export const useProjectAttachments = (projectId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    projectId ? ['project-attachments', projectId] : null,
    () => attachmentsApi.getProjectAttachments(projectId)
  );

  return {
    attachments: data || [],
    isLoading,
    error,
    mutate,
  };
};

export const useAttachment = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['attachment', id] : null,
    () => attachmentsApi.getAttachment(id)
  );

  return {
    attachment: data,
    isLoading,
    error,
    mutate,
  };
};

export const useAttachmentStats = (projectId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    ['attachment-stats', projectId],
    () => attachmentsApi.getAttachmentStats(projectId)
  );

  return {
    stats: data,
    isLoading,
    error,
    mutate,
  };
}; 