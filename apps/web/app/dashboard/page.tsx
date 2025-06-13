"use client";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardGrid from "./components/DashboardGrid";
import { useThemeMode } from "../../provider/ThemeContext";

export default function DashboardPage() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box sx={{ 
      py: 4,
      position: 'relative',
      background: (theme) => theme.palette.mode === 'light' 
        ? `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`
        : `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
    }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 1,
            background: (theme) => theme.palette.mode === 'light'
              ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            letterSpacing: "1px",
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            textAlign: "center",
            marginBottom: 4,
            color: (theme) => theme.palette.text.secondary,
            fontWeight: 400,
            letterSpacing: "0.5px",
          }}
        >
          Chào mừng bạn đến với bảng điều khiển SprintFlow
        </Typography>
      </Container>
      
      <DashboardGrid />
      
      {/* Floating Theme Toggle */}
      <Fab
        onClick={toggleTheme}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: (theme) => theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.dark,
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
        aria-label="toggle theme"
      >
        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </Fab>
    </Box>
  );
}
