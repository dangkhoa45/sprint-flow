"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";

interface EmptyStateProps {
  type?: "default" | "search" | "projects" | "tasks" | "users";
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

const EmptyState = ({ 
  type = "default", 
  title, 
  description, 
  action, 
  icon 
}: EmptyStateProps) => {
  const theme = useTheme();

  const getConfig = () => {
    switch (type) {
      case "search":
        return {
          icon: icon || <SearchOffIcon sx={{ fontSize: 48 }} />,
          color: "#64748b",
        };
      case "projects":
        return {
          icon: icon || <FolderOpenIcon sx={{ fontSize: 48 }} />,
          color: "#6366f1",
        };
      case "tasks":
        return {
          icon: icon || <AssignmentIcon sx={{ fontSize: 48 }} />,
          color: "#10b981",
        };
      case "users":
        return {
          icon: icon || <PeopleIcon sx={{ fontSize: 48 }} />,
          color: "#8b5cf6",
        };
      default:
        return {
          icon: icon || <FolderOpenIcon sx={{ fontSize: 48 }} />,
          color: "#64748b",
        };
    }
  };

  const config = getConfig();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 8,
        px: 4,
        minHeight: 300,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: `${config.color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: config.color,
          mb: 3,
        }}
      >
        {config.icon}
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mb: 3,
            maxWidth: 400,
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
            px: 3,
            py: 1,
          }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
