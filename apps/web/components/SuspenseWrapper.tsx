'use client';

import { Suspense, ReactNode } from 'react';
import Box from '@mui/material/Box';
import LoadingComponent from './LoadingComponent';
import ErrorBoundary from './ErrorBoundary';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingMessage?: string;
  errorFallback?: ReactNode;
}

export default function SuspenseWrapper({ 
  children, 
  fallback,
  loadingMessage = 'Đang tải...',
  errorFallback
}: SuspenseWrapperProps) {
  const defaultFallback = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        width: '100%'
      }}
    >
      <LoadingComponent 
        variant="circular" 
        message={loadingMessage}
        size="medium"
      />
    </Box>
  );

  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
