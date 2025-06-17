'use client';

import React, { Component, ReactNode } from 'react';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { BugReport, Refresh, Home } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              textAlign: 'center',
              py: 4,
            }}
          >
            <BugReport
              sx={{
                fontSize: 80,
                color: 'warning.main',
                mb: 2,
              }}
            />
            
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
              }}
            >
              Có lỗi xảy ra
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 400 }}
            >
              Thành phần này đã gặp lỗi. Vui lòng thử lại.
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.setState({ hasError: false, error: undefined })}
                startIcon={<Refresh />}
                size="small"
              >
                Thử lại
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                onClick={() => window.location.href = '/'}
                startIcon={<Home />}
                size="small"
              >
                Về trang chủ
              </Button>
            </Stack>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  maxWidth: '100%',
                  overflow: 'auto',
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: 'monospace' }}
                >
                  {this.state.error.message}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
