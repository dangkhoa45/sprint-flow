"use client";
import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

interface MenuCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  color: string;
  bgColor: string;
  gradient: string;
}

const MenuCard = ({
  title,
  description,
  icon,
  path,
  color,
  bgColor,
  gradient,
}: MenuCardProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

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
        background: isHovered
          ? "rgba(255, 255, 255, 0.15)"
          : "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 3,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0, 0, 0, 0.2)"
          : "0 8px 24px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          "& .card-icon": {
            transform: "scale(1.1) rotate(5deg)",
          },
          "& .card-title": {
            background: gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          },
        },
      }}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{
          height: "100%",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
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
              color: color,
              marginBottom: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${bgColor}20 0%, ${bgColor}40 100%)`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${color}30`,
            }}
          >
            {icon}
          </Box>
          <Typography
            className="card-title"
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              marginBottom: 1,
              color: "#ffffff",
              transition: "all 0.3s ease-in-out",
              letterSpacing: "0.25px",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              lineHeight: 1.6,
              fontSize: "0.9rem",
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MenuCard;
