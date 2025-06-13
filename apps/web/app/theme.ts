"use client";
import { Roboto } from "next/font/google";
import { createTheme, PaletteMode } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Color system based on design tokens
export const colorTokens = {
  // Primary colors
  primary: "#0070f4",
  secondary: "#ef06bc", 
  success: "#00b63e",
  info: "#0070f4",
  warning: "#ff8800",
  danger: "#ed232f",

  // Blue scale
  blue: {
    50: "#e6f1fe",
    100: "#cce2fd",
    200: "#99c6fb",
    300: "#66a9f8",
    400: "#338df6",
    500: "#0070f4", // primary
    600: "#005ac3",
    700: "#004392",
    800: "#002d62",
    900: "#001631",
  },

  // Gray scale
  gray: {
    25: "#f7f8f9",
    50: "#f0f1f3",
    75: "#e8eaed",
    100: "#e1e3e6",
    150: "#d1d5da",
    200: "#c2c7ce",
    250: "#b3bac2",
    300: "#a4acb5",
    350: "#959ea9",
    400: "#85909d",
    500: "#677484", // secondary/default
    600: "#525d6a",
    700: "#3e464f",
    750: "#343a42",
    800: "#292e35",
    850: "#1f2328",
    900: "#15171a",
  },

  // Green scale
  green: {
    50: "#e6f8ec",
    100: "#ccf0d8",
    300: "#66d38b",
    400: "#33c565",
    500: "#00b63e", // success
    600: "#009232",
    700: "#006d25",
    800: "#004919",
    900: "#00240c",
  },

  // Orange scale
  orange: {
    50: "#fff3e6",
    100: "#ffe7cc",
    300: "#ffb866",
    400: "#ffa033",
    500: "#ff8800", // warning
    600: "#cc6d00",
    700: "#995200",
    800: "#663600",
    900: "#331b00",
  },

  // Red scale
  red: {
    50: "#fde9ea",
    100: "#fbd3d5",
    300: "#f47b82",
    400: "#f14f59",
    500: "#ed232f", // danger
    600: "#be1c26",
    700: "#8e151c",
    800: "#5f0e13",
    900: "#2f0709",
  },

  // Pink scale
  pink: {
    50: "#fde6f8",
    100: "#fccdf2",
    300: "#f56ad7",
    400: "#f238c9",
    500: "#ef06bc", // secondary
    600: "#bf0596",
    700: "#8f0471",
    800: "#60024b",
    900: "#300126",
  },

  // Base colors
  white: "#ffffff",
  black: "#000000",
};

// Tạo theme động dựa trên mode
export const createAppTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: colorTokens.primary,
      light: colorTokens.blue[300],
      dark: colorTokens.blue[700],
      contrastText: colorTokens.white,
    },
    secondary: {
      main: colorTokens.secondary,
      light: colorTokens.pink[300],
      dark: colorTokens.pink[700],
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
      light: colorTokens.orange[300],
      dark: colorTokens.orange[700],
      contrastText: colorTokens.white,
    },
    info: {
      main: colorTokens.info,
      light: colorTokens.blue[300],
      dark: colorTokens.blue[700],
      contrastText: colorTokens.white,
    },
    success: {
      main: colorTokens.success,
      light: colorTokens.green[300],
      dark: colorTokens.green[700],
      contrastText: colorTokens.white,
    },
    background: mode === 'light' ? {
      default: colorTokens.gray[25],
      paper: colorTokens.white,
    } : {
      default: colorTokens.gray[900],
      paper: colorTokens.gray[800],
    },
    text: mode === 'light' ? {
      primary: colorTokens.gray[900],
      secondary: colorTokens.gray[600],
      disabled: colorTokens.gray[400],
    } : {
      primary: colorTokens.gray[50],
      secondary: colorTokens.gray[300],
      disabled: colorTokens.gray[500],
    },
    divider: mode === 'light' ? colorTokens.gray[200] : colorTokens.gray[700],
    action: mode === 'light' ? {
      active: colorTokens.gray[600],
      hover: colorTokens.gray[50],
      selected: colorTokens.gray[100],
      disabled: colorTokens.gray[400],
      disabledBackground: colorTokens.gray[100],
    } : {
      active: colorTokens.gray[300],
      hover: colorTokens.gray[800],
      selected: colorTokens.gray[750],
      disabled: colorTokens.gray[500],
      disabledBackground: colorTokens.gray[800],
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    fontSize: 14,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.4,
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
          "&:hover": {
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
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
              borderColor: mode === 'light' ? colorTokens.primary : colorTokens.blue[300],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === 'light' ? colorTokens.primary : colorTokens.blue[300],
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
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          backgroundColor: mode === 'light' ? colorTokens.white : colorTokens.gray[800],
          color: mode === 'light' ? colorTokens.gray[900] : colorTokens.gray[50],
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover": {
            backgroundColor: mode === 'light' ? colorTokens.gray[50] : colorTokens.gray[750],
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
