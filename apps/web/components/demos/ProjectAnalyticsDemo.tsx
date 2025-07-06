/**
 * Project Analytics Demo Component
 *
 * This component demonstrates the enhanced analytics functionality:
 * - Advanced project statistics
 * - Resource utilization metrics
 * - Project distribution charts
 * - Efficiency tracking
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { ProjectEnhancementsService } from '@/api/project-enhancements';
import {
  AdvancedProjectStats,
  ResourceUtilization,
} from '@/types/project-enhancements';

export const ProjectAnalyticsDemo: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdvancedProjectStats | null>(null);
  const [resourceUtilization, setResourceUtilization] =
    useState<ResourceUtilization | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, resourceData] = await Promise.all([
        ProjectEnhancementsService.getAdvancedAnalytics(),
        ProjectEnhancementsService.getResourceUtilization(),
      ]);
      setAnalytics(analyticsData);
      setResourceUtilization(resourceData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics || !resourceUtilization) {
    return (
      <Box p={3}>
        <Typography variant='h4' gutterBottom>
          Project Analytics
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}h`;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const getEfficiencyColor = (ratio: number) => {
    if (ratio <= 1) return 'success.main';
    if (ratio <= 1.2) return 'warning.main';
    return 'error.main';
  };

  const getEfficiencyText = (ratio: number) => {
    if (ratio <= 1) return 'On Track';
    if (ratio <= 1.2) return 'Slightly Over';
    return 'Over Budget';
  };

  return (
    <Box p={3}>
      <Typography variant='h4' gutterBottom>
        Project Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Project Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Project Overview
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant='h3' color='primary'>
                    {analytics.total}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Total Projects
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='h3' color='success.main'>
                    {analytics.completed}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Completed
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='h3' color='info.main'>
                    {analytics.inProgress}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    In Progress
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='h3' color='error.main'>
                    {analytics.overdue}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Overdue
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Typography variant='body2' color='text.secondary'>
                  Average Progress
                </Typography>
                <LinearProgress
                  variant='determinate'
                  value={analytics.averageProgress}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant='caption' color='text.secondary'>
                  {analytics.averageProgress.toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Resource Utilization */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Resource Utilization
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant='h4' color='primary'>
                    {formatCurrency(resourceUtilization.totalBudget)}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Total Budget
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='h4' color='warning.main'>
                    {formatCurrency(resourceUtilization.totalSpent)}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Spent
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box display='flex' alignItems='center' gap={1}>
                    <Typography variant='h4'>
                      {resourceUtilization.totalTeamMembers}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Team Members
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Typography variant='body2' color='text.secondary'>
                  Budget Utilization
                </Typography>
                <LinearProgress
                  variant='determinate'
                  value={Math.min(
                    (resourceUtilization.totalSpent /
                      resourceUtilization.totalBudget) *
                      100,
                    100
                  )}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant='caption' color='text.secondary'>
                  {(
                    (resourceUtilization.totalSpent /
                      resourceUtilization.totalBudget) *
                    100
                  ).toFixed(1)}
                  %
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Time Tracking */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Time Tracking
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant='h4' color='info.main'>
                    {formatHours(analytics.totalEstimatedHours)}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Estimated Hours
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='h4' color='primary'>
                    {formatHours(analytics.totalActualHours)}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Actual Hours
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Typography variant='body2' color='text.secondary'>
                    Efficiency Ratio
                  </Typography>
                  <Chip
                    label={getEfficiencyText(analytics.efficiencyRatio)}
                    size='small'
                    sx={{
                      backgroundColor: getEfficiencyColor(
                        analytics.efficiencyRatio
                      ),
                      color: 'white',
                    }}
                  />
                </Box>
                <Typography
                  variant='h5'
                  sx={{ color: getEfficiencyColor(analytics.efficiencyRatio) }}
                >
                  {analytics.efficiencyRatio.toFixed(2)}x
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {analytics.efficiencyRatio > 1
                    ? 'Over estimated'
                    : 'Under estimated'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Most Used Tags */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Most Used Tags
              </Typography>

              <Box display='flex' flexWrap='wrap' gap={1}>
                {analytics.mostUsedTags.slice(0, 8).map(tagData => (
                  <Chip
                    key={tagData.tag}
                    label={`${tagData.tag} (${tagData.count})`}
                    variant='outlined'
                    size='small'
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Project Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Status Distribution
              </Typography>

              <List dense>
                {analytics.projectsByStatus.map(statusData => (
                  <ListItem key={statusData.status} sx={{ px: 0 }}>
                    <ListItemText
                      primary={statusData.status}
                      secondary={`${statusData.count} projects`}
                    />
                    <Typography variant='h6' color='primary'>
                      {statusData.count}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Priority Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Priority Distribution
              </Typography>

              <List dense>
                {analytics.projectsByPriority.map(priorityData => (
                  <ListItem key={priorityData.priority} sx={{ px: 0 }}>
                    <ListItemText
                      primary={priorityData.priority}
                      secondary={`${priorityData.count} projects`}
                    />
                    <Typography variant='h6' color='primary'>
                      {priorityData.count}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Monthly Trends
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box textAlign='center'>
                    <Typography variant='h3' color='success.main'>
                      {analytics.projectsCreatedThisMonth}
                    </Typography>
                    <Typography variant='body1' color='text.secondary'>
                      Projects Created This Month
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box textAlign='center'>
                    <Typography variant='h3' color='primary'>
                      {analytics.projectsCompletedThisMonth}
                    </Typography>
                    <Typography variant='body1' color='text.secondary'>
                      Projects Completed This Month
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
