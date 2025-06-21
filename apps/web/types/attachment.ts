import { BaseObject } from "./shared";
import { User } from "./user";

export enum AttachmentType {
  DOCUMENT = "document",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  ARCHIVE = "archive",
  OTHER = "other"
}

export interface Attachment extends BaseObject {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  projectId: string;
  description?: string;
  tags: string[];
  type: AttachmentType;
  uploadedBy: User;
  downloadCount: number;
  metadata?: Record<string, unknown>;
}

export interface CreateAttachmentDto {
  description?: string;
  tags?: string[];
}

export interface AttachmentQueryDto {
  search?: string;
  type?: AttachmentType;
  projectId?: string;
  uploadedBy?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AttachmentStats {
  total: number;
  totalSize: number;
  byType: Record<AttachmentType, number>;
  recentUploads: number;
  popularFiles: Attachment[];
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  filename: string;
} 