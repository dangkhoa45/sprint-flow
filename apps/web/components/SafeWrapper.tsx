"use client";

import { Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";
import LoadingComponent from "./LoadingComponent";

interface SafeWrapperProps {
  children: React.ReactNode;
  loadingMessage?: string;
  loadingVariant?: "circular" | "linear" | "skeleton" | "dots";
  errorFallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showLoadingPage?: boolean;
}

export default function SafeWrapper({
  children,
  loadingMessage = "Đang tải...",
  loadingVariant = "circular",
  errorFallback,
  onError,
  showLoadingPage = false,
}: SafeWrapperProps) {
  return (
    <ErrorBoundary fallback={errorFallback} onError={onError}>
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
}
