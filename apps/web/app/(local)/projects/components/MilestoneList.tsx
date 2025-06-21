"use client";
import { milestonesApi } from "@/api/milestones";
import { useToast } from "@/hooks/useToast";
import { Milestone, MilestoneStatus } from "@/types/milestone";
import { getMilestoneStatusColor, getMilestoneStatusIcon, getMilestoneStatusText, isMilestoneOverdue } from "@/utils/milestoneHelpers";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import MilestoneDialog from "./MilestoneDialog";

interface MilestoneListProps {
  projectId: string;
  milestones: Milestone[];
  mutate: () => void;
}

const MilestoneList = ({ projectId, milestones, mutate }: MilestoneListProps) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMilestoneForMenu, setSelectedMilestoneForMenu] = useState<Milestone | null>(null);

  const { success, error: toastError } = useToast();

  const handleCreateMilestone = () => {
    setSelectedMilestone(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteMilestone = async (milestone: Milestone) => {
    try {
      await milestonesApi.deleteMilestone(milestone._id);
      success("Xóa mốc công việc thành công!");
      mutate();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Xóa mốc công việc thất bại";
      toastError(errorMessage);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, milestone: Milestone) => {
    setAnchorEl(event.currentTarget);
    setSelectedMilestoneForMenu(milestone);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMilestoneForMenu(null);
  };

  const handleMenuAction = (action: 'edit' | 'delete') => {
    if (!selectedMilestoneForMenu) return;
    
    if (action === 'edit') {
      handleEditMilestone(selectedMilestoneForMenu);
    } else if (action === 'delete') {
      handleDeleteMilestone(selectedMilestoneForMenu);
    }
    handleMenuClose();
  };

  const getStatusChipColor = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.Pending:
        return "warning";
      case MilestoneStatus.InProgress:
        return "info";
      case MilestoneStatus.Completed:
        return "success";
      case MilestoneStatus.Delayed:
        return "error";
      case MilestoneStatus.Cancelled:
        return "default";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const sortedMilestones = [...milestones].sort((a, b) => {
    // Sort by status priority, then by due date
    const statusPriority = {
      [MilestoneStatus.Delayed]: 0,
      [MilestoneStatus.InProgress]: 1,
      [MilestoneStatus.Pending]: 2,
      [MilestoneStatus.Completed]: 3,
      [MilestoneStatus.Cancelled]: 4,
    };
    
    const aPriority = statusPriority[a.status] || 5;
    const bPriority = statusPriority[b.status] || 5;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Mốc công việc ({milestones.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateMilestone}
          size="small"
        >
          Thêm mốc công việc
        </Button>
      </Box>

      {milestones.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Chưa có mốc công việc nào
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleCreateMilestone}
            sx={{ mt: 1 }}
          >
            Tạo mốc công việc đầu tiên
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {sortedMilestones.map((milestone) => (
            <Card key={milestone._id} sx={{ position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {milestone.title}
                      </Typography>
                      <Chip
                        label={getMilestoneStatusText(milestone.status)}
                        color={getStatusChipColor(milestone.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                        size="small"
                        icon={<span>{getMilestoneStatusIcon(milestone.status)}</span>}
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
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {milestone.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(milestone.dueDate)}
                        </Typography>
                      </Box>
                      
                      {milestone.assignedTo && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {milestone.assignedTo.displayName || milestone.assignedTo.username}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Tiến độ
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {milestone.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={milestone.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'action.hover',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getMilestoneStatusColor(milestone.status),
                          },
                        }}
                      />
                    </Box>

                    {milestone.tags && milestone.tags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {milestone.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, milestone)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Xóa
        </MenuItem>
      </Menu>

      <MilestoneDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mutate={mutate}
        mode={dialogMode}
        milestone={selectedMilestone || undefined}
        projectId={projectId}
      />
    </Box>
  );
};

export default MilestoneList; 