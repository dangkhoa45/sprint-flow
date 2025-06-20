"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";

interface StatusCardProps {
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

const StatusCard = ({ type, title, description, action, icon }: StatusCardProps) => {
  const theme = useTheme();

  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          color: "#10b981",
          backgroundColor: "#ecfdf5",
          borderColor: "#a7f3d0",
          icon: icon || <CheckCircleIcon />,
        };
      case "error":
        return {
          color: "#ef4444",
          backgroundColor: "#fef2f2",
          borderColor: "#fecaca",
          icon: icon || <ErrorIcon />,
        };
      case "warning":
        return {
          color: "#f59e0b",
          backgroundColor: "#fffbeb",
          borderColor: "#fde68a",
          icon: icon || <WarningIcon />,
        };
      case "info":
      default:
        return {
          color: "#6366f1",
          backgroundColor: "#eef2ff",
          borderColor: "#c7d2fe",
          icon: icon || <InfoIcon />,
        };
    }
  };

  const config = getConfig();

  return (
    <Card
      sx={{
        p: 3,
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: 2,
        textAlign: "center",
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: `${config.color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: config.color,
          }}
        >
          {config.icon}
        </Box>
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: config.color,
          mb: description ? 1 : 2,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mb: 2,
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      )}

      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          sx={{
            backgroundColor: config.color,
            "&:hover": {
              backgroundColor: config.color,
              opacity: 0.9,
            },
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          {action.label}
        </Button>
      )}
    </Card>
  );
};

export default StatusCard;
