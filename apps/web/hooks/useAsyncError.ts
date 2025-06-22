'use client';

import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { useLoading } from './useLoading';

interface AsyncOperationOptions<T = unknown> {
  loadingKey?: string;
  errorType?: 'general' | '404' | '403' | '500' | 'offline';
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  showLoading?: boolean;
}

export function useAsyncError() {
  const { handleError, handleHttpError, clearError } = useErrorHandler();
  const { withLoading } = useLoading();
  const [isExecuting, setIsExecuting] = useState(false);

  const executeAsync = useCallback(
    async <T>(
      operation: () => Promise<T>,
      options: AsyncOperationOptions<T> = {}
    ): Promise<T | null> => {
      const {
        loadingKey = 'default',
        errorType = 'general',
        onSuccess,
        onError,
        showLoading = true,
      } = options;

      setIsExecuting(true);
      clearError(); // Clear previous errors

      try {
        const executeOperation = async () => {
          const result = await operation();
          onSuccess?.(result);
          return result;
        };

        const result = showLoading
          ? await withLoading(executeOperation, loadingKey)
          : await executeOperation();

        return result;
      } catch (error) {
        const err = error as Error;

        // Handle HTTP errors
        if (err.message.includes('404')) {
          handleHttpError(404);
        } else if (err.message.includes('403')) {
          handleHttpError(403);
        } else if (err.message.includes('500')) {
          handleHttpError(500);
        } else if (err.message.includes('Network')) {
          handleError(err, 'offline');
        } else {
          handleError(err, errorType);
        }

        onError?.(err);
        return null;
      } finally {
        setIsExecuting(false);
      }
    },
    [handleError, handleHttpError, clearError, withLoading]
  );

  const executeFetch = useCallback(
    async (
      url: string,
      options: RequestInit = {},
      asyncOptions: AsyncOperationOptions = {}
    ) => {
      return executeAsync(async () => {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }

        return response.text();
      }, asyncOptions);
    },
    [executeAsync]
  );

  return {
    executeAsync,
    executeFetch,
    isExecuting,
  };
}
