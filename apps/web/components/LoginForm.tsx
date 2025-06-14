"use client";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { apiLogin } from "../actions/apiLogin";
import { useCurrentUser } from "../hooks/useCurrentUser";

type LoginFormProps = {
  error?: string;
};

export default function LoginForm({ error }: LoginFormProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { setUser } = useCurrentUser();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(error);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setLoginError(undefined);
    
    try {
      const result = await apiLogin(formData);
      
      if (result.success) {
        // Update user context
        setUser(result.user);
        
        // Show success message
        enqueueSnackbar("Đăng nhập thành công!", {
          variant: "success",
          autoHideDuration: 2000,
        });
        
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setLoginError(result.error);
        enqueueSnackbar("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.", {
          variant: "error",
          autoHideDuration: 4000,
        });
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      setLoginError("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
      enqueueSnackbar("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.", {
        variant: "error",
        autoHideDuration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
          url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 4 },
        position: "relative",
      }}
    >
      <Card
        sx={{
          maxWidth: 1000,
          width: "100%",
          borderRadius: { xs: "20px", md: "24px" },
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
          zIndex: 2,
        }}
      >
        <Grid container sx={{ height: "100%" }}>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              background: "rgba(102, 126, 234, 0.9)",
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 3, sm: 4, md: 5, lg: 6 },
              color: "white",
              minHeight: { xs: 250, md: "auto" },
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
                `,
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ textAlign: "center", maxWidth: 400, zIndex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: { xs: 2, md: 3 },
                }}
              >
                <DashboardIcon sx={{ fontSize: { xs: 40, md: 48 }, mr: 2 }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                  }}
                >
                  Sprint Flow
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 1.5, md: 2 },
                  opacity: 0.95,
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                }}
              >
                Chào mừng trở lại!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.8,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.6,
                  mb: { xs: 3, md: 4 },
                }}
              >
                Quản lý dự án hiệu quả với Sprint Flow. Đăng nhập để tiếp tục
                hành trình của bạn.
              </Typography>
            </Box>
          </Grid>

          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: { xs: 3, md: 4, lg: 6 },
              py: { xs: 4, md: 5 },
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 400 }}>
              <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    mb: 1,
                  }}
                >
                  Đăng nhập tài khoản
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#6b7280",
                    fontSize: "1rem",
                  }}
                >
                  Vui lòng nhập thông tin đăng nhập để tiếp tục
                </Typography>
              </Box>

              <Box
                component="form"
                action={handleSubmit}
                sx={{ width: "100%" }}
              >
                <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#374151",
                      mb: { xs: 1, md: 1.5 },
                      fontWeight: 600,
                    }}
                  >
                    Tên đăng nhập
                  </Typography>
                  <TextField
                    fullWidth
                    name="username"
                    placeholder="Nhập tên đăng nhập của bạn"
                    autoComplete="username"
                    autoFocus
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineOutlinedIcon
                            sx={{ color: "#9ca3af" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        backgroundColor: "rgba(248, 250, 252, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        transition: "all 0.3s ease",
                        "& fieldset": {
                          border: "none",
                        },
                        "&:hover": {
                          backgroundColor: "rgba(241, 245, 249, 0.9)",
                          borderColor: "rgba(255, 255, 255, 0.4)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderColor: "rgba(102, 126, 234, 0.5)",
                          boxShadow:
                            "0 0 0 3px rgba(102, 126, 234, 0.15), 0 4px 12px rgba(102, 126, 234, 0.1)",
                        },
                      },
                      "& .MuiInputBase-input": {
                        py: { xs: 1.2, md: 1.5 },
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#374151",
                      mb: { xs: 1, md: 1.5 },
                      fontWeight: 600,
                    }}
                  >
                    Mật khẩu
                  </Typography>
                  <TextField
                    fullWidth
                    name="password"
                    placeholder="Nhập mật khẩu của bạn"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{
                              color: "#9ca3af",
                              "&:hover": {
                                backgroundColor: "rgba(102, 126, 234, 0.1)",
                                color: "#667eea",
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
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        backgroundColor: "rgba(248, 250, 252, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        transition: "all 0.3s ease",
                        "& fieldset": {
                          border: "none",
                        },
                        "&:hover": {
                          backgroundColor: "rgba(241, 245, 249, 0.9)",
                          borderColor: "rgba(255, 255, 255, 0.4)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderColor: "rgba(102, 126, 234, 0.5)",
                          boxShadow:
                            "0 0 0 3px rgba(102, 126, 234, 0.15), 0 4px 12px rgba(102, 126, 234, 0.1)",
                        },
                      },
                      "& .MuiInputBase-input": {
                        py: { xs: 1.2, md: 1.5 },
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: { xs: 3, md: 4 },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      name="remember"
                      value="1"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: "#667eea",
                        p: 0,
                        mr: 1.5,
                        "&.Mui-checked": {
                          color: "#667eea",
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#374151",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      Ghi nhớ thông tin đăng nhập
                    </Typography>
                  </Box>
                  <Link
                    href="/forgot-password"
                    variant="body2"
                    sx={{
                      color: "#667eea",
                      textDecoration: "none",
                      fontWeight: 600,
                      "&:hover": {
                        textDecoration: "underline",
                        color: "#5a67d8",
                      },
                    }}
                  >
                    Quên mật khẩu?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? null : <LoginIcon />}
                  sx={{
                    py: { xs: 1.8, md: 2 },
                    mb: { xs: 2, md: 3 },
                    borderRadius: "16px",
                    background: "rgba(102, 126, 234, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    fontWeight: 600,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    textTransform: "none",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(90, 103, 216, 0.9)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                    },
                    "&:active": {
                      transform: "translateY(0px)",
                    },
                    "&:disabled": {
                      background: "rgba(209, 213, 219, 0.6)",
                      color: "#9ca3af",
                      transform: "none",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTop: "2px solid white",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                      Đang đăng nhập...
                    </Box>
                  ) : (
                    "Đăng nhập hệ thống"
                  )}
                </Button>

                {(error || loginError) && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      borderRadius: "12px",
                      backgroundColor: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      "& .MuiAlert-icon": {
                        color: "#dc2626",
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
