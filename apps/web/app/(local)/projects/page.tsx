"use client";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import CreateProjectDialog from "./components/CreateProjectDialog";
import ProjectFilters from "./components/ProjectFilters";
import ProjectGrid from "./components/ProjectGrid";
import ProjectList from "./components/ProjectList";
import ProjectStats from "./components/ProjectStats";
import { useProjects, useProjectStats } from "@/hooks/useProjects";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { projects, isLoading, error, mutate } = useProjects();
  const { mutate: mutateStats } = useProjectStats();

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: "list" | "grid"
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
            Quản lý dự án
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tạo, quản lý và theo dõi tiến độ các dự án của bạn
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            px: 3,
          }}
        >
          Tạo dự án mới
        </Button>
      </Box>

      <ProjectStats />

      <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            size="small"
            placeholder="Tìm kiếm dự án..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ textTransform: "none" }}
          >
            Bộ lọc
          </Button>

          <Box sx={{ ml: "auto" }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="grid">
                <ViewModuleIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {showFilters && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <ProjectFilters />
          </Box>
        )}
      </Paper>

      <Box sx={{ flex: 1 }}>
        {viewMode === "grid" ? (
          <ProjectGrid
            projects={filteredProjects}
            isLoading={isLoading}
            error={error}
            searchQuery={searchQuery}
          />
        ) : (
          <ProjectList
            projects={filteredProjects}
            isLoading={isLoading}
            error={error}
            searchQuery={searchQuery}
          />
        )}
      </Box>

      <CreateProjectDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        mutate={mutate}
        mutateStats={mutateStats}
      />
    </Box>
  );
}
