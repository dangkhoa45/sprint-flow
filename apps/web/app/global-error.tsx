'use client';

import { useEffect } from 'react';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { Warning, Home, Refresh } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <html>
      <body>
        <Container maxWidth='md'>
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
            <Warning
              sx={{
                fontSize: 120,
                color: 'error.main',
                mb: 3,
              }}
            />

            <Typography
              variant='h3'
              component='h1'
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
              }}
            >
              Lỗi nghiêm trọng
            </Typography>

            <Typography
              variant='h6'
              color='text.secondary'
              sx={{ mb: 4, maxWidth: 600 }}
            >
              Ứng dụng đã gặp phải một lỗi nghiêm trọng và cần được khởi động
              lại.
            </Typography>

            <Stack direction='row' spacing={2}>
              <Button
                variant='contained'
                color='primary'
                onClick={reset}
                startIcon={<Refresh />}
                size='large'
              >
                Khởi động lại
              </Button>

              <Button
                variant='outlined'
                color='primary'
                onClick={handleGoHome}
                startIcon={<Home />}
                size='large'
              >
                Về trang chủ
              </Button>
            </Stack>
          </Box>
        </Container>
      </body>
    </html>
  );
}
