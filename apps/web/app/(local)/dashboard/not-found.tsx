'use client';

import ErrorPage from "@/components/ErrorPage";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
export default function DashboardNotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoDashboard = () => {
    router.push('/dashboard');
  };

  const customActions = (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <Button
        variant="contained"
        startIcon={<DashboardIcon />}
        onClick={handleGoDashboard}
        sx={{ minWidth: 120 }}
      >
        Bảng điều khiển
      </Button>
      <Button
        variant="outlined"
        startIcon={<HomeIcon />}
        onClick={handleGoHome}
        sx={{ minWidth: 120 }}
      >
        Về trang chủ
      </Button>
    </Stack>
  );

  return (
    <Box
      sx={{
        py: 4,
        position: "relative",
        minHeight: "calc(100vh - 180px)",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <ErrorPage
        type="404"
        title="Trang không tồn tại"
        message="Trang bạn đang tìm kiếm không tồn tại trong hệ thống dashboard."
        customActions={customActions}
      />
    </Box>
  );
}
