import { AttachmentType } from "../types/attachment";

export const getAttachmentTypeColor = (type: AttachmentType): string => {
  switch (type) {
    case AttachmentType.DOCUMENT:
      return "#3b82f6";
    case AttachmentType.IMAGE:
      return "#10b981";
    case AttachmentType.VIDEO:
      return "#8b5cf6";
    case AttachmentType.AUDIO:
      return "#f59e0b";
    case AttachmentType.ARCHIVE:
      return "#f97316";
    case AttachmentType.OTHER:
      return "#64748b";
    default:
      return "#64748b";
  }
};

export const getAttachmentTypeText = (type: AttachmentType): string => {
  switch (type) {
    case AttachmentType.DOCUMENT:
      return "Tài liệu";
    case AttachmentType.IMAGE:
      return "Hình ảnh";
    case AttachmentType.VIDEO:
      return "Video";
    case AttachmentType.AUDIO:
      return "Âm thanh";
    case AttachmentType.ARCHIVE:
      return "Nén";
    case AttachmentType.OTHER:
      return "Khác";
    default:
      return type;
  }
};

export const getAttachmentTypeIcon = (type: AttachmentType): string => {
  switch (type) {
    case AttachmentType.DOCUMENT:
      return "📄";
    case AttachmentType.IMAGE:
      return "🖼️";
    case AttachmentType.VIDEO:
      return "🎥";
    case AttachmentType.AUDIO:
      return "🎵";
    case AttachmentType.ARCHIVE:
      return "📦";
    case AttachmentType.OTHER:
      return "📎";
    default:
      return "📎";
  }
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
};

export const isVideoFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext);
};

export const isAudioFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ['mp3', 'wav', 'ogg', 'aac', 'flac', 'wma'].includes(ext);
};

export const isArchiveFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext);
};

export const isDocumentFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'].includes(ext);
};

export const getAttachmentTypeFromFilename = (filename: string): AttachmentType => {
  if (isImageFile(filename)) return AttachmentType.IMAGE;
  if (isVideoFile(filename)) return AttachmentType.VIDEO;
  if (isAudioFile(filename)) return AttachmentType.AUDIO;
  if (isArchiveFile(filename)) return AttachmentType.ARCHIVE;
  if (isDocumentFile(filename)) return AttachmentType.DOCUMENT;
  return AttachmentType.OTHER;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}; 