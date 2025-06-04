"use client";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import useLogin from "../app/actions/useLogin";
import { LoginPayload } from "../types/login";

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: 500,
  maxWidth: "90%",
  margin: "auto",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  padding: "32px 48px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  [theme.breakpoints.down("sm")]: {
    padding: "24px 32px",
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#333",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#555",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },
}));

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [{ loading, error }, login] = useLogin();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jsonData = Object.fromEntries(formData.entries());

    try {
      const result = await login({ data: jsonData as LoginPayload });
      console.log("Login success:", result);

      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <StyledPaper>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: 700, marginBottom: "8px" }}
      >
        MotorRental
      </Typography>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 600, marginBottom: "8px" }}
      >
        Đăng nhập
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography align="left">
          Tên đăng nhập <span style={{ color: "#FF0000" }}>*</span>
        </Typography>
        <OutlinedInput
          required
          name="username"
          fullWidth
          size="small"
        />
        <Typography
          align="left"
          sx={{ mt: 1 }}
        >
          Mật khẩu <span style={{ color: "#FF0000" }}>*</span>
        </Typography>
        <OutlinedInput
          required
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          size="small"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          }
        />
        {error && (
          <Alert
            severity="error"
            sx={{ mt: 2 }}
          >
            Tên đăng nhập hoặc mật khẩu chưa đúng!
          </Alert>
        )}
        <SubmitButton
          size="large"
          type={"submit"}
          variant="contained"
          disabled={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          Đăng nhập
          {loading && (
            <CircularProgress
              size={24}
              sx={{ color: "#fff", marginLeft: "12px" }}
            />
          )}
        </SubmitButton>
      </Box>
    </StyledPaper>
  );
}
