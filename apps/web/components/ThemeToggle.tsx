'use client';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useState } from 'react';
import { useThemeMode } from '../provider/ThemeContext';

export default function ThemeToggle() {
  const { mode, resolvedTheme, setTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (theme: 'light' | 'dark' | 'system') => {
    setTheme(theme);
    handleClose();
  };

  const getIcon = () => {
    if (mode === 'system') {
      return <SettingsBrightnessIcon />;
    }
    return resolvedTheme === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />;
  };

  const getTooltip = () => {
    if (mode === 'system') {
      return `System theme (${resolvedTheme})`;
    }
    return `${resolvedTheme === 'dark' ? 'Dark' : 'Light'} theme`;
  };

  return (
    <>
      <Tooltip title={getTooltip()}>
        <IconButton
          onClick={handleClick}
          color='inherit'
          aria-label='theme toggle'
          sx={{
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          {getIcon()}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => handleThemeSelect('light')}
          selected={mode === 'light'}
        >
          <Brightness7Icon sx={{ mr: 1 }} />
          <Typography>Light</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handleThemeSelect('dark')}
          selected={mode === 'dark'}
        >
          <Brightness4Icon sx={{ mr: 1 }} />
          <Typography>Dark</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handleThemeSelect('system')}
          selected={mode === 'system'}
        >
          <SettingsBrightnessIcon sx={{ mr: 1 }} />
          <Typography>System</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
