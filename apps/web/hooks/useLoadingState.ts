import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useToast } from "./useToast";

interface UseLoadingStateOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { addToast } = useToast();

  const {
    onSuccess,
    onError,
    redirectOnSuccess,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  const execute = useCallback(
    async <T>(
      asyncFunction: () => Promise<T>,
      successMessage = "Thao tác thành công"
    ): Promise<T | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await asyncFunction();

        if (showSuccessToast) {
          addToast(successMessage, "success");
        }

        onSuccess?.();

        if (redirectOnSuccess) {
          router.push(redirectOnSuccess);
        }

        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Đã có lỗi xảy ra");
        setError(error);

        if (showErrorToast) {
          addToast(error.message || "Đã có lỗi xảy ra", "error");
        }

        onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [
      onSuccess,
      onError,
      redirectOnSuccess,
      showSuccessToast,
      showErrorToast,
      router,
      addToast,
    ]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    execute,
    reset,
  };
}
