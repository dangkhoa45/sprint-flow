'use client';

import { useState, useEffect } from 'react';

type LoadingState = Record<string, boolean>;

export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  // Thiết lập loading cho một key cụ thể
  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading,
    }));
  };

  // Kiểm tra xem có loading nào đang chạy không
  const hasAnyLoading = Object.values(loadingStates).some(Boolean);

  // Tự động cập nhật isLoading khi có bất kỳ loading nào
  useEffect(() => {
    setIsLoading(hasAnyLoading);
  }, [hasAnyLoading]);

  // Wrapper function để thực hiện async operation với loading
  const withLoading = async <T>(
    operation: () => Promise<T>,
    key?: string
  ): Promise<T> => {
    const loadingKey = key || 'default';

    try {
      setLoading(loadingKey, true);
      const result = await operation();
      return result;
    } finally {
      setLoading(loadingKey, false);
    }
  };

  // Clear loading cho một key cụ thể
  const clearLoading = (key: string) => {
    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  // Clear tất cả loading states
  const clearAllLoading = () => {
    setLoadingStates({});
    setIsLoading(false);
  };

  return {
    isLoading,
    loadingStates,
    setLoading,
    withLoading,
    clearLoading,
    clearAllLoading,
    hasAnyLoading,
  };
}
