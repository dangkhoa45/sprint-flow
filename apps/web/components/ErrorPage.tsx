'use client';

import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { ErrorOutline, Warning, Block, CloudOff, Search, Home, Refresh, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export type ErrorType = '404' | '403' | '500' | 'offline' | 'general';

interface ErrorPageProps {
  type: ErrorType;
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showRefreshButton?: boolean;
  customActions?: React.ReactNode;
}

const errorConfig = {
  '404': {
    icon: Search,
    color: 'warning.main',
    defaultTitle: 'Không tìm thấy trang',
    defaultMessage: 'Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc không tồn tại.',
    code: '404'
  },
  '403': {
    icon: Block,
    color: 'error.main',
    defaultTitle: 'Truy cập bị từ chối',
    defaultMessage: 'Bạn không có quyền truy cập vào trang này.',
    code: '403'
  },
  '500': {
    icon: ErrorOutline,
    color: 'error.main',
    defaultTitle: 'Lỗi máy chủ nội bộ',
    defaultMessage: 'Máy chủ đã gặp phải một lỗi không mong muốn.',
    code: '500'
  },
  offline: {
    icon: CloudOff,
    color: 'grey.500',
    defaultTitle: 'Không có kết nối mạng',
    defaultMessage: 'Bạn hiện không có kết nối internet.',
    code: null
  },
  general: {
    icon: Warning,
    color: 'warning.main',
    defaultTitle: 'Có lỗi xảy ra',
    defaultMessage: 'Đã xảy ra lỗi không mong muốn.',
    code: null
  }
};

export default function ErrorPage({
  type,
  title,
  message,
  showBackButton = true,
  showRefreshButton = true,
  customActions
}: ErrorPageProps) {
  const router = useRouter();
  const config = errorConfig[type];
  const IconComponent = config.icon;

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 4,
        }}
      >
        <IconComponent
          sx={{
            fontSize: 120,
            color: config.color,
            mb: 3,
          }}
        />
        
        {config.code && (
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 'bold',
              color: config.color,
              mb: 2,
            }}
          >
            {config.code}
          </Typography>
        )}
        
        <Typography
          variant="h4"
          component={config.code ? "h2" : "h1"}
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 2,
          }}
        >
          {title || config.defaultTitle}
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 600 }}
        >
          {message || config.defaultMessage}
        </Typography>

        {customActions || (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              onClick={handleGoHome}
              variant="contained"
              color="primary"
              startIcon={<Home />}
              size="large"
            >
              Về trang chủ
            </Button>
            
            {showRefreshButton && (
              <Button
                onClick={handleRefresh}
                variant="outlined"
                color="primary"
                startIcon={<Refresh />}
                size="large"
              >
                Tải lại
              </Button>
            )}
            
            {showBackButton && (
              <Button
                onClick={handleGoBack}
                variant="text"
                color="primary"
                startIcon={<ArrowBack />}
                size="large"
              >
                Quay lại
              </Button>
            )}
          </Stack>
        )}
      </Box>
    </Container>
  );
}
