"use client";

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Brightness7Icon from '@mui/icons-material/Brightness7';
export default function ThemeToggle() {
  // Always light mode - disable toggle functionality
  const toggleTheme = () => {
    console.log("Theme switching is disabled. Always using light mode.");
  };

  return (
    <Tooltip title="Theme switching disabled - always light mode">
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="theme toggle disabled"
        disabled
        sx={{
          borderRadius: 2,
          transition: "all 0.3s ease",
          opacity: 0.5,
        }}
      >
        <Brightness7Icon />
      </IconButton>
    </Tooltip>
  );
}
