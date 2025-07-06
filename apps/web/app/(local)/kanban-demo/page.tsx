'use client';
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { KanbanBoard } from '@/components/kanban';

// Mock data for testing
const EMPTY_TASKS: any[] = [];

const mockTaskUpdate = () => {
  console.log('Task updated (demo mode)');
};

const mockTaskClick = (task: any) => {
  console.log('Task clicked:', task);
};

export default function KanbanDemoPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          🎯 Kanban Board Demo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Demo tính năng bảng Kanban với drag-and-drop functionality
        </Typography>
      </Box>
      
      <Box sx={{ height: '80vh' }}>
        <KanbanBoard
          tasks={EMPTY_TASKS}
          onTaskUpdate={mockTaskUpdate}
          onTaskClick={mockTaskClick}
          projectId="demo-project"
        />
      </Box>
    </Container>
  );
}