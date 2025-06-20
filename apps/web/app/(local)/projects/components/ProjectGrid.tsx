"use client";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
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
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: 3,
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
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {project.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
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

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Tiến độ
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: `${getStatusColor(project.status)}15`,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: getStatusColor(project.status),
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarTodayIcon
                    sx={{ fontSize: 14, color: "text.secondary" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatDateVN(project.startDate || "")}
                  </Typography>
                </Box>
                {project.endDate && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      - {formatDateVN(project.endDate)}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    {project.owner.displayName}
                  </Typography>
                </Box>
                <AvatarGroup
                  max={4}
                  sx={{
                    "& .MuiAvatar-root": {
                      width: 24,
                      height: 24,
                      fontSize: "0.75rem",
                      border: `2px solid ${theme.palette.background.paper}`,
                    },
                  }}
                >
                  {project.members.map((member) => (
                    <Avatar
                      key={member._id}
                      alt={member.displayName}
                      src={member.avatar}
                    >
                      {member.displayName.charAt(0)}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Box>

              {project.tags.length > 0 && (
                <Box
                  sx={{ display: "flex", gap: 0.5, mt: 2, flexWrap: "wrap" }}
                >
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem", height: 20 }}
                    />
                  ))}
                  {project.tags.length > 3 && (
                    <Chip
                      label={`+${project.tags.length - 3}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem", height: 20 }}
                    />
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
        PaperProps={{
          sx: {
            minWidth: 150,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>Xem chi tiết</MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedProject && onEditProject) onEditProject(selectedProject);
            handleMenuClose();
          }}
        >
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Sao chép</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          Xóa
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProjectGrid;
