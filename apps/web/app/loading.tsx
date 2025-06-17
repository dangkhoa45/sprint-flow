import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
export default function Loading() {
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
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        zIndex: 9999,
      }}
    >
      {/* Linear progress bar at top */}
      <LinearProgress
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
        }}
      />
      
      {/* Main loading content */}
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: 'primary.main',
          mb: 3,
        }}
      />
      
      <Typography
        variant="h6"
        color="text.primary"
        sx={{
          mb: 1,
          fontWeight: 500,
        }}
      >
        Đang tải...
      </Typography>
      
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          textAlign: 'center',
          maxWidth: 300,
        }}
      >
        Vui lòng chờ trong giây lát
      </Typography>
    </Box>
  );
}
