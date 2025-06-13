"use client";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
import { useState } from "react";
import { apiLogin } from "../actions/apiLogin";

type LoginFormProps = {
  error?: string;
};

export default function LoginForm({ error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #0070f4 0%, #ef06bc 50%, #66a9f8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "-20%",
          left: "-20%",
          width: "140%",
          height: "140%",
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
          `,
          animation: "float 6s ease-in-out infinite",
        },
        "@keyframes float": {
          "0%, 100%": { transform: "translate(0px, 0px) rotate(0deg)" },
          "33%": { transform: "translate(30px, -30px) rotate(120deg)" },
          "66%": { transform: "translate(-20px, 20px) rotate(240deg)" },
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 900,
          width: "90%",
          height: { xs: "auto", md: 520 },
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 1,
          display: "flex",
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Grid
          container
          sx={{ height: "100%" }}
        >
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              background:
                "linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #1e3a8a 100%)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 4, md: 6 },
              color: "white",
              overflow: "hidden",
              minHeight: { xs: 300, md: "auto" },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)
                `,
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                animation: "pulse 4s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
                  "50%": { transform: "scale(1.1)", opacity: 0.8 },
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 30,
                left: 20,
                width: 60,
                height: 60,
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.1)",
                transform: "rotate(45deg)",
                animation: "rotate 8s linear infinite",
                "@keyframes rotate": {
                  "0%": { transform: "rotate(45deg)" },
                  "100%": { transform: "rotate(405deg)" },
                },
              }}
            />

            <Box sx={{ zIndex: 1, textAlign: "center", maxWidth: 350 }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Sprint Flow
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  mb: 4,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisl
                risus.
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
              px: { xs: 3, md: 4, lg: 8, xl: 12 },
              background: "#ffffff",
            }}
          >
            <Box
              component="form"
              action={apiLogin}
              sx={{ width: "100%" }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Username
                </Typography>
                <TextField
                  fullWidth
                  name="username"
                  placeholder="username"
                  autoComplete="username"
                  autoFocus
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineOutlinedIcon sx={{ color: "#9ca3af" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f1f5f9",
                      border: "none",
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "2px solid #1e40af",
                      },
                    },
                    "& .MuiInputBase-input": {
                      py: 1.5,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Password
                </Typography>
                <TextField
                  fullWidth
                  name="password"
                  placeholder="••••••••••••"
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
                          sx={{ color: "#9ca3af" }}
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
                      borderRadius: "12px",
                      backgroundColor: "#f1f5f9",
                      border: "none",
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "2px solid #1e40af",
                      },
                    },
                    "& .MuiInputBase-input": {
                      py: 1.5,
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    name="remember"
                    value="1"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: "#3b82f6",
                      p: 0,
                      mr: 1,
                      "&.Mui-checked": {
                        color: "#3b82f6",
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    Remember me
                  </Typography>
                </Box>
                <Link
                  href="/forgot-password"
                  variant="body2"
                  sx={{
                    color: "#3b82f6",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  mb: 3,
                  borderRadius: "12px",
                  backgroundColor: "#1e40af",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow:
                    "0 4px 6px -1px rgba(59, 130, 246, 0.5), 0 2px 4px -1px rgba(59, 130, 246, 0.06)",
                  "&:hover": {
                    backgroundColor: "#2563eb",
                    boxShadow:
                      "0 10px 15px -3px rgba(59, 130, 246, 0.5), 0 4px 6px -2px rgba(59, 130, 246, 0.05)",
                  },
                }}
              >
                Login
              </Button>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 3,
                    borderRadius: "12px",
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    "& .MuiAlert-icon": {
                      color: "#dc2626",
                    },
                  }}
                >
                  {error}
                </Alert>
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
