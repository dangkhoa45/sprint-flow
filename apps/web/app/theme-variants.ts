import { PaletteMode } from "@mui/material/styles";

// Custom color variants cho từng theme mode
export const themeVariants = {
  light: {
    primary: "#0070f4",
    secondary: "#ef06bc", 
    background: {
      default: "#f7f8f9",
      paper: "#ffffff",
      gradient: "linear-gradient(135deg, #0070f4 0%, #ef06bc 100%)",
    },
    custom: {
      cardHover: "#f0f1f3",
      glassmorphism: "rgba(255, 255, 255, 0.8)",
      shadow: "rgba(0, 0, 0, 0.1)",
      border: "#e1e3e6",
    }
  },
  dark: {
    primary: "#66a9f8",
    secondary: "#f56ad7",
    background: {
      default: "#15171a",
      paper: "#292e35", 
      gradient: "linear-gradient(135deg, #292e35 0%, #3e464f 100%)",
    },
    custom: {
      cardHover: "#343a42",
      glassmorphism: "rgba(255, 255, 255, 0.05)",
      shadow: "rgba(0, 0, 0, 0.3)",
      border: "#525d6a",
    }
  }
};

export const getThemeVariant = (mode: PaletteMode) => {
  return themeVariants[mode];
};

// Predefined theme presets
export const themePresets = {
  default: {
    light: { primary: "#0070f4", secondary: "#ef06bc" },
    dark: { primary: "#66a9f8", secondary: "#f56ad7" }
  },
  blue: {
    light: { primary: "#0070f4", secondary: "#005ac3" },
    dark: { primary: "#66a9f8", secondary: "#338df6" }
  },
  green: {
    light: { primary: "#00b63e", secondary: "#ff8800" },
    dark: { primary: "#66d38b", secondary: "#ffb866" }
  },
  purple: {
    light: { primary: "#8f0471", secondary: "#0070f4" },
    dark: { primary: "#f56ad7", secondary: "#66a9f8" }
  }
};
