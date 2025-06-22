'use client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import { createAppTheme } from '../app/theme';
import { useThemeMode } from './ThemeContext';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useThemeMode();
  const theme = createAppTheme(resolvedTheme);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
