import { API_HOST } from "../config/env";
import {
  Attachment,
  AttachmentQueryDto,
  AttachmentStats,
  CreateAttachmentDto,
} from "../types/attachment";
import { fetcher } from "../utils/fetcher";

export const attachmentsApi = {
  // Get all attachments with query
  getAttachments: async (query?: AttachmentQueryDto) => {
    return fetcher<{
      data: Attachment[];
      total: number;
      page: number;
      limit: number;
    }>({
      path: `${API_HOST}/api/attachments`,
      method: "GET",
      params: query,
    });
  },

  // Get attachment by ID
  getAttachment: async (id: string) => {
    return fetcher<Attachment>({
      path: `${API_HOST}/api/attachments/${id}`,
      method: "GET",
    });
  },

  // Upload file to project
  uploadAttachment: async (
    projectId: string,
    file: File,
    data: CreateAttachmentDto,
    onProgress?: (progress: number) => void
  ): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', data.tags.join(','));
    }

    const response = await fetcher<Attachment>({
      path: `${API_HOST}/api/attachments/${projectId}/upload`,
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
      onUploadProgress: onProgress,
    });

    return response;
  },

  // Delete attachment
  deleteAttachment: async (id: string) => {
    return fetcher<{ message: string }>({
      path: `${API_HOST}/api/attachments/${id}`,
      method: "DELETE",
    });
  },

  // Get project attachments
  getProjectAttachments: async (projectId: string) => {
    return fetcher<Attachment[]>({
      path: `${API_HOST}/api/attachments/project/${projectId}`,
      method: "GET",
    });
  },

  // Get attachment statistics
  getAttachmentStats: async (projectId?: string) => {
    return fetcher<AttachmentStats>({
      path: `${API_HOST}/api/attachments/stats`,
      method: "GET",
      params: projectId ? { projectId } : undefined,
    });
  },

  // Download file
  downloadAttachment: async (id: string) => {
    return fetcher<Blob>({
      path: `${API_HOST}/api/attachments/${id}/download`,
      method: "GET",
      responseType: 'blob',
    });
  },

  // Get file URL
  getFileUrl: (attachment: Attachment) => {
    return `${API_HOST}/uploads/attachments/${attachment.filename}`;
  },
}; 