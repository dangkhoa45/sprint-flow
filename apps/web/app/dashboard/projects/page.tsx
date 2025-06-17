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

export default function ProjectsPage() {
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
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Quản lý dự án
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tạo, theo dõi và quản lý các dự án của bạn
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateDialog(true)}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Tạo dự án mới
          </Button>
        </Box>

        <ProjectsStats />
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
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
            sx={{ minWidth: 300, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            color={showFilters ? "primary" : "default"}
            sx={{
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
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
                borderRadius: 2,
                px: 2,
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
  );
}
