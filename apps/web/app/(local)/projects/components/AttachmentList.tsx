'use client';
import { attachmentsApi } from '@/api/attachments';
import { useToast } from '@/hooks/useToast';
import { Attachment, AttachmentType } from '@/types/attachment';
import {
  formatFileSize,
  getAttachmentTypeIcon,
} from '@/utils/attachmentHelpers';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import {
  CardActionArea,
  CardMedia,
  Grid,
  Divider,
  Chip,
  Stack,
  Link,
  useTheme,
  alpha,
  Paper,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface AttachmentListProps {
  attachments: Attachment[];
  mutate: () => void;
}

const AttachmentCard = ({
  attachment,
  onPreview,
  onDelete,
  isSelected,
}: {
  attachment: Attachment;
  onPreview: (attachment: Attachment) => void;
  onDelete: (attachment: Attachment) => void;
  isSelected: boolean;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const _handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // This is a placeholder. The actual download is handled by the preview component.
    // We can't directly download here easily because the download logic is in the parent.
    // For now, let's just log it. Or we can pass down the download handler.
    // Let's defer this decision.
    handleMenuClose();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(attachment);
    handleMenuClose();
  };

  const isImage = attachment.type === AttachmentType.IMAGE;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'box-shadow 0.3s, background-color 0.3s',
        '&:hover': {
          boxShadow: 6,
        },
        backgroundColor: isSelected
          ? alpha(theme.palette.primary.main, 0.1)
          : 'transparent',
        border: isSelected
          ? `1px solid ${theme.palette.primary.main}`
          : '1px solid transparent',
      }}
      onClick={() => onPreview(attachment)}
    >
      <CardActionArea
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Box
          sx={{
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: isImage ? 'grey.100' : 'transparent',
          }}
        >
          {isImage ? (
            <CardMedia
              component='img'
              image={attachmentsApi.getFileUrl(attachment)}
              alt={attachment.originalName}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Typography sx={{ fontSize: '3rem' }}>
              {getAttachmentTypeIcon(attachment.type)}
            </Typography>
          )}
        </Box>
        <CardContent sx={{ width: '100%', p: 1.5 }}>
          <Typography
            variant='body2'
            fontWeight={600}
            title={attachment.originalName}
            noWrap
          >
            {attachment.originalName}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {formatFileSize(attachment.size)}
          </Typography>
        </CardContent>
      </CardActionArea>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          pb: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <PersonIcon fontSize='small' sx={{ mr: 0.5, color: 'grey.600' }} />
          <Typography variant='caption' noWrap>
            {attachment.uploadedBy.displayName ||
              attachment.uploadedBy.username}
          </Typography>
        </Box>
        <IconButton size='small' onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* The download logic will be on the preview pane */}
        {/* <MenuItem onClick={_handleDownloadClick}>
          <GetAppIcon fontSize="small" sx={{ mr: 1 }} />
          Tải xuống
        </MenuItem> */}
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize='small' sx={{ mr: 1 }} />
          Xóa
        </MenuItem>
      </Menu>
    </Card>
  );
};

const FilePreview = ({
  attachment,
  onClose,
  onDownload: _onDownload,
}: {
  attachment: Attachment;
  onClose: () => void;
  onDownload: (attachment: Attachment) => void;
}) => {
  const isImage = attachment.type === AttachmentType.IMAGE;
  const isPdf = attachment.type === AttachmentType.PDF;
  const isPreviewable = isImage || isPdf;

  const fileUrl = attachmentsApi.getFileUrl(attachment);

  return (
    <Paper
      variant='outlined'
      sx={{
        p: 2,
        height: 'calc(100vh - 220px)',
        position: 'sticky',
        top: '100px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ mb: 2 }}
      >
        <Typography variant='h6' fontWeight={600} noWrap>
          {attachment.originalName}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider sx={{ mb: 2 }} />

      {isPreviewable ? (
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'grey.100',
            borderRadius: 1,
          }}
        >
          {isImage && (
            <img
              src={fileUrl}
              alt={attachment.originalName}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          )}
          {isPdf && (
            <iframe
              src={fileUrl}
              title={attachment.originalName}
              width='100%'
              height='100%'
              style={{ border: 'none' }}
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant='h4' sx={{ mb: 2 }}>
            {getAttachmentTypeIcon(attachment.type)}
          </Typography>
          <Typography sx={{ mb: 1 }}>Không thể xem trước file này.</Typography>
          <Typography variant='caption' color='text.secondary'>
            Bạn có thể tải về để xem.
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1}>
        <Typography variant='subtitle2' fontWeight={600}>
          Chi tiết
        </Typography>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='body2' color='text.secondary'>
            Loại file
          </Typography>
          <Chip label={attachment.type.toUpperCase()} size='small' />
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='body2' color='text.secondary'>
            Kích thước
          </Typography>
          <Typography variant='body2' fontWeight={500}>
            {formatFileSize(attachment.size)}
          </Typography>
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='body2' color='text.secondary'>
            Người đăng
          </Typography>
          <Typography variant='body2' fontWeight={500}>
            {attachment.uploadedBy.displayName ||
              attachment.uploadedBy.username}
          </Typography>
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='body2' color='text.secondary'>
            Ngày đăng
          </Typography>
          <Typography variant='body2' fontWeight={500}>
            {new Date(attachment.createdAt as string).toLocaleString()}
          </Typography>
        </Stack>
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Link
          href={fileUrl}
          target='_blank'
          rel='noopener noreferrer'
          underline='none'
        >
          <IconButton sx={{ mr: 1 }}>
            <GetAppIcon />
          </IconButton>
          Tải xuống
        </Link>
      </Box>
    </Paper>
  );
};

const AttachmentList = ({ attachments, mutate }: AttachmentListProps) => {
  const { success, error: toastError } = useToast();
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(null);

  const _handleDownloadClick = async (attachment: Attachment) => {
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
      success('Tải file thành công!');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Tải file thất bại';
      toastError(errorMessage);
    }
  };

  const handleDelete = async (attachment: Attachment) => {
    try {
      if (selectedAttachment?._id === attachment._id) {
        setSelectedAttachment(null);
      }
      await attachmentsApi.deleteAttachment(attachment._id);
      success('Xóa file thành công!');
      mutate();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Xóa file thất bại';
      toastError(errorMessage);
    }
  };

  const handlePreview = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
  };

  const handleClosePreview = () => {
    setSelectedAttachment(null);
  };

  const sortedAttachments = [...attachments].sort(
    (a, b) =>
      new Date(b.createdAt as string).getTime() -
      new Date(a.createdAt as string).getTime()
  );

  return (
    <Box>
      <Typography variant='h6' fontWeight={600} sx={{ mb: 3 }}>
        Files ({attachments.length})
      </Typography>

      {attachments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='body1' color='text.secondary'>
            Chưa có file nào được upload
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid xs={12} md={selectedAttachment ? 8 : 12}>
            <Grid container spacing={2}>
              {sortedAttachments.map(attachment => (
                <Grid key={attachment._id} xs={12} sm={6} md={4} lg={3}>
                  <AttachmentCard
                    attachment={attachment}
                    onPreview={handlePreview}
                    onDelete={handleDelete}
                    isSelected={selectedAttachment?._id === attachment._id}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          {selectedAttachment && (
            <Grid xs={12} md={4}>
              <FilePreview
                attachment={selectedAttachment}
                onClose={handleClosePreview}
                onDownload={_handleDownloadClick}
              />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default AttachmentList;
