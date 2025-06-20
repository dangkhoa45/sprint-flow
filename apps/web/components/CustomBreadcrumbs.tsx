"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface CustomBreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

const CustomBreadcrumbs = ({ items, showHome = true }: CustomBreadcrumbsProps) => {
  const pathname = usePathname();
  const theme = useTheme();

  // Auto-generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({
        label: "Dashboard",
        href: "/dashboard",
        icon: <HomeIcon sx={{ fontSize: 16 }} />,
      });
    }

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip if it's the dashboard segment and we already added home
      if (segment === "dashboard" && showHome) return;

      // Format segment label
      const label = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        href: index === pathSegments.length - 1 ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 16 }} />}
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: theme.palette.text.secondary,
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          if (isLast || !item.href) {
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {item.icon}
                <Typography
                  variant="body2"
                  sx={{
                    color: isLast 
                      ? theme.palette.text.primary 
                      : theme.palette.text.secondary,
                    fontWeight: isLast ? 600 : 400,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          }

          return (
            <Box
              key={index}
              component={Link}
              href={item.href}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                textDecoration: "none",
                color: theme.palette.text.secondary,
                transition: "color 0.2s ease",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {item.icon}
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default CustomBreadcrumbs;
