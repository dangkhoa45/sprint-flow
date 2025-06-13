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
        backgroundColor: (theme) => theme.palette.primary.main,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Card
        sx={{
          maxWidth: 900,
          width: "90%",
          height: { xs: "auto", md: 520 },
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: (theme) => theme.shadows[8],
          border: (theme) => `1px solid ${theme.palette.divider}`,
          zIndex: 1,
          display: "flex",
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Grid
          container
          sx={{ height: "100%" }}
        >
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              backgroundColor: (theme) => theme.palette.primary.dark,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 4, md: 6 },
              color: "white",
              overflow: "hidden",
              minHeight: { xs: 300, md: "auto" },
            }}
          >
            <Box sx={{ textAlign: "center", maxWidth: 350 }}>
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
              backgroundColor: (theme) => theme.palette.background.paper,
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
