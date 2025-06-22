'use client';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningIcon from '@mui/icons-material/Warning';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../provider/ThemeContext';

interface LogoutConfirmDialogProps {
  open: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void;
  loading?: boolean;
}

export default function LogoutConfirmDialog({
  open,
  onCloseAction,
  onConfirmAction,
  loading = false,
}: LogoutConfirmDialogProps) {
  const theme = useTheme();
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.6)'
            : '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2,
          color: theme.palette.warning.main,
        }}
      >
        <WarningIcon sx={{ fontSize: 28, color: theme.palette.warning.main }} />
        <Typography
          variant='h5'
          component='div'
          fontWeight='bold'
          sx={{ color: theme.palette.text.primary }}
        >
          Xác nhận đăng xuất
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 2,
          }}
        >
          <LogoutIcon
            sx={{
              fontSize: 64,
              color: isDark ? '#ffffff' : '#000000',
              mb: 2,
              opacity: 0.8,
            }}
          />
          <Typography
            variant='h6'
            align='center'
            sx={{
              mb: 1,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Bạn có chắc chắn muốn đăng xuất?
          </Typography>
          <Typography
            variant='body2'
            align='center'
            sx={{ color: theme.palette.text.secondary }}
          >
            Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng hệ thống.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button
          onClick={onCloseAction}
          variant='outlined'
          sx={{
            flex: 1,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            '&:hover': {
              borderColor: theme.palette.text.secondary,
              backgroundColor: theme.palette.action.hover,
            },
          }}
          disabled={loading}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={onConfirmAction}
          variant='contained'
          startIcon={<LogoutIcon />}
          sx={{
            flex: 1,
            backgroundColor: isDark ? '#ffffff' : '#000000',
            color: isDark ? '#000000' : '#ffffff',
            '&:hover': {
              backgroundColor: isDark ? '#f5f5f5' : '#333333',
              transform: 'translateY(-1px)',
              boxShadow: isDark
                ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                : '0 4px 12px rgba(255, 255, 255, 0.2)',
            },
            transition: 'all 0.3s ease',
          }}
          disabled={loading}
        >
          {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
