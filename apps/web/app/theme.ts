'use client';
import { Inter } from 'next/font/google';
import { createTheme, PaletteMode } from '@mui/material/styles';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

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
};

// Modern Minimal Theme Creator
export const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? colorTokens.primary : colorTokens.white,
        light: mode === 'light' ? colorTokens.gray[400] : colorTokens.gray[100],
        dark: mode === 'light' ? colorTokens.gray[500] : colorTokens.gray[300],
        contrastText:
          mode === 'light' ? colorTokens.white : colorTokens.primary,
      },
      secondary: {
        main: colorTokens.secondary,
        light: colorTokens.indigo[300],
        dark: colorTokens.indigo[700],
        contrastText: colorTokens.white,
      },
      error: {
        main: colorTokens.danger,
        light: colorTokens.red[300],
        dark: colorTokens.red[700],
        contrastText: colorTokens.white,
      },
      warning: {
        main: colorTokens.warning,
        light: colorTokens.amber[300],
        dark: colorTokens.amber[700],
        contrastText: colorTokens.white,
      },
      info: {
        main: colorTokens.info,
        light: colorTokens.indigo[300],
        dark: colorTokens.indigo[700],
        contrastText: colorTokens.white,
      },
      success: {
        main: colorTokens.success,
        light: colorTokens.emerald[300],
        dark: colorTokens.emerald[700],
        contrastText: colorTokens.white,
      },
      background:
        mode === 'light'
          ? {
              default: colorTokens.white,
              paper: colorTokens.white,
            }
          : {
              default: colorTokens.gray[500],
              paper: colorTokens.gray[400],
            },
      text:
        mode === 'light'
          ? {
              primary: colorTokens.gray[500],
              secondary: colorTokens.gray[250],
              disabled: colorTokens.gray[200],
            }
          : {
              primary: colorTokens.gray[50],
              secondary: colorTokens.gray[150],
              disabled: colorTokens.gray[200],
            },
      divider: mode === 'light' ? colorTokens.gray[100] : colorTokens.gray[350],
      action:
        mode === 'light'
          ? {
              active: colorTokens.gray[250],
              hover: colorTokens.gray[25],
              selected: colorTokens.gray[50],
              disabled: colorTokens.gray[200],
              disabledBackground: colorTokens.gray[50],
            }
          : {
              active: colorTokens.gray[150],
              hover: colorTokens.gray[400],
              selected: colorTokens.gray[350],
              disabled: colorTokens.gray[200],
              disabledBackground: colorTokens.gray[400],
            },
    },
    typography: {
      fontFamily: inter.style.fontFamily,
      fontSize: 14,
      h1: {
        fontSize: '2.25rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontSize: '1.875rem',
        fontWeight: 600,
        lineHeight: 1.25,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.02em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.6,
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.75,
        color: 'rgba(0, 0, 0, 0.6)',
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.57,
        color: 'rgba(0, 0, 0, 0.6)',
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.43,
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.75,
        textTransform: 'none',
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.66,
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 2.66,
        textTransform: 'uppercase',
      },
    },
    spacing: 8,
    shape: {
      borderRadius: 8,
    },
    components: {
      // Modern Card Component
      MuiCard: {
        styleOverrides: {
          root: ({ theme: _theme }) => ({
            boxShadow:
              mode === 'light'
                ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                : '0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06)',
            border: `1px solid ${_theme.palette.divider}`,
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow:
                mode === 'light'
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  : '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)',
            },
          }),
        },
      },

      // Modern Button Component
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            minHeight: 40,
            paddingX: 16,
            paddingY: 8,
            transition: 'all 0.2s ease-in-out',
          },
          contained: ({ theme }) => ({
            boxShadow: 'none',
            '&:hover': {
              boxShadow: `0 2px 4px 0 ${theme.palette.primary.main}20`,
            },
          }),
          outlined: ({ theme }) => ({
            borderColor: theme.palette.divider,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              borderColor: theme.palette.primary.main,
            },
          }),
          text: ({ theme }) => ({
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }),
        },
      },

      // Modern Chip Component
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontSize: '0.75rem',
            fontWeight: 500,
            height: 24,
          },
          sizeSmall: {
            height: 20,
            fontSize: '0.6875rem',
          },
        },
      },

      // Modern Typography
      MuiTypography: {
        styleOverrides: {
          h1: {
            fontWeight: 700,
            fontSize: '1.75rem',
            lineHeight: 1.2,
          },
          h2: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.25,
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.3,
          },
          h4: {
            fontWeight: 500,
            fontSize: '1.125rem',
            lineHeight: 1.4,
          },
          h5: {
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          h6: {
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.6,
          },
          body1: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
          },
          body2: {
            fontSize: '0.75rem',
            lineHeight: 1.43,
          },
          caption: {
            fontSize: '0.6875rem',
            lineHeight: 1.66,
          },
        },
      },

      // Modern Paper Component
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            border: `1px solid ${theme.palette.divider}`,
          }),
          elevation1: ({ theme }) => ({
            boxShadow:
              mode === 'light'
                ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                : '0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06)',
          }),
        },
      },

      // Modern TextField
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              fontSize: '0.875rem',
              '& fieldset': {
                borderColor: colorTokens.gray[100],
              },
              '&:hover fieldset': {
                borderColor: colorTokens.gray[200],
              },
              '&.Mui-focused fieldset': {
                borderWidth: 1,
              },
            },
          },
        },
      },

      // Modern Scrollbar and additional components
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'light' ? '#f1f1f1' : '#2c2c2c',
            },
            '&::-webkit-scrollbar-thumb': {
              background: mode === 'light' ? '#c1c1c1' : '#555',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: mode === 'light' ? '#a8a8a8' : '#777',
            },
          },
        },
      },

      // Enhanced App Bar
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            backgroundColor:
              mode === 'light' ? colorTokens.white : colorTokens.gray[400],
            color:
              mode === 'light' ? colorTokens.gray[500] : colorTokens.gray[50],
            borderBottom: `1px solid ${mode === 'light' ? colorTokens.gray[100] : colorTokens.gray[350]}`,
          },
        },
      },

      // Enhanced Toolbar
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: '64px !important',
            paddingLeft: '16px !important',
            paddingRight: '16px !important',
          },
        },
      },

      // Enhanced IconButton
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&:hover': {
              backgroundColor:
                mode === 'light' ? colorTokens.gray[25] : colorTokens.gray[350],
            },
          },
        },
      },

      // Enhanced Dialog
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
          },
        },
      },

      // Enhanced Menu
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },

      // Enhanced Alert
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });

