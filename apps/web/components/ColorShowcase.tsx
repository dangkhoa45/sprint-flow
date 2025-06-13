"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useThemeMode } from "../provider/ThemeContext";

export default function ColorShowcase() {
  const theme = useTheme();
  const { mode } = useThemeMode();

  const colorSamples = [
    { name: "Primary", color: theme.palette.primary.main },
    { name: "Secondary", color: theme.palette.secondary.main },
    { name: "Success", color: theme.palette.success.main },
    { name: "Warning", color: theme.palette.warning.main },
    { name: "Error", color: theme.palette.error.main },
    { name: "Info", color: theme.palette.info.main },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        SprintFlow Color System - {mode.toUpperCase()} Mode
      </Typography>

      <Grid container spacing={3}>
        {/* Color Palette */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Color Palette
              </Typography>
              <Grid container spacing={2}>
                {colorSamples.map((sample) => (
                  <Grid size={{ xs: 6 }} key={sample.name}>
                    <Box
                      sx={{
                        width: "100%",
                        height: 60,
                        backgroundColor: sample.color,
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    >
                      {sample.name}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {sample.color}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Components */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Component Examples
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Buttons
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button variant="contained" color="primary" size="small">
                    Primary
                  </Button>
                  <Button variant="contained" color="secondary" size="small">
                    Secondary
                  </Button>
                  <Button variant="outlined" color="primary" size="small">
                    Outlined
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Chips
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip label="Success" color="success" size="small" />
                  <Chip label="Warning" color="warning" size="small" />
                  <Chip label="Error" color="error" size="small" />
                  <Chip label="Info" color="info" size="small" />
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Alerts
                </Typography>
                <Alert severity="info" sx={{ mb: 1 }}>
                  Theme information: {mode} mode active
                </Alert>
                <Alert severity="success">Colors updated successfully!</Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Typography */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Typography Scale
            </Typography>
            <Typography variant="h1" gutterBottom>
              Heading 1 - SprintFlow
            </Typography>
            <Typography variant="h3" gutterBottom>
              Heading 3 - Project Management
            </Typography>
            <Typography variant="h5" gutterBottom>
              Heading 5 - Task Management
            </Typography>
            <Typography variant="body1" gutterBottom>
              Body text - Đây là nội dung chính của ứng dụng SprintFlow với hệ
              thống quản lý dự án hiện đại.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Body 2 - Text phụ với màu secondary để tạo hierarchy trong nội
              dung.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
