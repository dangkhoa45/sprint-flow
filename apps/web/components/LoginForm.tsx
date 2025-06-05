"use client";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { apiLogin } from "../actions/apiLogin";

type LoginFormProps = {
  error?: string;
};

export default function LoginForm({ error }: LoginFormProps) {
  const [show, setShow] = useState(false);
  return (
    <Container maxWidth="sm">
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"100vh"}
        component={"form"}
        action={apiLogin}
      >
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          flexDirection={"column"}
          gap={4}
          sx={{ maxWidth: 580, width: 1 }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Typography
              variant="h1"
              fontWeight={"bold"}
            >
              Sign In
            </Typography>
          </Box>

          <FormControlLabel
            label={"Username"}
            labelPlacement="top"
            sx={{
              alignItems: "flex-start",
              padding: "16px",
              boxShadow: "0px 10px 30px 0px rgba(66, 71, 97, 0.10)",
              borderRadius: "12px",
              mx: "0",
            }}
            control={
              <InputBase
                name="username"
                placeholder={"Username"}
                autoComplete="username"
                autoFocus
                fullWidth
                sx={{
                  [`& .MuiInputBase-input`]: {
                    fontWeight: "bold",
                  },
                }}
              />
            }
          />

          <FormControlLabel
            label={"Password"}
            labelPlacement="top"
            sx={{
              alignItems: "flex-start",
              padding: "16px",
              boxShadow: "0px 10px 30px 0px rgba(66, 71, 97, 0.10)",
              borderRadius: "12px",
              mx: "0",
            }}
            control={
              <InputBase
                name="password"
                placeholder={"Password"}
                autoComplete="current-password"
                autoFocus
                fullWidth
                type={show ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShow(!show)}>
                      {!show ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  [`& .MuiInputBase-input`]: {
                    fontWeight: "bold",
                  },
                }}
              />
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                value="1"
                name="remember"
                color="primary"
              />
            }
            label={"Remember me"}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              padding: 2,
              borderRadius: "41px",
              boxShadow: " 0px 8px 30px 0px rgba(65, 89, 214, 0.30);",
              background: "#7288FA",
              textTransform: "none",
            }}
          >
            <Typography fontWeight={"bold"}>{"Sign In"}</Typography>
          </Button>
          {error && (
            <Alert
              severity="error"
              sx={{ padding: "20px 10px", borderRadius: "10px" }}
            >
              {"Error"}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}
