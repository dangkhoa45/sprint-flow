'use client';

import { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import LoadingComponent from './LoadingComponent';
import OfflineDetector from './OfflineDetector';
import { LoadingVariant } from './LoadingComponent';

interface AppWrapperProps {
  children: React.ReactNode;
  enableOfflineDetection?: boolean;
  loadingMessage?: string;
  loadingVariant?: LoadingVariant;
  errorFallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showLoadingPage?: boolean;
}

/**
 * Comprehensive wrapper that combines error boundary, loading states, and offline detection
 * Use this for wrapping entire app sections or pages
 */
export default function AppWrapper({
  children,
  enableOfflineDetection = true,
  loadingMessage = 'Đang tải...',
  loadingVariant = 'circular',
  errorFallback,
  onError,
  showLoadingPage = false,
}: AppWrapperProps) {
  const content = (
    <ErrorBoundary
      fallback={errorFallback}
      onError={onError}
    >
      <Suspense
        fallback={
          <LoadingComponent
            loadingPage={showLoadingPage}
            variant={loadingVariant}
            message={loadingMessage}
          />
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );

  if (enableOfflineDetection) {
    return <OfflineDetector>{content}</OfflineDetector>;
  }

  return content;
}
