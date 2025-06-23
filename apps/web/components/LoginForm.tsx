'use client';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { apiLogin } from '../actions/apiLogin';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useThemeMode } from '../provider/ThemeContext';
import { log } from '@/utils/logger';

interface LoginFormProps {
  error?: string;
}

export default function LoginForm({ error }: LoginFormProps) {
  const router = useRouter();
  const { setUser } = useCurrentUser();
  const theme = useTheme();
  const { resolvedTheme } = useThemeMode();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(error);

  const isDark = resolvedTheme === 'light';

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setLoginError(undefined);

    try {
      const result = await apiLogin(formData);

      if (result.success) {
        // Update user context
        setUser(result.user);

        // Show success message
        toast.success('Đăng nhập thành công!', { autoClose: 2000 });

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setLoginError(result.error);
        toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.', {
          autoClose: 4000,
        });
      }
    } catch (err: unknown) {
      log('Login error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Đăng nhập thất bại';
      toast.error(errorMessage, { autoClose: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3, md: 4 },
        position: 'relative',
        // Subtle gradient overlay
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.01) 0%, transparent 50%)'
            : 'radial-gradient(circle at 30% 20%, rgba(0, 0, 0, 0.02) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0, 0, 0, 0.01) 0%, transparent 50%)',
          zIndex: 1,
        },
      }}
    >
      <Card
        elevation={isDark ? 8 : 4}
        sx={{
          maxWidth: 1000,
          width: '100%',
          borderRadius: { xs: 2, md: 3 },
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDark
            ? '0 20px 40px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4)'
            : '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)',
          zIndex: 2,
        }}
      >
        <Grid container sx={{ minHeight: { xs: 'auto', md: 600 } }}>
          {/* Left Panel - Branding */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: { xs: 4, sm: 5, md: 6 },
              minHeight: { xs: 280, md: 'auto' },
              position: 'relative',
              // Subtle texture overlay
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: isDark
                  ? 'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.04) 0%, transparent 60%)'
                  : 'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 60%)',
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ textAlign: 'center', maxWidth: 400, zIndex: 1 }}>
              {/* Logo and Brand */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: { xs: 3, md: 4 },
                  animation: 'fadeInUp 0.8s ease-out',
                  '@keyframes fadeInUp': {
                    '0%': { opacity: 0, transform: 'translateY(30px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 56, md: 64 },
                    height: { xs: 56, md: 64 },
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.contrastText,
                    color: theme.palette.primary.main,
                    mr: 2.5,
                    boxShadow: isDark
                      ? '0 4px 16px rgba(255, 255, 255, 0.1)'
                      : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <DashboardIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
                </Box>
                <Typography
                  variant='h2'
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  Sprint Flow
                </Typography>
              </Box>

              <Typography
                variant='h4'
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: '1.3rem', md: '1.6rem' },
                  color: theme.palette.primary.contrastText,
                  opacity: 0.95,
                  animation: 'fadeInUp 0.8s ease-out 0.2s both',
                }}
              >
                Chào mừng trở lại!
              </Typography>

              <Typography
                variant='body1'
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6,
                  mb: 4,
                  color: theme.palette.primary.contrastText,
                  opacity: 0.85,
                  animation: 'fadeInUp 0.8s ease-out 0.4s both',
                }}
              >
                Quản lý dự án hiệu quả và theo dõi tiến độ sprint một cách
                chuyên nghiệp. Đăng nhập để tiếp tục hành trình phát triển.
              </Typography>

              {/* Feature tags */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  justifyContent: 'center',
                  animation: 'fadeInUp 0.8s ease-out 0.6s both',
                }}
              >
                {['Quản lý Sprint', 'Theo dõi Task', 'Báo cáo tiến độ'].map(
                  feature => (
                    <Box
                      key={feature}
                      sx={{
                        px: 2,
                        py: 0.8,
                        borderRadius: 1.5,
                        backgroundColor: theme.palette.primary.contrastText,
                        color: theme.palette.primary.main,
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        opacity: 0.9,
                        boxShadow: isDark
                          ? '0 2px 8px rgba(255, 255, 255, 0.1)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {feature}
                    </Box>
                  )
                )}
              </Box>
            </Box>
          </Grid>

          {/* Right Panel - Login Form */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 3, md: 4, lg: 6 },
              py: { xs: 4, md: 5 },
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Box
                sx={{
                  mb: { xs: 4, md: 5 },
                  textAlign: 'center',
                  animation: 'fadeInUp 0.8s ease-out 0.8s both',
                }}
              >
                <Typography
                  variant='h3'
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 1,
                    fontSize: { xs: '1.5rem', md: '1.8rem' },
                  }}
                >
                  Đăng nhập tài khoản
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '1rem',
                  }}
                >
                  Vui lòng nhập thông tin để tiếp tục
                </Typography>
              </Box>

              <Box
                component='form'
                action={handleSubmit}
                sx={{
                  width: '100%',
                  animation: 'fadeInUp 0.8s ease-out 1s both',
                }}
              >
                <Box sx={{ mb: { xs: 3, md: 3.5 } }}>
                  <Typography
                    variant='body2'
                    sx={{
                      color: theme.palette.text.primary,
                      mb: 1.5,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    Tên đăng nhập
                  </Typography>
                  <TextField
                    fullWidth
                    name='username'
                    placeholder='Nhập tên đăng nhập của bạn'
                    autoComplete='username'
                    autoFocus
                    variant='outlined'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <PersonOutlineOutlinedIcon
                            sx={{ color: theme.palette.text.secondary }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.action.hover,
                        border: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.action.selected,
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
                        },
                        '&.Mui-focused': {
                          backgroundColor: theme.palette.background.paper,
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}30`,
                        },
                      },
                      '& .MuiInputBase-input': {
                        py: 1.5,
                        fontSize: '1rem',
                        color: theme.palette.text.primary,
                        '&::placeholder': {
                          color: theme.palette.text.secondary,
                          opacity: 0.7,
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                  <Typography
                    variant='body2'
                    sx={{
                      color: theme.palette.text.primary,
                      mb: 1.5,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    Mật khẩu
                  </Typography>
                  <TextField
                    fullWidth
                    name='password'
                    placeholder='Nhập mật khẩu của bạn'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    variant='outlined'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LockOutlinedIcon
                            sx={{ color: theme.palette.text.secondary }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge='end'
                            sx={{
                              color: theme.palette.text.secondary,
                              '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                color: theme.palette.primary.main,
                              },
                            }}
                          >
                            {showPassword ? (
                              <VisibilityOffOutlinedIcon />
                            ) : (
                              <VisibilityOutlinedIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.action.hover,
                        border: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.action.selected,
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
                        },
                        '&.Mui-focused': {
                          backgroundColor: theme.palette.background.paper,
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}30`,
                        },
                      },
                      '& .MuiInputBase-input': {
                        py: 1.5,
                        fontSize: '1rem',
                        color: theme.palette.text.primary,
                        '&::placeholder': {
                          color: theme.palette.text.secondary,
                          opacity: 0.7,
                        },
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: { xs: 4, md: 5 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      name='remember'
                      value='1'
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      sx={{
                        color: theme.palette.primary.main,
                        p: 0,
                        mr: 1.5,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    />
                    <Typography
                      variant='body2'
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      Ghi nhớ thông tin đăng nhập
                    </Typography>
                  </Box>
                  <Link
                    href='/forgot-password'
                    variant='body2'
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        textDecoration: 'underline',
                        opacity: 0.8,
                      },
                    }}
                  >
                    Quên mật khẩu?
                  </Link>
                </Box>

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  disabled={isLoading}
                  startIcon={isLoading ? null : <LoginIcon />}
                  sx={{
                    py: 2,
                    mb: 3,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 28px ${theme.palette.primary.main}50`,
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    },
                    '&:disabled': {
                      backgroundColor: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled,
                      transform: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {isLoading ? (
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: `2px solid ${theme.palette.primary.contrastText}40`,
                          borderTop: `2px solid ${theme.palette.primary.contrastText}`,
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                      Đang đăng nhập...
                    </Box>
                  ) : (
                    'Đăng nhập hệ thống'
                  )}
                </Button>

                {(error || loginError) && (
                  <Alert
                    severity='error'
                    sx={{
                      mt: 2,
                      backgroundColor: theme.palette.error.main + '15',
                      color: theme.palette.error.main,
                      border: `1px solid ${theme.palette.error.main}30`,
                      '& .MuiAlert-icon': {
                        color: theme.palette.error.main,
                      },
                    }}
                  >
                    {error || loginError}
                  </Alert>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
