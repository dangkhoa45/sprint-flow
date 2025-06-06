"use client";
import AddIcon from "@mui/icons-material/Add";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { Project } from "../../../../types/project";
import ProjectCard from "./ProjectCard";

interface ProjectsGridProps {
  projects: Project[];
  loading?: boolean;
  onCreateProject?: () => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
  onViewProject?: (project: Project) => void;
}

// Skeleton component for loading state
const ProjectCardSkeleton = () => (
  <Paper
    elevation={0}
    sx={{
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: 3,
      p: 3,
      height: 320,
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Skeleton
          variant="text"
          height={32}
          width="80%"
          sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
        />
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Skeleton
            variant="rounded"
            height={24}
            width={80}
            sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
          />
          <Skeleton
            variant="rounded"
            height={24}
            width={60}
            sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
          />
        </Box>
      </Box>
      <Skeleton
        variant="circular"
        width={32}
        height={32}
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
      />
    </Box>

    <Skeleton
      variant="text"
      height={20}
      width="100%"
      sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", mb: 1 }}
    />
    <Skeleton
      variant="text"
      height={20}
      width="70%"
      sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", mb: 3 }}
    />

    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Skeleton
          variant="text"
          height={16}
          width={60}
          sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
        />
        <Skeleton
          variant="text"
          height={16}
          width={40}
          sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
        />
      </Box>
      <Skeleton
        variant="rounded"
        height={6}
        width="100%"
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
      />
    </Box>

    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Skeleton
        variant="text"
        height={16}
        width={80}
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
      />
      <Skeleton
        variant="text"
        height={16}
        width={60}
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
      />
    </Box>

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Skeleton
        variant="text"
        height={16}
        width={100}
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
      />
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="circular"
            width={24}
            height={24}
            sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
          />
        ))}
      </Box>
    </Box>
  </Paper>
);

// Empty state component
const EmptyState = ({ onCreateProject }: { onCreateProject?: () => void }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      py: 8,
      px: 4,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 4,
        p: 6,
        maxWidth: 400,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 3rem auto",
        }}
      >
        <ViewModuleIcon sx={{ fontSize: 40, color: "white" }} />
      </Box>

      <Typography
        variant="h5"
        sx={{
          color: "white",
          fontWeight: 600,
          mb: 2,
        }}
      >
        Chưa có dự án nào
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "rgba(255, 255, 255, 0.8)",
          mb: 4,
          lineHeight: 1.6,
        }}
      >
        Bạn chưa có dự án nào. Hãy tạo dự án đầu tiên để bắt đầu quản lý công
        việc của mình.
      </Typography>

      {onCreateProject && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateProject}
          sx={{
            background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
            boxShadow: "0 8px 32px rgba(66, 165, 245, 0.3)",
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 40px rgba(66, 165, 245, 0.4)",
            },
          }}
        >
          Tạo dự án đầu tiên
        </Button>
      )}
    </Paper>
  </Box>
);

export default function ProjectsGrid({
  projects,
  loading = false,
  onCreateProject,
  onEditProject,
  onDeleteProject,
  onViewProject,
}: ProjectsGridProps) {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <ProjectCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (projects.length === 0) {
    return <EmptyState onCreateProject={onCreateProject} />;
  }

  return (
    <Grid container spacing={3}>
      {projects.map((project) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project._id}>
          <ProjectCard
            project={project}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
            onView={onViewProject}
          />
        </Grid>
      ))}
    </Grid>
  );
}
