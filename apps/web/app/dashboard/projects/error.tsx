'use client';

import { useEffect } from 'react';
import ErrorPage from '../../../components/ErrorPage';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import DashboardIcon from '@mui/icons-material/Dashboard';
interface ProjectsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectsError({
  error,
  reset,
}: ProjectsErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Projects Error:', error);
  }, [error]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoDashboard = () => {
    router.push('/dashboard');
  };

  const handleRetry = () => {
    reset();
  };

  // Determine error type based on error message or status
  const getErrorType = (): 'general' | '404' | '403' | '500' => {
    if (error.message.includes('404') || error.message.includes('Not Found')) {
      return '404';
    }
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      return '403';
    }
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      return '500';
    }
    return 'general';
  };

  const customActions = (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={handleRetry}
        sx={{ minWidth: 120 }}
      >
        Thử lại
      </Button>
      <Button
        variant="outlined"
        startIcon={<DashboardIcon />}
        onClick={handleGoDashboard}
        sx={{ minWidth: 120 }}
      >
        Dashboard
      </Button>
      <Button
        variant="outlined"
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
        position: "relative",
        minHeight: "calc(100vh - 180px)",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <ErrorPage
        type={getErrorType()}
        title="Lỗi Dự Án"
        message={
          error.message || 
          'Đã xảy ra lỗi khi tải danh sách dự án. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.'
        }
        customActions={customActions}
      />
    </Box>
  );
}
