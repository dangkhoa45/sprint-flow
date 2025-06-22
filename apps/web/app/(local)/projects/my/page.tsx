'use client';
import { useProjects } from '@/hooks/useProjects';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import ProjectFormDialog from '../components/ProjectFormDialog';
import ProjectGrid from '../components/ProjectGrid';
import ProjectStats from '../components/ProjectStats';

export default function MyProjectsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { projects, isLoading, error, mutate } = useProjects();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 600, mb: 0.5 }}>
            Dự án của tôi
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Các dự án mà bạn là chủ sở hữu hoặc thành viên chính
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
          }}
        >
          Tạo dự án mới
        </Button>
      </Box>

      <ProjectStats />

      <ProjectGrid
        projects={projects}
        isLoading={isLoading}
        error={error}
      />

      <ProjectFormDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        mode='create'
        mutate={mutate}
      />
    </Box>
  );
}
