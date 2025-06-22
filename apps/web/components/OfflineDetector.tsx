'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { WifiOff, Refresh } from '@mui/icons-material';

interface OfflineDetectorProps {
  children: React.ReactNode;
}

export default function OfflineDetector({ children }: OfflineDetectorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    // Kiểm tra trạng thái kết nối hiện tại
    setIsOnline(navigator.onLine);

    // Lắng nghe sự kiện thay đổi kết nối
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      setShowOfflineMessage(false);
      window.location.reload();
    }
  };

  if (!isOnline && showOfflineMessage) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          zIndex: 9999,
          textAlign: 'center',
          p: 3,
        }}
      >
        <WifiOff
          sx={{
            fontSize: 80,
            color: 'grey.500',
            mb: 2,
          }}
        />

        <Typography
          variant='h5'
          component='h1'
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Không có kết nối mạng
        </Typography>

        <Typography
          variant='body1'
          color='text.secondary'
          sx={{ mb: 3, maxWidth: 400 }}
        >
          Vui lòng kiểm tra kết nối internet và thử lại
        </Typography>

        <Button
          variant='contained'
          onClick={handleRetry}
          startIcon={<Refresh />}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  // Hiển thị thanh thông báo nhỏ khi mất kết nối
  return (
    <>
      {!isOnline && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bgcolor: 'warning.main',
            color: 'warning.contrastText',
            py: 1,
            px: 2,
            zIndex: 9999,
            textAlign: 'center',
          }}
        >
          <Typography variant='body2'>
            <WifiOff sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
            Không có kết nối mạng
          </Typography>
        </Box>
      )}
      <Box sx={{ pt: !isOnline ? 6 : 0 }}>{children}</Box>
    </>
  );
}
