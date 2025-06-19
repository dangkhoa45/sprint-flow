"use client";
import { Container } from "@mui/material";
import ProjectsGrid from "./components/ProjectsGrid";

export default function ProjectsPage() {
  return (
    <Container maxWidth={false} sx={{ px: 2, py: 2 }}>
      <ProjectsGrid />
    </Container>
  );
}
