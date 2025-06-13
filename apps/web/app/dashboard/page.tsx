"use client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import DashboardGrid from "./components/DashboardGrid";

export default function DashboardPage() {
  return (
    <Box
      sx={{
        py: 4,
        position: "relative",
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 2,
            color: (theme) => theme.palette.primary.main,
            letterSpacing: "1px",
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            textAlign: "center",
            marginBottom: 5,
            color: (theme) => theme.palette.text.secondary,
            fontWeight: 400,
            letterSpacing: "0.5px",
          }}
        >
          Quản lý dự án thông minh • Theo dõi tiến độ hiệu quả • Thành công vượt trội
        </Typography>
      </Container>

      <DashboardGrid />
    </Box>
  );
}
