import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

interface ReportWrapperProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function ReportWrapper({ title, subtitle, description, actions, children }: ReportWrapperProps) {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Report Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 3 
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {title}
          </Typography>
          {(subtitle || description) && (
            <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '1rem',
            }}
          >
              {subtitle || description}
            </Typography>
          )}
        </Box>
        
        {actions && (
          <Box sx={{ ml: 2, flexShrink: 0 }}>
            {actions}
          </Box>
        )}
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Report Content */}
      {children}
    </Box>
  );
}
