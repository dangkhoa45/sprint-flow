'use client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';

interface ProjectErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function ProjectError({
  message = 'Không tìm thấy project',
  onRetry,
}: ProjectErrorProps) {
  const router = useRouter();

  return (
    <Container maxWidth='xl'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: '100%',
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <ErrorOutlineIcon
              sx={{
                fontSize: 80,
                mb: 2,
                color: '#666',
              }}
            />

            <Typography
              variant='h4'
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#1a1a1a',
              }}
            >
              Oops!
            </Typography>

            <Typography
              variant='body1'
              sx={{
                mb: 3,
                color: '#666',
                lineHeight: 1.6,
              }}
            >
              {message}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant='contained'
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/projects')}
                sx={{
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#000',
                  },
                }}
              >
                Quay lại
              </Button>

              {onRetry && (
                <Button
                  variant='outlined'
                  startIcon={<RefreshIcon />}
                  onClick={onRetry}
                  sx={{
                    borderColor: '#666',
                    color: '#666',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#1a1a1a',
                      color: '#1a1a1a',
                      backgroundColor: '#f8f9fa',
                    },
                  }}
                >
                  Thử lại
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
