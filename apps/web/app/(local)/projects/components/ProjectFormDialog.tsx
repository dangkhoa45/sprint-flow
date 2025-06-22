'use client';
import { projectsApi } from '@/api/projects';
import { usersApi } from '@/api/users';
import { useToast } from '@/hooks/useToast';
import {
  CreateProjectDto,
  Project,
  ProjectPriority,
  ProjectStatus,
  UpdateProjectDto,
} from '@/types/project';
import { User } from '@/types/user';
import { ErrorResponse } from '@/types/shared';
import {
  getProjectPriorityText,
  getProjectStatusText,
} from '@/utils/projectHelpers';
import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, FormHelperText, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { vi } from 'date-fns/locale';
import { useEffect, useState } from 'react';

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  mutate?: () => void;
  mode: 'create' | 'edit';
  project?: Project | null;
}

const ProjectFormDialog = ({
  open,
  onClose,
  mutate,
  mode,
  project,
}: ProjectFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: ProjectPriority.Medium,
    startDate: null as Date | null,
    endDate: null as Date | null,
    estimatedHours: '',
    members: [] as string[],
    tags: [] as string[],
    status: ProjectStatus.Planning as ProjectStatus,
    progress: 0,
    actualHours: '',
  });

  const [availableMembers, setAvailableMembers] = useState<User[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await usersApi.getUsers();
        setAvailableMembers(users);
      } catch (error) {
        console.error(error);
        toastError('Không thể tải danh sách thành viên');
      }
    };
    if (open) {
      fetchUsers();
    }
  }, [open, toastError]);

  useEffect(() => {
    if (mode === 'edit' && project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        priority: project.priority || ProjectPriority.Medium,
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
        estimatedHours: project.estimatedHours
          ? String(project.estimatedHours)
          : '',
        members: project.members?.map((m: User) => m._id) || [],
        tags: project.tags || [],
        status: project.status || ProjectStatus.Planning,
        progress: project.progress || 0,
        actualHours: String(project.actualHours || ''),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        priority: ProjectPriority.Medium,
        startDate: null,
        endDate: null,
        estimatedHours: '',
        members: [],
        tags: [],
        status: ProjectStatus.Planning,
        progress: 0,
        actualHours: '',
      });
    }
  }, [mode, project, open]);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleSelectChange =
    (field: string) => (event: SelectChangeEvent<string>) => {
      setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleDateChange =
    (field: 'startDate' | 'endDate') => (date: Date | null) => {
      setFormData(prev => ({ ...prev, [field]: date }));
    };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setFormError('Tên dự án là bắt buộc.');
      return;
    }
    setLoading(true);
    setFormError(null);

    try {
      const basePayload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        members: formData.members.length > 0 ? formData.members : undefined,
        startDate: formData.startDate?.toISOString(),
        endDate: formData.endDate?.toISOString(),
        estimatedHours: formData.estimatedHours
          ? Number(formData.estimatedHours)
          : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      if (mode === 'edit' && project?._id) {
        const payload: UpdateProjectDto = {
          ...basePayload,
          status: formData.status,
          progress: formData.progress,
          actualHours: formData.actualHours
            ? Number(formData.actualHours)
            : undefined,
        };
        await projectsApi.updateProject(project._id, payload);
        success('Cập nhật dự án thành công!');
      } else {
        const payload: CreateProjectDto = basePayload;
        await projectsApi.createProject(payload);
        success('Tạo dự án thành công!');
      }

      if (mutate) mutate();
      onClose();
    } catch (err) {
      const error = err as ErrorResponse;
      const message = Array.isArray(error.message) 
        ? error.message.join(', ') 
        : error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      toastError(message);
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        {mode === 'edit' ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              label='Tên dự án'
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!formError && !formData.name.trim()}
              helperText={!!formError && !formData.name.trim() ? formError : ''}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label='Mô tả'
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange('description')}
            />
          </Grid>

          {mode === 'edit' && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id='status-select-label'>Trạng thái</InputLabel>
                <Select
                  labelId='status-select-label'
                  value={formData.status}
                  onChange={handleSelectChange('status')}
                  label='Trạng thái'
                >
                  {Object.values(ProjectStatus).map(status => (
                    <MenuItem key={status} value={status}>
                      {getProjectStatusText(status)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: mode === 'edit' ? 6 : 12 }}>
            <FormControl fullWidth>
              <InputLabel id='priority-select-label'>Độ ưu tiên</InputLabel>
              <Select
                labelId='priority-select-label'
                value={formData.priority}
                onChange={handleSelectChange('priority')}
                label='Độ ưu tiên'
                renderValue={selected => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getProjectPriorityText(selected as ProjectPriority)}
                  </Box>
                )}
              >
                {Object.values(ProjectPriority).map(priority => (
                  <MenuItem key={priority} value={priority}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getProjectPriorityText(priority)}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={vi}
            >
              <DatePicker
                label='Ngày bắt đầu'
                value={formData.startDate}
                onChange={handleDateChange('startDate')}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={vi}
            >
              <DatePicker
                label='Ngày kết thúc'
                value={formData.endDate}
                onChange={handleDateChange('endDate')}
                minDate={formData.startDate || undefined}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label='Ước tính giờ làm việc'
              type='number'
              value={formData.estimatedHours}
              onChange={handleInputChange('estimatedHours')}
              inputProps={{ min: '0' }}
            />
          </Grid>
          {mode === 'edit' && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Số giờ thực tế'
                  type='number'
                  value={formData.actualHours}
                  onChange={handleInputChange('actualHours')}
                  inputProps={{ min: '0' }}
                />
              </Grid>
            </>
          )}

          {mode === 'edit' && (
            <Grid size={{ xs: 12 }}>
              <Typography gutterBottom>
                Tiến độ ({formData.progress}%)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Slider
                  value={formData.progress}
                  onChange={(_, value) =>
                    setFormData(p => ({ ...p, progress: value }))
                  }
                  aria-labelledby='input-slider'
                  valueLabelDisplay='auto'
                  sx={{ flex: 1 }}
                />
                <TextField
                  value={formData.progress}
                  size='small'
                  onChange={e => {
                    const value =
                      e.target.value === '' ? 0 : Number(e.target.value);
                    if (value >= 0 && value <= 100) {
                      setFormData(p => ({ ...p, progress: value }));
                    }
                  }}
                  inputProps={{
                    step: 5,
                    min: 0,
                    max: 100,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                  sx={{ width: '80px' }}
                />
              </Box>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Autocomplete
                multiple
                id='members-autocomplete'
                options={availableMembers}
                getOptionLabel={option =>
                  option.displayName || option.email || ''
                }
                value={availableMembers.filter(m =>
                  formData.members.includes(m._id)
                )}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    members: newValue.map(v => v._id),
                  }));
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Thành viên'
                    placeholder='Chọn thành viên'
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant='outlined'
                      label={option.displayName || option.email}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography gutterBottom>Tags</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TextField
                label='Thêm thẻ tag'
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                size='small'
                sx={{ flex: 1 }}
              />
              <Button onClick={handleAddTag} variant='outlined' size='small'>
                Thêm
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </Grid>

          {formError && (
            <Grid size={{ xs: 12 }}>
              <FormHelperText error>{formError}</FormHelperText>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          startIcon={<SaveIcon />}
          disabled={loading}
        >
          {loading
            ? 'Đang lưu...'
            : mode === 'edit'
              ? 'Lưu thay đổi'
              : 'Tạo dự án'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectFormDialog;
