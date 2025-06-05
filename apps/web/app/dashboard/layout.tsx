import { ReactNode } from "react";
import Box from '@mui/material/Box';
import DashboardHeader from "./components/DashboardHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 20% 50%, rgba(30, 144, 255, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 20, 147, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(50, 205, 50, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(1px)",
        },
      }}
    >
      <DashboardHeader />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
