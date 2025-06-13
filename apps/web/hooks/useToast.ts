"use client";
import { useState, useCallback } from "react";

export interface ToastMessage {
  id: string;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (message: string, severity: ToastMessage["severity"] = "info", duration = 4000) => {
      const id = Math.random().toString(36).substring(7);
      const toast: ToastMessage = { id, message, severity, duration };
      
      setToasts((prev) => [...prev, toast]);

      // Auto remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
  };
}
