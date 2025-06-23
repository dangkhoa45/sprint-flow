'use client';
import { Box, CircularProgress } from '@mui/material';

export default function ProjectLoading() {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      minHeight='400px'
    >
      <CircularProgress />
    </Box>
  );
}