// Project-specific style utilities
export const projectStyles = {
  statusColors: {
    Planning: {
      light: colorTokens.indigo[50],
      main: colorTokens.indigo[500],
      dark: colorTokens.indigo[700],
    },
    InProgress: {
      light: colorTokens.amber[50],
      main: colorTokens.amber[500],
      dark: colorTokens.amber[700],
    },
    Completed: {
      light: colorTokens.emerald[50],
      main: colorTokens.emerald[500],
      dark: colorTokens.emerald[700],
    },
    OnHold: {
      light: colorTokens.gray[50],
      main: colorTokens.gray[400],
      dark: colorTokens.gray[600],
    },
    Cancelled: {
      light: colorTokens.red[50],
      main: colorTokens.red[500],
      dark: colorTokens.red[700],
    },
  },
  priorityColors: {
    Low: {
      light: colorTokens.gray[50],
      main: colorTokens.gray[400],
      dark: colorTokens.gray[600],
    },
    Medium: {
      light: colorTokens.indigo[50],
      main: colorTokens.indigo[500],
      dark: colorTokens.indigo[700],
    },
    High: {
      light: colorTokens.amber[50],
      main: colorTokens.amber[500],
      dark: colorTokens.amber[700],
    },
    Critical: {
      light: colorTokens.red[50],
      main: colorTokens.red[500],
      dark: colorTokens.red[700],
    },
  },
  cardStyles: {
    minimal: {
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        borderColor: 'primary.main',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
    compact: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid',
      borderColor: 'divider',
    },
  },
};

// Default theme (light mode)
const theme = createAppTheme('light');

export default theme;
