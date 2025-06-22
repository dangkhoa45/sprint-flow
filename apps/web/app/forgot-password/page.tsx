'use client';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset instructions have been sent to your email.');
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: theme => theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '90%',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.95)',
          p: { xs: 4, md: 6 },
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography
            variant='h4'
            sx={{ fontWeight: 'bold', mb: 2, color: '#1f2937' }}
          >
            Forgot Password?
          </Typography>
          <Typography variant='body1' sx={{ color: '#6b7280', mb: 4 }}>
            No worries, we&apos;ll send you reset instructions.
          </Typography>
        </Box>

        <Box component='form' onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='body2'
              sx={{
                color: '#6b7280',
                mb: 1,
                fontWeight: 500,
              }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              variant='outlined'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <EmailOutlinedIcon sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: '2px solid #3b82f6',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          <Button
            type='submit'
            fullWidth
            variant='contained'
            disabled={isLoading}
            sx={{
              py: 1.5,
              mb: 3,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              '&:disabled': {
                backgroundColor: '#9ca3af',
              },
            }}
          >
            {isLoading ? 'Sending...' : 'Reset Password'}
          </Button>

          {message && (
            <Alert
              severity='success'
              sx={{
                mb: 3,
                borderRadius: '12px',
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                '& .MuiAlert-icon': {
                  color: '#15803d',
                },
              }}
            >
              {message}
            </Alert>
          )}

          {error && (
            <Alert
              severity='error'
              sx={{
                mb: 3,
                borderRadius: '12px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                '& .MuiAlert-icon': {
                  color: '#dc2626',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Link
              href='/login'
              variant='body2'
              sx={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              ← Back to login
            </Link>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
