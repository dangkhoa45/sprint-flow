"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeMode } from "../provider/ThemeContext";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="toggle theme"
        sx={{
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
}
