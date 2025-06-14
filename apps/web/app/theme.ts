"use client";
import { Inter } from "next/font/google";
import { createTheme, PaletteMode } from "@mui/material/styles";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Modern Minimal Color System
export const colorTokens = {
  // Primary colors - Clean and minimal
  primary: "#1a1a1a",
  secondary: "#6366f1", 
  success: "#10b981",
  info: "#3b82f6",
  warning: "#f59e0b",
  danger: "#ef4444",

  // Modern color scales
  gray: {
    25: "#fafafa",
    50: "#f5f5f5",
    75: "#f0f0f0",
    100: "#e5e5e5",
    150: "#d4d4d4",
    200: "#a3a3a3",
    250: "#737373",
    300: "#525252",
    350: "#404040",
    400: "#262626",
    500: "#171717",
    600: "#0a0a0a",
    700: "#000000",
    750: "#000000",
    800: "#000000",
    850: "#000000",
    900: "#000000",
  },

  // Accent colors
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },

  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },

  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Base colors
  white: "#ffffff",
  black: "#000000",
};

// Modern Minimal Theme Creator
export const createAppTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? colorTokens.primary : colorTokens.white,
      light: mode === 'light' ? colorTokens.gray[400] : colorTokens.gray[100],
      dark: mode === 'light' ? colorTokens.gray[500] : colorTokens.gray[300],
      contrastText: mode === 'light' ? colorTokens.white : colorTokens.primary,
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
    background: mode === 'light' ? {
      default: colorTokens.white,
      paper: colorTokens.white,
    } : {
      default: colorTokens.gray[500],
      paper: colorTokens.gray[400],
    },
    text: mode === 'light' ? {
      primary: colorTokens.gray[500],
      secondary: colorTokens.gray[250],
      disabled: colorTokens.gray[200],
    } : {
      primary: colorTokens.gray[50],
      secondary: colorTokens.gray[150],
      disabled: colorTokens.gray[200],
    },
    divider: mode === 'light' ? colorTokens.gray[100] : colorTokens.gray[350],
    action: mode === 'light' ? {
      active: colorTokens.gray[250],
      hover: colorTokens.gray[25],
      selected: colorTokens.gray[50],
      disabled: colorTokens.gray[200],
      disabledBackground: colorTokens.gray[50],
    } : {
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
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.75,
      color: "rgba(0, 0, 0, 0.6)",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57,
      color: "rgba(0, 0, 0, 0.6)",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.43,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.66,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 2.66,
      textTransform: "uppercase",
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: mode === 'light' ? "#f1f1f1" : "#2c2c2c",
          },
          "&::-webkit-scrollbar-thumb": {
            background: mode === 'light' ? "#c1c1c1" : "#555",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: mode === 'light' ? "#a8a8a8" : "#777",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 16px",
          boxShadow: "none",
          fontSize: "0.875rem",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "none",
            transform: "translateY(-1px)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
            backgroundColor: mode === 'light' ? colorTokens.gray[25] : colorTokens.gray[400],
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
        elevation2: {
          boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
        },
        elevation3: {
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === 'light' ? colorTokens.primary : colorTokens.secondary,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === 'light' ? colorTokens.primary : colorTokens.secondary,
            },
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "64px !important",
          paddingLeft: "16px !important",
          paddingRight: "16px !important",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          backgroundColor: mode === 'light' ? colorTokens.white : colorTokens.gray[400],
          color: mode === 'light' ? colorTokens.gray[500] : colorTokens.gray[50],
          borderBottom: `1px solid ${mode === 'light' ? colorTokens.gray[100] : colorTokens.gray[350]}`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover": {
            backgroundColor: mode === 'light' ? colorTokens.gray[25] : colorTokens.gray[350],
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Default theme (light mode)
const theme = createAppTheme('light');

export default theme;
