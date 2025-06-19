"use client";
import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import { Project, ProjectPriority, ProjectStatus } from "../../../../types/project";

interface ProjectTableProps {
  projects: Project[];
  isLoading: boolean;
}

const ProjectTable = ({ projects, isLoading }: ProjectTableProps) => {
  const theme = useTheme();

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return "#2196f3";
      case ProjectStatus.InProgress:
        return "#4caf50";
      case ProjectStatus.OnHold:
        return "#ff9800";
      case ProjectStatus.Completed:
        return "#8bc34a";
      case ProjectStatus.Cancelled:
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Critical:
        return "#d32f2f";
      case ProjectPriority.High:
        return "#f57c00";
      case ProjectPriority.Medium:
        return "#1976d2";
      case ProjectPriority.Low:
        return "#388e3c";
      default:
        return "#9e9e9e";
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return "Lên kế hoạch";
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

  const getPriorityText = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Critical:
        return "Khẩn cấp";
      case ProjectPriority.High:
        return "Cao";
      case ProjectPriority.Medium:
        return "Trung bình";
      case ProjectPriority.Low:
        return "Thấp";
      default:
        return priority;
    }
  };

  if (isLoading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>Đang tải...</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.8rem", py: 1.5 }}>
              Tên dự án
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.8rem", py: 1.5 }}>
              Trạng thái
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.8rem", py: 1.5 }}>
              Ưu tiên
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.8rem", py: 1.5 }}>
              Tiến độ
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.8rem", py: 1.5 }}>
              Thành viên
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.8rem", py: 1.5 }}>
              Thời gian
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project._id}
              sx={{
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
                cursor: "pointer",
              }}
            >
              <TableCell sx={{ py: 1.5 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 0.5,
                    }}
                  >
                    {project.name}
                  </Typography>
                  {project.description && (
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: theme.palette.text.secondary,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {project.description}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <Chip
                  label={getStatusText(project.status)}
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(project.status) + "20",
                    color: getStatusColor(project.status),
                    border: `1px solid ${getStatusColor(project.status)}40`,
                    fontSize: "0.7rem",
                    height: 22,
                  }}
                />
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <Chip
                  label={getPriorityText(project.priority)}
                  size="small"
                  sx={{
                    bgcolor: getPriorityColor(project.priority) + "20",
                    color: getPriorityColor(project.priority),
                    border: `1px solid ${getPriorityColor(project.priority)}40`,
                    fontSize: "0.7rem",
                    height: 22,
                  }}
                />
              </TableCell>
              <TableCell sx={{ py: 1.5, minWidth: 120 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: theme.palette.grey[200],
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, minWidth: 30 }}>
                    {project.progress}%
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <AvatarGroup
                  max={4}
                  sx={{
                    "& .MuiAvatar-root": {
                      width: 24,
                      height: 24,
                      fontSize: "0.65rem",
                    },
                  }}
                >
                  {project.members.map((member) => (
                    <Avatar key={member._id} alt={member.displayName} src={member.avatar}>
                      {member.displayName.charAt(0).toUpperCase()}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                  {project.startDate && format(new Date(project.startDate), "dd/MM")}
                  {project.startDate && project.endDate && " - "}
                  {project.endDate && format(new Date(project.endDate), "dd/MM/yy")}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectTable;
