"use client";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import DashboardGrid from "./components/DashboardGrid";

export default function DashboardPage() {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 1,
            background: "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
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
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: 400,
            letterSpacing: "0.5px",
          }}
        >
          Chào mừng bạn đến với bảng điều khiển SprintFlow
        </Typography>
      </Container>
      
      <DashboardGrid />
    </Box>
  );
}
