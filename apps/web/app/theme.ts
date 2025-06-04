"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#c4c4c4",
    },
    background: {
      default: "#fefefe",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    subtitle1: {
      fontSize: "10px",
      color: "grey",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "50px !important",
        },
      },
    },
  },
});

export default theme;
