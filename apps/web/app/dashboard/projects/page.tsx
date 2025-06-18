"use client";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useProjects } from "../../../hooks/useProjects";
import { ProjectQueryDto } from "../../../types/project";
import CreateProjectDialog from "./components/CreateProjectDialog";
import ProjectsFilters from "./components/ProjectsFilters";
import ProjectsGrid from "./components/ProjectsGrid";
import ProjectsList from "./components/ProjectsList";
import ProjectsStats from "./components/ProjectsStats";
import { useTheme } from "@mui/material/styles";
import { useThemeMode } from "../../../provider/ThemeContext";
import Fade from "@mui/material/Fade";

export default function ProjectsPage() {
  const theme = useTheme();
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === "dark";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Partial<ProjectQueryDto>>({
    status: undefined,
    priority: undefined,
    limit: 12,
    offset: 0,
  });

  const queryParams = {
    ...filters,
    search: search || undefined,
  };

  const { projects, total, isLoading, mutate } = useProjects(queryParams);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setFilters((prev) => ({ ...prev, offset: 0 }));
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: "grid" | "list" | null
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleFilterChange = (newFilters: Partial<ProjectQueryDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, offset: 0 }));
  };

  const handlePageChange = (offset: number) => {
    setFilters((prev) => ({ ...prev, offset }));
  };

  return (
    <Fade in timeout={300}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 0 },
            }}
          >
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                  background: isDark
                    ? "linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)"
                    : "linear-gradient(135deg, #000000 0%, #333333 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Quản lý dự án
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                }}
              >
                Tạo, theo dõi và quản lý các dự án một cách hiệu quả
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateDialog(true)}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                backgroundColor: isDark ? "#ffffff" : "#000000",
                color: isDark ? "#000000" : "#ffffff",
                boxShadow: isDark
                  ? "0 4px 12px rgba(255, 255, 255, 0.2)"
                  : "0 4px 12px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: isDark ? "#f5f5f5" : "#333333",
                  transform: "translateY(-2px)",
                  boxShadow: isDark
                    ? "0 6px 20px rgba(255, 255, 255, 0.3)"
                    : "0 6px 20px rgba(0, 0, 0, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Tạo dự án mới
            </Button>
          </Box>

          <ProjectsStats />
        </Box>

        {/* Search & Filter Section */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark
              ? "0 4px 20px rgba(0, 0, 0, 0.3)"
              : "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Tìm kiếm dự án..."
              value={search}
              onChange={handleSearchChange}
              sx={{ 
                minWidth: 300, 
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: theme.palette.action.hover,
                  "&:hover": {
                    backgroundColor: theme.palette.action.selected,
                  },
                  "&.Mui-focused": {
                    backgroundColor: "transparent",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
            />

            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? "primary" : "default"}
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                width: 48,
                height: 48,
                backgroundColor: showFilters ? theme.palette.primary.main + "15" : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <FilterListIcon />
            </IconButton>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  "&.Mui-selected": {
                    backgroundColor: isDark ? "#ffffff" : "#000000",
                    color: isDark ? "#000000" : "#ffffff",
                    "&:hover": {
                      backgroundColor: isDark ? "#f5f5f5" : "#333333",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="grid">
                <ViewModuleIcon />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

        {showFilters && (
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <ProjectsFilters
              filters={filters}
              onChangeAction={handleFilterChange}
            />
          </Box>
        )}
      </Paper>

      {viewMode === "grid" ? (
        <ProjectsGrid
          projects={projects}
          isLoading={isLoading}
          total={total}
          onPageChangeAction={handlePageChange}
          currentPage={Math.floor(
            (filters.offset || 0) / (filters.limit || 12)
          )}
          pageSize={filters.limit || 12}
          onProjectUpdateAction={() => mutate()}
        />
      ) : (
        <ProjectsList
          projects={projects}
          isLoading={isLoading}
          total={total}
          onPageChangeAction={handlePageChange}
          currentPage={Math.floor(
            (filters.offset || 0) / (filters.limit || 12)
          )}
          pageSize={filters.limit || 12}
          onProjectUpdateAction={() => mutate()}
        />
      )}

      <CreateProjectDialog
        open={showCreateDialog}
        onCloseAction={() => setShowCreateDialog(false)}
        onSuccessAction={() => {
          mutate();
          setShowCreateDialog(false);
        }}
      />
      </Container>
    </Fade>
  );
}
