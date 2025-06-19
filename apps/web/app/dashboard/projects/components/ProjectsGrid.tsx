"use client";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useProjects } from "../../../../hooks/useProjects";
import { ProjectPriority, ProjectStatus } from "../../../../types/project";
import CreateProjectDialog from "./CreateProjectDialog";
import ProjectCard from "./ProjectCard";
import ProjectFiltersAdvanced from "./ProjectFiltersAdvanced";
import ProjectTable from "./ProjectTable";

type ViewMode = "grid" | "list";

const ProjectsGrid = () => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState<{
    status?: ProjectStatus[];
    priority?: ProjectPriority[];
    progressRange?: [number, number];
    dateRange?: {
      startDate?: Date | null;
      endDate?: Date | null;
    };
    owner?: string;
    tags?: string[];
    estimatedHoursRange?: [number, number];
  }>({});

  const { projects, isLoading, total } = useProjects({
    search: search || undefined,
    status: filters.status?.[0],
    priority: filters.priority?.[0],
    limit: 50,
  });

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return "#2196f3";
      case ProjectStatus.InProgress:
        return "#4caf50";
      case ProjectStatus.OnHold:
        return "#ff9800";
      case ProjectStatus.Completed:
        return "#8bc34a";
      case ProjectStatus.Cancelled:
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Critical:
        return "#d32f2f";
      case ProjectPriority.High:
        return "#f57c00";
      case ProjectPriority.Medium:
        return "#1976d2";
      case ProjectPriority.Low:
        return "#388e3c";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: theme.palette.text.primary }}
            >
              Quản lý Dự án
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary, mt: 0.5 }}
            >
              Tổng cộng {total} dự án
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateDialog(true)}
            sx={{
              px: 2,
              py: 1,
              fontSize: "0.875rem",
              textTransform: "none",
              borderRadius: 1.5,
            }}
          >
            Tạo dự án
          </Button>
        </Box>

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
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 300, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              bgcolor: showFilters ? "primary.main" : "transparent",
              color: showFilters ? "white" : "text.secondary",
              "&:hover": {
                bgcolor: showFilters ? "primary.dark" : "action.hover",
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
          >
            <ToggleButton value="grid">
              <ViewModuleIcon sx={{ fontSize: 20 }} />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon sx={{ fontSize: 20 }} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {(filters.status?.length || filters.priority?.length) && (
          <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
            {filters.status?.map((status) => (
              <Chip
                key={status}
                label={status}
                size="small"
                sx={{
                  bgcolor: getStatusColor(status) + "20",
                  color: getStatusColor(status),
                  border: `1px solid ${getStatusColor(status)}40`,
                }}
                onDelete={() =>
                  setFilters({
                    ...filters,
                    status: filters.status?.filter((s) => s !== status),
                  })
                }
              />
            ))}
            {filters.priority?.map((priority) => (
              <Chip
                key={priority}
                label={priority}
                size="small"
                sx={{
                  bgcolor: getPriorityColor(priority) + "20",
                  color: getPriorityColor(priority),
                  border: `1px solid ${getPriorityColor(priority)}40`,
                }}
                onDelete={() =>
                  setFilters({
                    ...filters,
                    priority: filters.priority?.filter((p) => p !== priority),
                  })
                }
              />
            ))}
          </Box>
        )}
      </Box>

      {showFilters && (
        <Card sx={{ mb: 3, p: 2 }}>
          <ProjectFiltersAdvanced filters={filters} onFiltersChange={setFilters} />
        </Card>
      )}

      {viewMode === "grid" ? (
        <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
              key={project._id}
            >
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <ProjectTable projects={projects} isLoading={isLoading} />
      )}

      <CreateProjectDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </Box>
  );
};

export default ProjectsGrid;
