'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import LoadingComponent from '../../../components/LoadingComponent';

export default function ProjectsLoading() {
  return (
    <Box
      sx={{
        py: 4,
        position: "relative",
        minHeight: "calc(100vh - 180px)",
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={1}>
              <Skeleton variant="text" width={200} height={40} />
              <Skeleton variant="text" width={300} height={24} />
            </Stack>
            <Skeleton variant="rectangular" width={120} height={40} />
          </Stack>

          {/* Filter and Search Section */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="rectangular" width={200} height={40} />
            <Skeleton variant="rectangular" width={150} height={40} />
            <Skeleton variant="rectangular" width={100} height={40} />
          </Stack>
        </Stack>

        {/* Stats Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          {[...Array(4)].map((_, index) => (
            <Card key={index} sx={{ p: 3, textAlign: 'center' }}>
              <Skeleton variant="circular" width={56} height={56} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" width="60%" height={32} sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" width="40%" height={20} sx={{ mx: 'auto' }} />
            </Card>
          ))}
        </Box>

        {/* Projects Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {[...Array(6)].map((_, index) => (
            <Card 
              key={index}
              sx={{ 
                p: 3,
                height: 280,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
                {/* Project Header */}
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack spacing={1} sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={24} />
                      <Skeleton variant="text" width="90%" height={20} />
                    </Stack>
                    <Skeleton variant="circular" width={32} height={32} />
                  </Stack>

                  {/* Status and Priority */}
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="rounded" width={80} height={24} />
                    <Skeleton variant="rounded" width={60} height={24} />
                  </Stack>

                  {/* Progress */}
                  <Stack spacing={1}>
                    <Skeleton variant="text" width="50%" height={16} />
                    <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 1 }} />
                  </Stack>

                  {/* Team Members */}
                  <Stack direction="row" spacing={1}>
                    {[...Array(3)].map((_, memberIndex) => (
                      <Skeleton key={memberIndex} variant="circular" width={32} height={32} />
                    ))}
                  </Stack>
                </Stack>

                {/* Actions */}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Skeleton variant="rectangular" width={80} height={32} />
                  <Skeleton variant="rectangular" width={60} height={32} />
                </Stack>
              </Card>
            ))}
        </Box>

        {/* Loading indicator */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <LoadingComponent 
            variant="circular" 
            message="Đang tải danh sách dự án..." 
            size="medium"
          />
        </Box>
      </Container>
    </Box>
  );
}
