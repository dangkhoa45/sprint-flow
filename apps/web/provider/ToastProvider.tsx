"use client";
import { createContext, ReactNode, useContext } from "react";
import ToastContainer from "../components/ToastContainer";
import { ToastMessage, useToast } from "../hooks/useToast";

interface ToastContextType {
  addToast: (message: string, severity?: ToastMessage["severity"], duration?: number) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, addToast, removeToast, clearAllToasts } = useToast();

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemoveAction={removeToast} />
    </ToastContext.Provider>
  );
}
