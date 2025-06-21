"use client";
import { Milestone, MilestoneStatus } from "@/types/milestone";
import { getMilestoneStatusColor, getMilestoneStatusIcon, getMilestoneStatusText, isMilestoneOverdue } from "@/utils/milestoneHelpers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

const MilestoneTimeline = ({ milestones }: MilestoneTimelineProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const getTimelineIcon = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.Completed:
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case MilestoneStatus.InProgress:
        return <ScheduleIcon sx={{ color: 'primary.main' }} />;
      default:
        return <CircleIcon sx={{ color: 'action.disabled' }} />;
    }
  };

  const sortedMilestones = [...milestones].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  if (milestones.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Chưa có milestone nào
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Timeline Milestones
      </Typography>
      
      <Box sx={{ position: 'relative' }}>
        {/* Timeline line */}
        <Box
          sx={{
            position: 'absolute',
            left: 20,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: 'divider',
            zIndex: 0,
          }}
        />
        
        {sortedMilestones.map((milestone, index) => (
          <Box key={milestone._id} sx={{ position: 'relative', mb: 3 }}>
            {/* Timeline dot */}
            <Box
              sx={{
                position: 'absolute',
                left: 16,
                top: 8,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: getMilestoneStatusColor(milestone.status),
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getTimelineIcon(milestone.status)}
            </Box>
            
            {/* Content */}
            <Box sx={{ ml: 8 }}>
              <Card sx={{ 
                backgroundColor: 'background.paper',
                border: `1px solid ${getMilestoneStatusColor(milestone.status)}30`,
                '&:hover': {
                  borderColor: getMilestoneStatusColor(milestone.status),
                  boxShadow: `0 4px 12px ${getMilestoneStatusColor(milestone.status)}20`,
                }
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {milestone.title}
                        </Typography>
                        <Chip
                          label={getMilestoneStatusText(milestone.status)}
                          size="small"
                          icon={<span>{getMilestoneStatusIcon(milestone.status)}</span>}
                          sx={{
                            backgroundColor: getMilestoneStatusColor(milestone.status) + '20',
                            color: getMilestoneStatusColor(milestone.status),
                            border: `1px solid ${getMilestoneStatusColor(milestone.status)}40`,
                          }}
                        />
                        {isMilestoneOverdue(milestone.dueDate) && milestone.status !== MilestoneStatus.Completed && (
                          <Chip
                            label="Quá hạn"
                            color="error"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      {milestone.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {milestone.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {milestone.assignedTo ? (milestone.assignedTo.displayName || milestone.assignedTo.username) : 'Chưa giao'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(milestone.dueDate)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Tiến độ
                      </Typography>
                      <Typography variant="caption" fontWeight={500}>
                        {milestone.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={milestone.progress}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'action.hover',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getMilestoneStatusColor(milestone.status),
                        },
                      }}
                    />
                  </Box>
                  
                  {milestone.tags && milestone.tags.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {milestone.tags.slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {milestone.tags.length > 3 && (
                        <Chip
                          label={`+${milestone.tags.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MilestoneTimeline; 