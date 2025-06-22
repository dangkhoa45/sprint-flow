'use client';
import { toast } from 'react-toastify';

export const useToast = () => {
  return {
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warn,
  };
};
