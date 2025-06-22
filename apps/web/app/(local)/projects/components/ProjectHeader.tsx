'use client';
import { Project } from '@/types/project';
import {
  getProjectPriorityText,
  getStatusColor,
  getStatusText,
} from '@/utils/projectHelpers';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FlagIcon from '@mui/icons-material/Flag';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';

interface ProjectHeaderProps {
  project: Project;
  onEdit: () => void;
}

export default function ProjectHeader({ project, onEdit }: ProjectHeaderProps) {
  const router = useRouter();

  return (
    <>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          color='inherit'
          href='/projects'
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
          onClick={e => {
            e.preventDefault();
            router.push('/projects');
          }}
        >
          <ArrowBackIcon sx={{ mr: 0.5 }} fontSize='small' />
          Dự án
        </Link>
        <Typography color='text.primary' fontWeight={500}>
          {project.name}
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant='h5' component='h1' fontWeight={600}>
          {project.name}
        </Typography>
        <Button
          variant='contained'
          startIcon={<EditIcon />}
          onClick={onEdit}
          sx={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#000',
            },
          }}
        >
          Chỉnh sửa dự án
        </Button>
      </Box>

      {project.description && (
        <Typography
          variant='body1'
          color='text.secondary'
          sx={{
            mb: 3,
            maxWidth: '80ch',
          }}
        >
          {project.description}
        </Typography>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 'auto' }}>
          <Chip
            label={`Trạng thái: ${getStatusText(project.status)}`}
            size='small'
            sx={{
              backgroundColor: `${getStatusColor(project.status)}15`,
              color: getStatusColor(project.status),
              fontWeight: 500,
              height: '28px',
              fontSize: '0.8rem',
              '.MuiChip-label': {
                paddingX: '10px',
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 'auto' }}>
          <Chip
            label={`Độ ưu tiên: ${getProjectPriorityText(project.priority)}`}
            icon={<FlagIcon />}
            variant='outlined'
            size='small'
            sx={{
              height: '28px',
              fontSize: '0.8rem',
              '.MuiChip-label': {
                paddingX: '10px',
              },
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography
            variant='body2'
            sx={{ color: 'text.secondary', fontWeight: 500 }}
          >
            Tiến độ
          </Typography>
          <Typography variant='body2' fontWeight={600} color='text.primary'>
            {project.progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant='determinate'
          value={project.progress}
          sx={{
            height: 6,
            borderRadius: 3,
          }}
        />
      </Box>
    </>
  );
}
