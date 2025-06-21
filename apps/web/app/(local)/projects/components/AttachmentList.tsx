"use client";
import { attachmentsApi } from "@/api/attachments";
import { useToast } from "@/hooks/useToast";
import { Attachment, AttachmentType } from "@/types/attachment";
import { formatFileSize, getAttachmentTypeColor, getAttachmentTypeIcon, getAttachmentTypeText } from "@/utils/attachmentHelpers";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import GetAppIcon from "@mui/icons-material/GetApp";
import ImageIcon from "@mui/icons-material/Image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";

interface AttachmentListProps {
  attachments: Attachment[];
  mutate: () => void;
}

const AttachmentList = ({ attachments, mutate }: AttachmentListProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  const { success, error: toastError } = useToast();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, attachment: Attachment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAttachment(attachment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAttachment(null);
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      const blob = await attachmentsApi.downloadAttachment(attachment._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      success("Tải file thành công!");
    } catch (err: any) {
      toastError(err.message || "Tải file thất bại");
    }
  };

  const handleDelete = async (attachment: Attachment) => {
    try {
      await attachmentsApi.deleteAttachment(attachment._id);
      success("Xóa file thành công!");
      mutate();
    } catch (err: any) {
      toastError(err.message || "Xóa file thất bại");
    }
  };

  const handleMenuAction = (action: 'download' | 'delete') => {
    if (!selectedAttachment) return;
    
    if (action === 'download') {
      handleDownload(selectedAttachment);
    } else if (action === 'delete') {
      handleDelete(selectedAttachment);
    }
    handleMenuClose();
  };

  const getFileIcon = (type: AttachmentType) => {
    switch (type) {
      case AttachmentType.IMAGE:
        return <ImageIcon />;
      case AttachmentType.VIDEO:
        return <VideoFileIcon />;
      case AttachmentType.DOCUMENT:
        return <DescriptionIcon />;
      case AttachmentType.ARCHIVE:
        return <DescriptionIcon />;
      case AttachmentType.AUDIO:
        return <DescriptionIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const sortedAttachments = [...attachments].sort((a, b) => {
    return new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime();
  });

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Files ({attachments.length})
      </Typography>

      {attachments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Chưa có file nào được upload
          </Typography>
        </Paper>
      ) : (
        <List>
          {sortedAttachments.map((attachment) => (
            <Card key={attachment._id} sx={{ mb: 2 }}>
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getFileIcon(attachment.type)}
                    </ListItemIcon>
                    
                    <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                      <Typography variant="body1" fontWeight={500} noWrap>
                        {attachment.originalName}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                        <Chip
                          label={getAttachmentTypeText(attachment.type)}
                          size="small"
                          icon={<span>{getAttachmentTypeIcon(attachment.type)}</span>}
                          sx={{
                            backgroundColor: getAttachmentTypeColor(attachment.type) + '20',
                            color: getAttachmentTypeColor(attachment.type),
                            border: `1px solid ${getAttachmentTypeColor(attachment.type)}40`,
                          }}
                        />
                        
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(attachment.size)}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {attachment.uploadedBy.displayName || attachment.uploadedBy.username}
                          </Typography>
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(attachment.createdAt as string)}
                        </Typography>
                      </Box>
                      
                      {attachment.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {attachment.description}
                        </Typography>
                      )}
                      
                      {attachment.tags && attachment.tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                          {attachment.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(attachment)}
                      title="Tải xuống"
                    >
                      <GetAppIcon />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, attachment)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction('download')}>
          <CloudDownloadIcon fontSize="small" sx={{ mr: 1 }} />
          Tải xuống
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Xóa
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AttachmentList; 