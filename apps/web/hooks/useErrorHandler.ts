'use client';

import { useState, useCallback } from 'react';
import { ErrorType } from '../components/ErrorPage';
import { log } from '@/utils/logger';

interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorType?: ErrorType;
  errorMessage?: string;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
  });

  const handleError = useCallback(
    (error: Error | string, type: ErrorType = 'general') => {
      const errorObj = typeof error === 'string' ? new Error(error) : error;

      setErrorState({
        hasError: true,
        error: errorObj,
        errorType: type,
        errorMessage: errorObj.message,
      });

      // Log error for debugging
      log('Error handled:', errorObj);

      // You can add error reporting service here
      // Example: reportError(errorObj, type);
    },
    []
  );

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: undefined,
      errorType: undefined,
      errorMessage: undefined,
    });
  }, []);

  const handleHttpError = useCallback(
    (status: number, message?: string) => {
      let errorType: ErrorType = 'general';
      let errorMessage = message || 'Đã xảy ra lỗi';

      switch (status) {
        case 404:
          errorType = '404';
          errorMessage = message || 'Không tìm thấy trang';
          break;
        case 403:
          errorType = '403';
          errorMessage = message || 'Truy cập bị từ chối';
          break;
        case 500:
          errorType = '500';
          errorMessage = message || 'Lỗi máy chủ nội bộ';
          break;
        default:
          errorType = 'general';
          break;
      }

      handleError(new Error(errorMessage), errorType);
    },
    [handleError]
  );

  const handleNetworkError = useCallback(() => {
    handleError(new Error('Không có kết nối mạng'), 'offline');
  }, [handleError]);

  return {
    errorState,
    handleError,
    clearError,
    handleHttpError,
    handleNetworkError,
    hasError: errorState.hasError,
    error: errorState.error,
    errorType: errorState.errorType,
    errorMessage: errorState.errorMessage,
  };
}
