/**
 * Project Templates Demo Component
 *
 * This component demonstrates the new project template functionality:
 * - Browse and filter templates
 * - Create projects from templates
 * - Rate templates
 * - Manage personal templates
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ProjectTemplateService } from '@/api/project-template';
import {
  ProjectTemplate,
  TemplateCategory,
  CreateProjectFromTemplateDto,
} from '@/types/project-template';

interface ProjectTemplateDemoProps {
  onProjectCreated?: (project: any) => void;
}

export const ProjectTemplateDemo: React.FC<ProjectTemplateDemoProps> = ({
  onProjectCreated,
}) => {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    myTemplates: false,
  });

  // Form state for creating project from template
  const [projectForm, setProjectForm] = useState<CreateProjectFromTemplateDto>({
    templateId: '',
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    members: [],
  });

  useEffect(() => {
    loadTemplates();
  }, [filters]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await ProjectTemplateService.getTemplates({
        category: filters.category as TemplateCategory,
        search: filters.search,
        myTemplates: filters.myTemplates,
      });
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);
      const project = await ProjectTemplateService.createProjectFromTemplate(
        selectedTemplate._id,
        {
          name: projectForm.name,
          description: projectForm.description,
          startDate: projectForm.startDate,
          endDate: projectForm.endDate,
          members: projectForm.members,
        }
      );

      setShowCreateDialog(false);
      setSelectedTemplate(null);
      setProjectForm({
        templateId: '',
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        members: [],
      });

      if (onProjectCreated) {
        onProjectCreated(project);
      }
    } catch (error) {
      console.error('Failed to create project from template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateTemplate = async (templateId: string, rating: number) => {
    try {
      await ProjectTemplateService.rateTemplate(templateId, rating);
      loadTemplates(); // Refresh to show updated rating
    } catch (error) {
      console.error('Failed to rate template:', error);
    }
  };

  const openCreateDialog = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setProjectForm({
      templateId: template._id,
      name: `${template.name} Project`,
      description: template.description || '',
      startDate: '',
      endDate: '',
      members: [],
    });
    setShowCreateDialog(true);
  };

  return (
    <Box p={3}>
      <Typography variant='h4' gutterBottom>
        Project Templates
      </Typography>

      {/* Filters */}
      <Box mb={3} display='flex' gap={2} alignItems='center'>
        <TextField
          label='Search templates'
          value={filters.search}
          onChange={e =>
            setFilters(prev => ({ ...prev, search: e.target.value }))
          }
          size='small'
          sx={{ minWidth: 200 }}
        />

        <FormControl size='small' sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            onChange={e =>
              setFilters(prev => ({ ...prev, category: e.target.value }))
            }
            label='Category'
          >
            <MenuItem value=''>All Categories</MenuItem>
            {Object.values(TemplateCategory).map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant={filters.myTemplates ? 'contained' : 'outlined'}
          onClick={() =>
            setFilters(prev => ({ ...prev, myTemplates: !prev.myTemplates }))
          }
        >
          My Templates
        </Button>
      </Box>

      {/* Templates Grid */}
      <Grid container spacing={3}>
        {templates.map(template => (
          <Grid item xs={12} sm={6} md={4} key={template._id}>
            <Card>
              <CardContent>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='start'
                  mb={1}
                >
                  <Typography variant='h6' noWrap>
                    {template.name}
                  </Typography>
                  <Chip
                    label={template.category}
                    size='small'
                    color='primary'
                    variant='outlined'
                  />
                </Box>

                <Typography variant='body2' color='text.secondary' paragraph>
                  {template.description}
                </Typography>

                <Box display='flex' alignItems='center' gap={1} mb={1}>
                  <Rating
                    value={template.rating}
                    precision={0.1}
                    size='small'
                    readOnly
                  />
                  <Typography variant='caption' color='text.secondary'>
                    ({template.ratingCount} reviews)
                  </Typography>
                </Box>

                <Typography variant='caption' color='text.secondary'>
                  Used {template.usageCount} times
                </Typography>

                {template.defaultTags.length > 0 && (
                  <Box mt={1}>
                    {template.defaultTags.slice(0, 3).map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size='small'
                        variant='outlined'
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>

              <CardActions>
                <Button
                  size='small'
                  variant='contained'
                  onClick={() => openCreateDialog(template)}
                >
                  Use Template
                </Button>

                <Button
                  size='small'
                  onClick={() => {
                    const rating = prompt('Rate this template (1-5):');
                    if (rating && !isNaN(Number(rating))) {
                      handleRateTemplate(template._id, Number(rating));
                    }
                  }}
                >
                  Rate
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Project Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          Create Project from Template: {selectedTemplate?.name}
        </DialogTitle>
        <DialogContent>
          <Box mt={1}>
            <TextField
              fullWidth
              label='Project Name'
              value={projectForm.name}
              onChange={e =>
                setProjectForm(prev => ({ ...prev, name: e.target.value }))
              }
              margin='normal'
              required
            />

            <TextField
              fullWidth
              label='Description'
              value={projectForm.description}
              onChange={e =>
                setProjectForm(prev => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              margin='normal'
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label='Start Date'
              type='date'
              value={projectForm.startDate}
              onChange={e =>
                setProjectForm(prev => ({ ...prev, startDate: e.target.value }))
              }
              margin='normal'
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label='End Date'
              type='date'
              value={projectForm.endDate}
              onChange={e =>
                setProjectForm(prev => ({ ...prev, endDate: e.target.value }))
              }
              margin='normal'
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateFromTemplate}
            variant='contained'
            disabled={!projectForm.name || loading}
          >
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
