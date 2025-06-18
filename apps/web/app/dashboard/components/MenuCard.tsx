"use client";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useThemeMode } from "../../../provider/ThemeContext";

interface MenuCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  color: string;
}

const MenuCard = ({ title, description, icon, path, color }: MenuCardProps) => {
  const router = useRouter();
  const theme = useTheme();
  const { resolvedTheme } = useThemeMode();
  const [isHovered, setIsHovered] = useState(false);

  const isDark = resolvedTheme === "dark";

  const handleClick = () => {
    router.push(path);
  };

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? isDark
            ? "0 8px 25px rgba(0, 0, 0, 0.4)"
            : "0 8px 25px rgba(0, 0, 0, 0.1)"
          : isDark
          ? "0 2px 8px rgba(0, 0, 0, 0.3)"
          : "0 2px 8px rgba(0, 0, 0, 0.05)",
        "&:hover": {
          borderColor: color,
          "& .card-icon": {
            transform: "scale(1.05)",
            color: color,
            backgroundColor: `${color}15`,
          },
          "& .card-title": {
            color: color,
          },
          "& .card-arrow": {
            transform: "translateX(4px)",
            opacity: 1,
            color: color,
          },
        },
      }}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{
          height: "100%",
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          "&:hover .MuiCardActionArea-focusHighlight": {
            opacity: 0,
          },
        }}
      >
        <CardContent
          sx={{
            padding: 0,
            "&:last-child": {
              paddingBottom: 0,
            },
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            className="card-icon"
            sx={{
              color: `${color}CC`,
              mb: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 2,
              backgroundColor: `${color}10`,
              border: `1px solid ${color}20`,
            }}
          >
            {icon}
          </Box>

          <Box sx={{ flexGrow: 1, mb: 2 }}>
            <Typography
              className="card-title"
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: theme.palette.text.primary,
                transition: "all 0.3s ease-in-out",
                fontSize: "1.1rem",
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.5,
                fontSize: "0.85rem",
              }}
            >
              {description}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <ArrowForwardIcon
              className="card-arrow"
              sx={{
                fontSize: 18,
                color: theme.palette.text.secondary,
                transition: "all 0.3s ease",
                transform: "translateX(0)",
                opacity: 0.7,
              }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MenuCard;
