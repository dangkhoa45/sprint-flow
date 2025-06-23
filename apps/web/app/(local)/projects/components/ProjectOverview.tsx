'use client';
import { Attachment } from '@/types/attachment';
import { Milestone } from '@/types/milestone';
import { Project } from '@/types/project';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

interface ProjectOverviewProps {
  project: Project;
  _milestones: Milestone[];
  attachments: Attachment[];
}

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card variant='outlined' sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant='body2' fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {children}
      </Box>
    </CardContent>
  </Card>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Typography variant='body2' color='text.secondary'>
      {label}
    </Typography>
    <Typography variant='body2' fontWeight={500} color='text.primary'>
      {value}
    </Typography>
  </Box>
);

export default function ProjectOverview({
  project,
  attachments,
}: ProjectOverviewProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getTimeRemaining = () => {
    if (!project.endDate) return 'Không xác định';
    const endDate = new Date(project.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    if (diffTime < 0) return 'Đã hết hạn';
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ngày`;
  };

  return (
    <Grid container spacing={3}>
      {/* Effort Info */}
      <Grid size={{ xs: 12, md: 4 }}>
        <InfoCard title='Thời gian'>
          <InfoRow
            label='Giờ dự kiến'
            value={`${project.estimatedHours || 0} giờ`}
          />
          <InfoRow
            label='Giờ thực tế'
            value={`${project.actualHours || 0} giờ`}
          />
          <InfoRow
            label='Chênh lệch'
            value={`${(project.estimatedHours || 0) - (project.actualHours || 0)} giờ`}
          />
        </InfoCard>
      </Grid>

      {/* Schedule Info */}
      <Grid size={{ xs: 12, md: 4 }}>
        <InfoCard title='Lịch trình'>
          <InfoRow label='Ngày bắt đầu' value={formatDate(project.startDate)} />
          <InfoRow label='Ngày kết thúc' value={formatDate(project.endDate)} />
          <InfoRow label='Thời gian còn lại' value={getTimeRemaining()} />
        </InfoCard>
      </Grid>

      {/* General Info */}
      <Grid size={{ xs: 12, md: 4 }}>
        <InfoCard title='Thông tin chung'>
          <InfoRow
            label='Chủ sở hữu'
            value={project.owner?.displayName || project.owner?.username}
          />
          <InfoRow
            label='Thành viên'
            value={`${project.members?.length || 0} người`}
          />
          <InfoRow label='Tệp đính kèm' value={`${attachments.length} tệp`} />
        </InfoCard>
      </Grid>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <Grid size={{ xs: 12 }}>
          <InfoCard title='Tags'>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {project.tags.map(tag => (
                <Chip key={tag} label={tag} size='small' variant='outlined' />
              ))}
            </Box>
          </InfoCard>
        </Grid>
      )}
    </Grid>
  );
}
