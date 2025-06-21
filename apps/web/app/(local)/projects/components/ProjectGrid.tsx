"use client";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TimelineIcon from "@mui/icons-material/Timeline";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
  Project,
  ProjectPriority,
  ProjectStatus,
} from "@/types/project";
import { formatDateVN } from "@/utils/time";
import { useToast } from "@/hooks/useToast";

interface ProjectGridProps {
  projects: Project[];
  isLoading?: boolean;
  error?: any;
  searchQuery: string;
  onEditProject?: (project: Project) => void;
}

const ProjectGrid = ({ projects, isLoading, error, searchQuery, onEditProject }: ProjectGridProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { warning } = useToast();

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    project: Project
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return "#f59e0b";
      case ProjectStatus.InProgress:
        return "#10b981";
      case ProjectStatus.OnHold:
        return "#f97316";
      case ProjectStatus.Completed:
        return "#6366f1";
      case ProjectStatus.Cancelled:
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return "Lập kế hoạch";
      case ProjectStatus.InProgress:
        return "Đang thực hiện";
      case ProjectStatus.OnHold:
        return "Tạm dừng";
      case ProjectStatus.Completed:
        return "Hoàn thành";
      case ProjectStatus.Cancelled:
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Low:
        return "#10b981";
      case ProjectPriority.Medium:
        return "#f59e0b";
      case ProjectPriority.High:
        return "#f97316";
      case ProjectPriority.Critical:
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const getPriorityText = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Low:
        return "Thấp";
      case ProjectPriority.Medium:
        return "Trung bình";
      case ProjectPriority.High:
        return "Cao";
      case ProjectPriority.Critical:
        return "Khẩn cấp";
      default:
        return priority;
    }
  };

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Lỗi tải dữ liệu dự án!</div>;

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 2,
        }}
      >
        {projects.map((project) => (
          <Card
            key={project._id}
            sx={{
              height: "100%",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              transition: "all 0.2s ease-in-out",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                borderColor: getStatusColor(project.status),
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  mb: 1.5,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {project.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, height: 40, overflow: "hidden" }}
                  >
                    {project.description}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, project)}
                  sx={{ ml: 1 }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                <Chip
                  label={getStatusText(project.status)}
                  size="small"
                  sx={{
                    backgroundColor: `${getStatusColor(project.status)}15`,
                    color: getStatusColor(project.status),
                    fontWeight: 500,
                  }}
                />
                <Chip
                  label={getPriorityText(project.priority)}
                  size="small"
                  sx={{
                    backgroundColor: `${getPriorityColor(project.priority)}15`,
                    color: getPriorityColor(project.priority),
                    fontWeight: 500,
                  }}
                />
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Tiến độ
                  </Typography>
                  <Typography variant="caption" fontWeight={500}>
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "action.hover",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: getStatusColor(project.status),
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {formatDateVN(project.startDate || "")} - {formatDateVN(project.endDate || "")}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {project.owner?.displayName || project.owner?.username}
                  </Typography>
                </Box>
              </Box>

              {/* Milestones and Attachments Info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TimelineIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {project.milestones?.length || 0} milestones
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AttachFileIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {project.attachments?.length || 0} files
                  </Typography>
                </Box>
              </Box>

              {project.members && project.members.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Thành viên:
                  </Typography>
                  <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 24, height: 24 } }}>
                    {project.members.slice(0, 3).map((member) => (
                      <Avatar
                        key={member._id}
                        sx={{ width: 24, height: 24, fontSize: "0.75rem" }}
                        alt={member.displayName || member.username}
                      >
                        {(member.displayName || member.username || "").charAt(0).toUpperCase()}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  {project.members.length > 3 && (
                    <Typography variant="caption" color="text.secondary">
                      +{project.members.length - 3}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
      >
        {selectedProject && onEditProject && (
          <MenuItem onClick={() => onEditProject(selectedProject)}>
            Chỉnh sửa
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ProjectGrid;
