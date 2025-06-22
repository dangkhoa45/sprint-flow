import { createTheme, PaletteMode } from '@mui/material/styles';
import { colorTokens } from '../tokens/colors';
import { typographyTokens } from '../tokens/typography';

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
      fontFamily: typographyTokens.fontFamily.primary,
      fontSize: 14,
      h1: typographyTokens.headings.h1,
      h2: typographyTokens.headings.h2,
      h3: typographyTokens.headings.h3,
      h4: typographyTokens.headings.h4,
      h5: typographyTokens.headings.h5,
      h6: typographyTokens.headings.h6,
      body1: typographyTokens.body.medium,
      body2: typographyTokens.body.small,
      button: typographyTokens.components.button.medium,
      caption: typographyTokens.components.caption,
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
  }); 