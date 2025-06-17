'use client';

import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';

interface ProjectsTemplateProps {
  children: ReactNode;
}

export default function ProjectsTemplate({ children }: ProjectsTemplateProps) {
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          py: 4,
          position: "relative",
          minHeight: "calc(100vh - 180px)",
        }}
      >
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Fade>
  );
}
