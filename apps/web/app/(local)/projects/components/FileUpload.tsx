"use client";
import { attachmentsApi } from "@/api/attachments";
import { CreateAttachmentDto } from "@/types/attachment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { formatFileSize } from "@/utils/attachmentHelpers";

interface FileUploadProps {
  projectId: string;
  onUploadSuccess?: () => void;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
}

const FileUpload = ({ 
  projectId, 
  onUploadSuccess, 
  maxFileSize = 100 * 1024 * 1024,
  acceptedTypes = ['*/*']
}: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { success, error: toastError } = useToast();

  const handleFileSelect = (file: File) => {
    if (file.size > maxFileSize) {
      toastError(`File quá lớn. Kích thước tối đa: ${formatFileSize(maxFileSize)}`);
      return;
    }
    setSelectedFile(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const uploadData: CreateAttachmentDto = {
        description: description.trim() || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };

      await attachmentsApi.uploadAttachment(
        projectId,
        selectedFile,
        uploadData,
        (progress) => setUploadProgress(progress)
      );

      success("Upload file thành công!");
      setSelectedFile(null);
      setDescription("");
      setTags("");
      setUploadProgress(0);
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Upload file thất bại";
      toastError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  return (
    <Paper
      sx={{
        p: 3,
        border: `2px dashed ${dragActive ? 'primary.main' : 'divider'}`,
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        backgroundColor: dragActive ? 'action.hover' : 'background.paper',
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Tải lên tệp
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Kéo thả tệp vào đây hoặc nhấp để chọn tệp
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Kích thước tối đa: {formatFileSize(maxFileSize)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="outlined"
          component="label"
          disabled={isUploading}
          sx={{ alignSelf: 'center' }}
        >
          Chọn tệp
          <input
            type="file"
            hidden
            onChange={handleFileInputChange}
            accept={acceptedTypes.join(',')}
          />
        </Button>

        {selectedFile && (
          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 2, backgroundColor: 'action.hover' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {selectedFile.name}
                </Typography>
                <Button
                  size="small"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                  startIcon={<DeleteIcon />}
                >
                  Xóa
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(selectedFile.size)}
              </Typography>
            </Paper>
          </Box>
        )}

        {selectedFile && (
          <>
            <TextField
              label="Mô tả (tùy chọn)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              size="small"
              placeholder="Mô tả về tệp..."
            />

            <TextField
              label="Tags (tùy chọn)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              fullWidth
              size="small"
              placeholder="tag1, tag2, tag3..."
              helperText="Phân cách các thẻ bằng dấu phẩy"
            />

            {isUploading && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2">
                    Đang tải lên... {uploadProgress}%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={isUploading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {isUploading ? "Đang tải lên..." : "Tải lên tệp"}
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default FileUpload; 