'use client';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({
  size = 40,
  message,
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const theme = useTheme();

  const container = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
        }),
        ...(!fullScreen && {
          py: 4,
        }),
      }}
    >
      <CircularProgress
        size={size}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
        }}
      />
      {message && (
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ fontWeight: 500 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  return container;
};

export default LoadingSpinner;
