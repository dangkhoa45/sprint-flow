// Modern Minimal Color System
export const colorTokens = {
  // Primary colors - Clean and minimal
  primary: '#1a1a1a',
  secondary: '#6366f1',
  success: '#10b981',
  info: '#3b82f6',
  warning: '#f59e0b',
  danger: '#ef4444',

  // Modern color scales
  gray: {
    25: '#fafafa',
    50: '#f5f5f5',
    75: '#f0f0f0',
    100: '#e5e5e5',
    150: '#d4d4d4',
    200: '#a3a3a3',
    250: '#737373',
    300: '#525252',
    350: '#404040',
    400: '#262626',
    500: '#171717',
    600: '#0a0a0a',
    700: '#000000',
    750: '#000000',
    800: '#000000',
    850: '#000000',
    900: '#000000',
  },

  // Accent colors
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Base colors
  white: '#ffffff',
  black: '#000000',
} as const;

export type ColorTokens = typeof colorTokens; 