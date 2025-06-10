import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number | string;
  actions?: ReactNode;
}

export default function ChartContainer({
  title,
  subtitle,
  children,
  height = 400,
  actions
}: ChartContainerProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        height: typeof height === "number" ? `${height}px` : height,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#1e293b" }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{ color: "#64748b", mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && (
          <Box>
            {actions}
          </Box>
        )}
      </Box>
      
      <Box sx={{ flex: 1, position: "relative" }}>
        {children}
      </Box>
    </Paper>
  );
}
