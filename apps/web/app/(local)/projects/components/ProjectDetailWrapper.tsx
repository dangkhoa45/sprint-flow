"use client";
import Container from "@mui/material/Container";
import { ReactNode } from "react";

interface ProjectDetailWrapperProps {
  children: ReactNode;
}

export default function ProjectDetailWrapper({ children }: ProjectDetailWrapperProps) {
  return (
    <Container 
      maxWidth={false}
      sx={{ 
        minHeight: "100vh",
        mx: -3
      }}
    >
      {children}
    </Container>
  );
} 