'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  const handleGoHome = () => {
    router.push('/');
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
        <ErrorOutlineIcon
          sx={{
            fontSize: 120,
            color: 'error.main',
            mb: 3,
          }}
        />
        
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
          }}
        >
          Oops! Có lỗi xảy ra
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 600 }}
        >
          Ứng dụng đã gặp phải một lỗi không mong muốn. 
          Vui lòng thử lại hoặc quay về trang chủ.
        </Typography>

        {process.env.NODE_ENV === 'development' && (
          <Box
            sx={{
              mb: 4,
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.300',
              maxWidth: '100%',
              overflow: 'auto',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: 'monospace' }}
            >
              {error.message}
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={reset}
            startIcon={<RefreshIcon />}
            size="large"
          >
            Thử lại
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGoHome}
            startIcon={<HomeIcon />}
            size="large"
          >
            Về trang chủ
          </Button>
          
          <Button
            variant="text"
            color="primary"
            onClick={handleRefresh}
            size="large"
          >
            Tải lại trang
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
