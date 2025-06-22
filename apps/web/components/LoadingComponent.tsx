import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export type LoadingVariant = 'circular' | 'linear' | 'skeleton' | 'dots';

interface LoadingProps {
  loadingPage?: boolean;
  variant?: LoadingVariant;
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

function LoadingComponent({
  loadingPage = false,
  variant = 'circular',
  message = 'Đang tải...',
  size = 'medium',
}: LoadingProps) {
  const sizeConfig = {
    small: { progress: 30, fontSize: '0.875rem' },
    medium: { progress: 40, fontSize: '1rem' },
    large: { progress: 60, fontSize: '1.125rem' },
  };

  const currentSize = sizeConfig[size];

  const renderLoadingContent = () => {
    switch (variant) {
      case 'linear':
        return (
          <>
            <LinearProgress
              sx={{
                width: '100%',
                maxWidth: 300,
                mb: 2,
              }}
            />
            <Typography
              variant='body1'
              color='text.secondary'
              sx={{ fontSize: currentSize.fontSize }}
            >
              {message}
            </Typography>
          </>
        );

      case 'skeleton':
        return (
          <Stack spacing={2} sx={{ width: '100%', maxWidth: 300 }}>
            <Skeleton variant='rectangular' height={60} />
            <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
            <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
            <Skeleton
              variant='text'
              sx={{ fontSize: '0.875rem' }}
              width='60%'
            />
          </Stack>
        );

      case 'dots':
        return (
          <Stack direction='row' spacing={1} alignItems='center'>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%, 80%, 100%': { transform: 'scale(0)' },
                  '40%': { transform: 'scale(1)' },
                },
              }}
            />
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: 'pulse 1.5s infinite 0.1s',
                '@keyframes pulse': {
                  '0%, 80%, 100%': { transform: 'scale(0)' },
                  '40%': { transform: 'scale(1)' },
                },
              }}
            />
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: 'pulse 1.5s infinite 0.2s',
                '@keyframes pulse': {
                  '0%, 80%, 100%': { transform: 'scale(0)' },
                  '40%': { transform: 'scale(1)' },
                },
              }}
            />
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ ml: 2, fontSize: currentSize.fontSize }}
            >
              {message}
            </Typography>
          </Stack>
        );

      default: // circular
        return (
          <>
            <CircularProgress size={currentSize.progress} />
            <Typography
              variant='body1'
              color='text.secondary'
              sx={{
                mt: 2,
                fontSize: currentSize.fontSize,
              }}
            >
              {message}
            </Typography>
          </>
        );
    }
  };

  return (
    <Box
      sx={{
        position: !loadingPage ? 'absolute' : '',
        width: 1,
        height: loadingPage ? '100vh' : 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      {renderLoadingContent()}
    </Box>
  );
}

export default LoadingComponent;
