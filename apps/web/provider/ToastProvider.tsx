'use client';
import { ReactNode } from 'react';
import { ToastContainer } from '../components/ToastContainer';

export const ToastProvider = ({ children }: { children: ReactNode }) => (
  <>
    {children}
    <ToastContainer />
  </>
);
