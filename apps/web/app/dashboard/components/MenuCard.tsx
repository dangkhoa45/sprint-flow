"use client";
import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
interface MenuCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  color: string;
  bgColor: string;
}

const MenuCard = ({
  title,
  description,
  icon,
  path,
  color,
  bgColor,
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
        backgroundColor: (theme) => theme.palette.mode === 'light' ? bgColor : theme.palette.grey[800],
        border: (theme) => `1px solid ${theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700]}`,
        borderRadius: 3,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? (theme) => theme.palette.mode === 'light' 
            ? "0 8px 25px rgba(0, 0, 0, 0.12)" 
            : "0 8px 25px rgba(0, 0, 0, 0.3)"
          : (theme) => theme.palette.mode === 'light'
            ? "0 2px 8px rgba(0, 0, 0, 0.08)"
            : "0 2px 8px rgba(0, 0, 0, 0.2)",
        "&:hover": {
          "& .card-icon": {
            transform: "scale(1.05)",
          },
          "& .card-title": {
            color: color,
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
              backgroundColor: (theme) => theme.palette.mode === 'light' ? bgColor : theme.palette.grey[700],
              border: `2px solid ${color}30`,
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
              color: (theme) => theme.palette.text.primary,
              transition: "all 0.3s ease-in-out",
              letterSpacing: "0.25px",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: (theme) => theme.palette.text.secondary,
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
