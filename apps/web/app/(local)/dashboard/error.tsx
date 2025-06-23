'use client';

import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ErrorPage from '@/components/ErrorPage';
import { log } from '@/utils/logger';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  const router = useRouter();

  useEffect(() => {
    log('Dashboard Error:', error);
  }, [error]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleRetry = () => {
    reset();
  };

  const getErrorType = (): 'general' | '404' | '403' | '500' => {
    if (error.message.includes('404') || error.message.includes('Not Found')) {
      return '404';
    }
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      return '403';
    }
    if (
      error.message.includes('500') ||
      error.message.includes('Internal Server Error')
    ) {
      return '500';
    }
    return 'general';
  };

  const customActions = (
    <Stack direction='row' spacing={2} sx={{ mt: 2 }}>
      <Button
        variant='contained'
        startIcon={<RefreshIcon />}
        onClick={handleRetry}
        sx={{ minWidth: 120 }}
      >
        Thử lại
      </Button>
      <Button
        variant='outlined'
        startIcon={<HomeIcon />}
        onClick={handleGoHome}
        sx={{ minWidth: 120 }}
      >
        Về trang chủ
      </Button>
    </Stack>
  );

  return (
    <Box
      sx={{
        py: 4,
        position: 'relative',
        minHeight: 'calc(100vh - 180px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ErrorPage
        type={getErrorType()}
        title='Lỗi Dashboard'
        message={
          error.message ||
          'Đã xảy ra lỗi khi tải dashboard. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.'
        }
        customActions={customActions}
      />
    </Box>
  );
}
