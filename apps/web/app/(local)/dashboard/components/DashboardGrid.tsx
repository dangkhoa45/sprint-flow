'use client';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import MenuCard from './MenuCard';

const menuItems = [
  {
    title: 'Quản lý dự án',
    description: 'Tạo và quản lý dự án',
    icon: <AccountTreeIcon sx={{ fontSize: 24 }} />,
    path: '/dashboard/projects',
    color: '#6366f1',
  },
  {
    title: 'Quản lý công việc',
    description: 'Tạo, phân công và theo dõi tiến độ công việc',
    icon: <AssignmentIcon sx={{ fontSize: 24 }} />,
    path: '/dashboard/tasks',
    color: '#10b981',
  },
  {
    title: 'Quản lý lịch làm việc',
    description: 'Lập lịch và theo dõi lịch làm việc của team',
    icon: <CalendarTodayIcon sx={{ fontSize: 24 }} />,
    path: '/dashboard/calendar',
    color: '#f59e0b',
  },
  {
    title: 'Quản lý tài liệu',
    description: 'Tạo, chỉnh sửa và quản lý tài liệu dự án',
    icon: <DescriptionIcon sx={{ fontSize: 24 }} />,
    path: '/dashboard/documents',
    color: '#8b5cf6',
  },
  {
    title: 'Theo dõi tiến độ',
    description: 'Theo dõi tiến độ dự án theo thời gian thực',
    icon: <TimelineIcon sx={{ fontSize: 24 }} />,
    path: '/dashboard/timeline',
    color: '#3b82f6',
  },
  {
    title: 'Phòng chat',
    description: 'Trao đổi thông tin và thảo luận với các thành viên',
    icon: <ChatIcon sx={{ fontSize: 24 }} />,
    path: '/dashboard/chat',
    color: '#06b6d4',
  },
  {
    title: 'Báo cáo & Thống kê',
    description: 'Xem báo cáo hiệu suất và thống kê dự án',
    icon: <BarChartIcon sx={{ fontSize: 24 }} />,
    path: '/dashboard/reports',
    color: '#f97316',
  },
  {
    title: 'Quản lý người dùng',
    description: 'Thêm, sửa, xóa và quản lý thông tin người dùng',
    icon: <ManageAccountsIcon sx={{ fontSize: 24 }} />,
    path: '/dashboard/users',
    color: '#84cc16',
  },
  {
    title: 'Quản lý thông báo',
    description: 'Cài đặt và quản lý thông báo hệ thống',
    icon: <NotificationsIcon sx={{ fontSize: 24 }} />,
    path: '/dashboard/notifications',
    color: '#ef4444',
  },
  {
    title: 'Cài đặt hệ thống',
    description: 'Cấu hình và tùy chỉnh hệ thống',
    icon: <SettingsIcon sx={{ fontSize: 24 }} />,
    path: '/dashboard/settings',
    color: '#64748b',
  },
];

const DashboardGrid = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant='h5'
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 0.5,
          }}
        >
          Quick Actions
        </Typography>
        <Typography
          variant='body2'
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          Access your most used features and tools
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 2.5,
        }}
      >
        {menuItems.map((item, index) => (
          <MenuCard key={index} {...item} />
        ))}
      </Box>
    </Box>
  );
};

export default DashboardGrid;
