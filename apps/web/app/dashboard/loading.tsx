'use client';

import LoadingComponent from '../../components/LoadingComponent';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

export default function DashboardLoading() {
  return (
    <Box
      sx={{
        py: 4,
        position: "relative",
        minHeight: "calc(100vh - 180px)",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          height: "calc(100vh - 180px)",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Header Skeleton */}
        <Stack alignItems="center" spacing={2} sx={{ mb: 5 }}>
          <Skeleton 
            variant="text" 
            width={200} 
            height={60}
            sx={{ fontSize: '2rem' }}
          />
          <Skeleton 
            variant="text" 
            width={400} 
            height={30}
            sx={{ fontSize: '1.25rem' }}
          />
        </Stack>

        {/* Dashboard Grid Skeleton */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          {[...Array(8)].map((_, index) => (
            <Card 
              key={index}
              sx={{ 
                p: 3,
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Stack spacing={2}>
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={20} />
              </Stack>
              <Skeleton variant="rectangular" width="100%" height={32} />
            </Card>
          ))}
        </Box>

        {/* Loading indicator */}
        <Box sx={{ mt: 4 }}>
          <LoadingComponent 
            variant="circular" 
            message="Đang tải dashboard..." 
            size="medium"
          />
        </Box>
      </Container>
    </Box>
  );
}
